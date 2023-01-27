export const Loader = () => {
  return (
    <div className=" absolute top-0 w-full h-full">
      <div className="flex items-center justify-center h-full space-x-4">
        <div className=" w-2 h-2 animate-ping bg-red-500"></div>
        <div className=" w-2 h-2 animate-ping bg-red-500"></div>
        <div className=" w-2 h-2 animate-ping bg-red-500"></div>
      </div>
    </div>
  );
};
