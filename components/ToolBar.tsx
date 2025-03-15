"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  username: string;
  userID: string;
}

interface ToolBarProps {
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onClearCanvas: (value: boolean) => void;
  onNameChange: (name: string) => void;
  onErase: () => void;
  userList: User[]; // Updated to use User interface
}

const ToolBar = ({
  onColorChange,
  onLineWidthChange,
  onClearCanvas,
  onNameChange,
  onErase,
  userList,
}: ToolBarProps) => {
  const [color, setColor] = useState("#000000");
  const [username, setUsername] = useState("");
  const [lineWidth, setLineWidth] = useState([3]); // Slider value as an array

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onColorChange(newColor);
  };

  // Handle line width change
  const handleLineWidthChange = (value: number[]) => {
    setLineWidth(value);
    onLineWidthChange(value[0]);
  };

  return (
    <Card className="w-full p-4 bg-gray-100 shadow-md rounded-2xl">
      <CardContent className="flex items-center justify-between gap-6">
        {/* Username */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Username:</span>
          <Input
            type="text"
            value={username}
            placeholder="Enter your username"
            className="w-40 p-2 text-sm border rounded-lg"
            onChange={handleUsernameChange}
          />
          <Button
            onClick={() => onNameChange(username)}
            className="bg-blue-500 text-white"
          >
            Set
          </Button>
        </div>

        {/* 🎨 Color Picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Color:</span>
          <Input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-10 h-10 p-1 rounded-full border"
          />
        </div>

        {/* 📏 Line Width Slider */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Line Width:</span>
          <Slider
            max={100}
            step={1}
            value={lineWidth}
            onValueChange={handleLineWidthChange}
            className="w-40"
          />
          <span className="text-xs text-gray-600">{lineWidth[0]}px</span>
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

        {/* 📦 Users Connected */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">All Users ({userList.length})</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {userList.map((user) => (
              <DropdownMenuItem key={user.userID}>
                {user.username} ({user.userID})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};

export default ToolBar;
