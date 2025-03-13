"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface CustomCanvasRenderingContext2D extends CanvasRenderingContext2D {
  lastX?: number;
  lastY?: number;
}

let socket: Socket | null = null;

const Canvas = ({ color, lineWidth }: { color: string; lineWidth: number }) => {
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
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(prevX, prevY);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
      }
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
      const ctx = canvas.getContext("2d") as CustomCanvasRenderingContext2D;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctxRef.current = ctx;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current?.beginPath();
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !ctxRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const prevX = ctxRef.current.lastX ?? offsetX;
    const prevY = ctxRef.current.lastY ?? offsetY;

    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);

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
