"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

interface ToolBarProps {
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onClearCanvas: (value: boolean) => void;
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
    <Card className="w-full p-4 bg-gray-100 shadow-md rounded-2xl">
      <CardContent className="flex items-center justify-between gap-6">
        {/* 🎨 Color Picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              onColorChange(e.target.value);
            }}
            className="w-10 h-10 p-1 rounded-full border"
          />
        </div>

        {/* 📏 Line Width Slider */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Line Width:</span>
          <Slider
            max={100}
            step={1}
            value={[lineWidth]}
            onValueChange={(value) => {
              setLineWidth(value[0]);
              onLineWidthChange(value[0]);
            }}
            className="w-40"
          />
          <span className="text-xs text-gray-600">{lineWidth}px</span>
        </div>

        {/* 🎯 Buttons Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onErase}
            className="hover:bg-red-100"
          >
            Erase
          </Button>
          <Button variant="destructive" onClick={() => onClearCanvas(true)}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolBar;
