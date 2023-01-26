import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SendEth", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySendEthFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SendEthFactory = await ethers.getContractFactory("SendEth");
    const sendEthContract = await SendEthFactory.deploy();
    const ownerContract = sendEthContract.connect(owner);
    const otherAccountContract = sendEthContract.connect(otherAccount);
    return { sendEthContract, owner, otherAccount, ownerContract, otherAccountContract };
  }

  describe("transferETH", () => {
    it("should emit success transfer and have timestamp", async () => {
      const { ownerContract, otherAccount } = await loadFixture(deploySendEthFixture);
      const transferAmount = ethers.utils.parseEther("0.01");
      const transferTx = await ownerContract.transferETH(otherAccount.address, "Thanks for today", {
        value: transferAmount,
      });
      const transferTxReceipt = await transferTx.wait(1);
      expect(transferTx).to.emit(ownerContract, "TransferSuccess");

      const timestamp = (transferTxReceipt as any).events[0].args.timestamp;
      expect(timestamp).to.not.be.empty;
    });

    it("should match balance", async () => {
      const { ownerContract, otherAccount, owner } = await loadFixture(deploySendEthFixture);
      const transferAmount = ethers.utils.parseEther("0.01");
      const ownerStartingBalance = await owner.getBalance();
      const otherAccountStartingBalance = await otherAccount.getBalance();
      const transferTx = await ownerContract.transferETH(otherAccount.address, "Thanks for today", {
        value: transferAmount,
      });
      const transactionReceipt = await transferTx.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      expect((await owner.getBalance()).toString()).to.equal(
        ownerStartingBalance.sub(transferAmount.add(gasCost)).toString()
      );
      expect((await otherAccount.getBalance()).toString()).to.equal(
        otherAccountStartingBalance.add(transferAmount).toString()
      );
    });

    it("should revert receiver not allowed error", async () => {
      const { ownerContract, otherAccount, owner } = await loadFixture(deploySendEthFixture);
      const transferAmount = ethers.utils.parseEther("0");
      await expect(
        ownerContract.transferETH(owner.address, "Thanks for today", {
          value: transferAmount,
        })
      ).to.be.revertedWithCustomError(ownerContract, "SendEth__ReceiverNotAllowed");
    });

    it("should revert invalid amount error", async () => {
      const { ownerContract, otherAccount, owner } = await loadFixture(deploySendEthFixture);
      const transferAmount = ethers.utils.parseEther("0");
      await expect(
        ownerContract.transferETH(otherAccount.address, "Thanks for today", {
          value: transferAmount,
        })
      ).to.be.revertedWithCustomError(ownerContract, "SendEth__InvalidAmount");
    });
  });

  describe("myTransactions", () => {
    it("should return 0 transactions", async () => {
      const { ownerContract } = await loadFixture(deploySendEthFixture);
      const transactions = await ownerContract.myTransactions();
      expect(transactions.length.toString()).to.equal("0");
    });

    it("should return 1 transaction for both sender and receiver", async () => {
      const { ownerContract, otherAccount, otherAccountContract } = await loadFixture(deploySendEthFixture);
      const transferAmount = ethers.utils.parseEther("0.01");
      const transferTx = await ownerContract.transferETH(otherAccount.address, "Thanks for today", {
        value: transferAmount,
      });
      await transferTx.wait(1);

      const senderTransactions = await ownerContract.myTransactions();
      expect(senderTransactions.length.toString()).to.equal("1");

      const recipientTransactions = await otherAccountContract.myTransactions();
      expect(recipientTransactions.length.toString()).to.equal("1");
    });
  });
});
