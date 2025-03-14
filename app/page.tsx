"use client";

import { useState } from "react";
import Canvas from "@/components/Canvas";
import ToolBar from "@/components/ToolBar";

export default function Home() {
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [clearCanvas, setClearCanvas] = useState(false);

  return (
    <div>
      <ToolBar
        onColorChange={setColor}
        onLineWidthChange={setLineWidth}
        onClearCanvas={setClearCanvas}
        onErase={() => setColor("#FFFFFF")}
      />
      <Canvas color={color} lineWidth={lineWidth} />
    </div>
  );
}
