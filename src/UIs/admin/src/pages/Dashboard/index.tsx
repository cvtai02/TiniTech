import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex-grow  h-screen gap-4 p-8 bg-transparent text-black flex flex-col ">
      <div className="w-full grow-12 bg-amber-100">Overview</div>

      <div className="w-full grow-32 flex gap-4 bg-amber-100">
        <div className="grow  rounded-md bg-amber-300">Overview</div>
        <div className="grow  rounded-md bg-amber-300">Overview</div>
        <div className="grow  rounded-md bg-amber-300">Overview</div>
        <div className="grow  rounded-md bg-amber-300">Overview</div>
      </div>

      <div className="w-full grow-72  flex gap-4 bg-amber-100">
        <div className="grow-6 rounded-md bg-amber-300">Overview</div>
        <div className="grow-4 rounded-md bg-amber-300">Overview</div>
      </div>

      <div className="w-full grow-54 flex gap-4 bg-amber-100">
        <div className="grow-7 rounded-md bg-amber-300">Overview</div>
        <div className="grow-3 rounded-md bg-amber-300">Overview</div>
      </div>
    </div>
  );
};

export default Home;
