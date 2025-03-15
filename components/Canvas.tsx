"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface CustomCanvasRenderingContext2D extends CanvasRenderingContext2D {
  lastX?: number;
  lastY?: number;
}

let socket: Socket | null = null;

const Canvas = ({
  color,
  lineWidth,
  clearCanvas,
  setClearCanvas,
}: {
  color: string;
  lineWidth: number;
  clearCanvas: boolean;
  setClearCanvas: (clear: boolean) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CustomCanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    socket = io("http://localhost:3001");

    socket.on("connect", () => console.log("Connected to WebSocket"));

    // Listen for incoming draw events
    socket.on("draw", ({ x, y, prevX, prevY, color, lineWidth }) => {
      if (ctxRef.current) {
        ctxRef.current.strokeStyle = color;
        ctxRef.current.lineWidth = lineWidth;
        ctxRef.current.beginPath(); // Start a new path
        ctxRef.current.moveTo(prevX, prevY);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
      }
    });

    socket.on("clear", clear);

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (clearCanvas) {
      socket?.emit("clear");
      clear();
    }
    setClearCanvas(false);
  }, [clearCanvas, setClearCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set the canvas's internal size to match its CSS size
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d") as CustomCanvasRenderingContext2D;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctxRef.current = ctx;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const { clientX, clientY } = e;
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    const offsetX = clientX - (canvasRect?.left || 0);
    const offsetY = clientY - (canvasRect?.top || 0);

    if (ctxRef.current) {
      ctxRef.current.beginPath(); // Start a new path
      ctxRef.current.moveTo(offsetX, offsetY); // Move to the starting point
      ctxRef.current.lastX = offsetX;
      ctxRef.current.lastY = offsetY;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctxRef.current) {
      ctxRef.current.lastX = undefined;
      ctxRef.current.lastY = undefined;
    }
  };

  const clear = () => {
    if (ctxRef.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !ctxRef.current) return;

    const { clientX, clientY } = e;
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    const offsetX = clientX - (canvasRect?.left || 0);
    const offsetY = clientY - (canvasRect?.top || 0);

    const prevX = ctxRef.current.lastX ?? offsetX;
    const prevY = ctxRef.current.lastY ?? offsetY;

    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;

    ctxRef.current.beginPath(); // Start a new path
    ctxRef.current.moveTo(prevX, prevY);
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();

    socket?.emit("draw", {
      x: offsetX,
      y: offsetY,
      prevX,
      prevY,
      color,
      lineWidth,
    });

    ctxRef.current.lastX = offsetX;
    ctxRef.current.lastY = offsetY;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
      style={{
        border: "1px solid black",
        cursor: "crosshair",
        background: "white",
        width: "100%",
        height: "80vh",
      }}
    />
  );
};

export default Canvas;
