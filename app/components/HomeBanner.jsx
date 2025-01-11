import React from "react";

const HomeBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-300">
      {/* Centered Heading */}
      <h1 className="text-4xl font-bold text-center mb-12 text-black sm:text-5xl lg:text-6xl">
        Welcome to SuprBoard
      </h1>

      {/* Two Sections */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8">
        {/* Left Section: Create a Room */}
        <div className="flex flex-col items-center justify-center bg-gray-200 p-6 shadow-md rounded-lg flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Create a Room
          </h2>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg">
            Create
          </button>
        </div>

        {/* Right Section: Join a Room */}
        <div className="flex flex-col items-center justify-center bg-gray-200 p-6 shadow-md rounded-lg flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Join a Room
          </h2>
          <input
            type="text"
            placeholder="Enter Room Code"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg">
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
