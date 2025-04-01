const RootLoading = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className=" w-5 h-5 rounded-full border-4 relative box-border">
        <span className="block absolute bottom-0 right-0 w-[50%] h-[50%] bg-red-500" />
      </div>
      <p className="animate-pulse"> Loading...</p>
    </div>
  );
};

export default RootLoading;
