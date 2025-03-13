"use client";

import { useState } from "react";

interface ToolBarProps {
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onClearCanvas: () => void;
  onErase: () => void;
}

const ToolBar = ({
  onColorChange,
  onLineWidthChange,
  onClearCanvas,
  onErase,
}: ToolBarProps) => {
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px",
        background: "#ddd",
      }}
    >
      <label>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            onColorChange(e.target.value);
          }}
        />
      </label>
      <label>
        Line Width:
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => {
            const width = parseInt(e.target.value);
            setLineWidth(width);
            onLineWidthChange(width);
          }}
        />
      </label>
      <button onClick={onErase}>Erase</button>
      <button onClick={onClearCanvas}>Clear</button>
    </div>
  );
};

export default ToolBar;
