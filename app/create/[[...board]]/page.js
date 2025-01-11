"use client";
import React from "react";

const Page = ({ params }) => {
  const { board: boardId } = params; // Note: using 'story' since it's from [[...story]]

  return (
    <div className="mt-20">
      <button
        onClick={() => console.log(boardId)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Log Board ID
      </button>
    </div>
  );
};

export default Page;
