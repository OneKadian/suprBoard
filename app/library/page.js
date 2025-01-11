"use client";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Page = () => {
  const { userId } = useAuth(); // Authentication from Clerk
  const [boards, setBoards] = useState([]); // State to store fetched boards
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const router = useRouter(); // Initialize the router

  // Fetch boards on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data, error } = await supabase
          .from("boards")
          .select("*") // Fetch board_id and board_name
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching boards:", error.message);
          setError("Failed to fetch boards. Please try again later.");
        } else {
          setBoards(data); // Set boards data
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false); // Set loading state to false
        console.log(userId);
      }
    };

    if (userId) {
      fetchBoards(); // Fetch boards only if userId exists
    }
  }, [userId]);

  // Function to create a new board
  const createNewBoard = async () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate random digits
    const newBoardId = `${userId}-${randomDigits}`; // Create unique board ID
    const boardName = "Kadian Board"; // Default board name

    try {
      // Insert the new board into the database
      const { error } = await supabase.from("boards").insert([
        {
          user_id: userId,
          board_id: newBoardId,
          board_name: boardName,
        },
      ]);

      if (error) {
        console.error("Error creating board:", error.message);
        setError("Failed to create board. Please try again later.");
        return;
      }

      // Redirect to the newly created board
      router.push(`/create/${newBoardId}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#F3F5F8] flex justify-center items-center min-h-screen">
      <div className="w-full max-w-7xl flex flex-col justify-center mt-24 mb-16 lg:mb-0 lg:mt-0 px-4 lg:px-12">
        <div className="flex justify-center mb-6">
          {/* Create New Board Button */}
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300"
            onClick={createNewBoard} // Call createNewBoard on click
            disabled={isLoading} // Disable button while loading
          >
            Create a New Board +
          </button>
        </div>

        {isLoading ? ( // Show spinner while loading
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={48} />
          </Box>
        ) : (
          <div className="w-full flex flex-col items-center">
            {error ? ( // Display error message if any
              <div className="text-red-500">{error}</div>
            ) : boards.length === 0 ? ( // If no boards, display message
              <div className="text-gray-700 text-lg">
                Create your first board
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {boards.map((board) => (
                  <div
                    key={board.board_id} // Use board_id as the unique key
                    className="max-w-sm p-6 bg-gray-300 border border-gray-200 rounded-lg shadow-md"
                  >
                    {/* Board Name */}
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {board.board_name}
                    </h5>

                    {/* Open Board Button */}
                    <button
                      className="inline-flex mt-2 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                      onClick={() => {
                        // Redirect to the dynamic board route
                        router.push(`/create/${board.board_id}`);
                      }}
                    >
                      Open Board
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
