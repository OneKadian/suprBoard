"use client";
import Board from "../../components/Board";
import Toolbar from "../../components/Toolbar";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Page({ params }) {
  const { board: boardId } = params;
  const roomId = Array.isArray(boardId) ? boardId[0] : boardId; // Extract the ID from array

  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#ffffff");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [canvasColor, setCanvasColor] = useState("#121212");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState("Abhishek");
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState([]);

  const server = process.env.NEXT_PUBLIC_SERVER_URL;
  const connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Anonymous");

    // Only proceed if we have a valid roomId
    if (!roomId) {
      setIsLive(false);
      return;
    }

    setIsLive(true);
    const socket = io(server, connectionOptions);
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("updateCanvas", (data) => {
      setElements(data.updatedElements);
      setCanvasColor(data.canvasColor);
    });

    socket.on("getMessage", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    // ping server every 2 min to prevent render server from sleeping
    socket.on("ping", () => {
      setTimeout(() => {
        // Fixed typo: settimeout -> setTimeout
        socket.emit("pong");
      }, 120000);
    });

    const data = {
      roomId: roomId, // Using our extracted roomId
      userName: userName,
    };

    socket.emit("joinRoom", data);
    console.log("Joining room:", data);

    return () => {
      socket.off("updateCanvas");
      socket.off("getMessage");
      socket.off("ping");
      socket.disconnect();
    };
  }, [roomId, server]); // Added proper dependencies

  const sendMessage = (message) => {
    const data = {
      message: message,
      userName: userName,
      roomId: roomId, // Using our extracted roomId
      socketId: socket?.id,
    };
    if (socket) {
      socket.emit("sendMessage", data);
    }
  };

  const updateCanvas = (updatedElements) => {
    if (socket) {
      const data = {
        roomId: roomId, // Using our extracted roomId
        userName: userName,
        updatedElements: updatedElements,
        canvasColor: canvasColor,
      };
      socket.emit("updateCanvas", data);
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 z-20 w-full">
        <Toolbar
          color={color}
          setColor={setColor}
          tool={tool}
          setTool={setTool}
          history={history}
          setHistory={setHistory}
          elements={elements}
          setElements={setElements}
          canvasRef={canvasRef}
          canvasColor={canvasColor}
          setCanvasColor={setCanvasColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          userName={userName}
          setUserName={setUserName}
          isLive={isLive}
          setIsLive={setIsLive}
          params={{ roomId: roomId }} // Pass the extracted roomId
          updateCanvas={updateCanvas}
          messages={messages}
          sendMessage={sendMessage}
          socketId={socket?.id}
        />
      </div>
      <Board
        canvasRef={canvasRef}
        ctx={ctx}
        color={color}
        tool={tool}
        elements={elements}
        setElements={setElements}
        history={history}
        setHistory={setHistory}
        canvasColor={canvasColor}
        strokeWidth={strokeWidth}
        updateCanvas={updateCanvas}
      />
    </div>
  );
}
