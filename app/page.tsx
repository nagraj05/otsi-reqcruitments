"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const numberOfQuestions = 30;


export default function Home() {
  const [questionPaper, setQuestionPaper] = useState<string>("");
  return (
    <div className=" h-[calc(100vh-64px)]">
      <div className="flex gap-2 p-4 items-center">
        <h1 className="text-lg font-bold">Question Paper</h1>
        <Select
          value={questionPaper}
          onValueChange={(value) => setQuestionPaper(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Question Paper" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
          </SelectContent>
        </Select>
      </div>
        <div>
          {questionPaper && (
            
            <div>
              test
            </div>
          )}
        </div>
    </div>
  );
}
