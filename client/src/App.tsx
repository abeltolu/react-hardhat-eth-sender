import { Balance } from "./components/balance/balance";
import { Header } from "./components/header/header";
import { Transactions } from "./components/transactions/transactions";

function App() {
  return (
    <div className="py-4 md:py-6 px-4 md:px-0 w-full max-w-[800px] mx-auto space-y-4">
      {/** Header component that has both the welcome and connect wallet button */}
      <Header />
      {/** Section that shows the wallet balance and the send ETH button */}
      <Balance />
      {/** Section that shows Recent transactions */}
      <Transactions />
      {/** Footer that shows Made with love by @abeltolu */}
    </div>
  );
}

export default App;
