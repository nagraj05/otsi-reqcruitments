"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const numberOfQuestions = 30;
const sections = 3;
const questionsPerSection = numberOfQuestions / sections;

export default function Home() {
  const [questionPaper, setQuestionPaper] = useState<string>("");
  const [questions, setQuestions] = useState(
    Array.from({ length: numberOfQuestions }, (_, i) => ({
      id: i + 1,
      type: "",
      marks: "",
    }))
  );

  const handleTypeChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index].type = value;
      return updated;
    });
  };

  const handleMarksChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index].marks = value;
      return updated;
    });
  };

  const handleClear = () => {
    setQuestions(
      Array.from({ length: numberOfQuestions }, (_, i) => ({
        id: i + 1,
        type: "",
        marks: "",
      }))
    );
  };

  const handleSubmit = () => {
    console.log("Submitted Questions:", questions);
  };

  return (
    <div className="h-[calc(100vh-64px)] p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-700">Question Paper:</h1>
          <Select
            value={questionPaper}
            onValueChange={(value) => setQuestionPaper(value)}
          >
            <SelectTrigger className="w-64 border-gray-300 shadow-sm">
              <SelectValue placeholder="Select Question Paper" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md rounded-md">
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {questionPaper && (
          <div className="flex gap-4 ml-auto">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {questionPaper && (
        <div className="grid grid-cols-3 gap-2">
          {[...Array(sections)].map((_, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
                Section {sectionIndex + 1}
              </h3>
              {questions
                .slice(
                  sectionIndex * questionsPerSection,
                  (sectionIndex + 1) * questionsPerSection
                )
                .map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-center justify-between mb-2"
                  >
                    <span className="font-medium text-gray-600">
                      {question.id}.
                    </span>
                    <Select
                      value={question.type}
                      onValueChange={(value) =>
                        handleTypeChange(
                          sectionIndex * questionsPerSection + index,
                          value
                        )
                      }
                    >
                      <SelectTrigger className="w-40 border-gray-300 shadow-sm">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-md rounded-md">
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Multiple">Multiple</SelectItem>
                        <SelectItem value="Fill in the blank">
                          Fill in the blank
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <input
                      type="number"
                      className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Marks"
                      value={question.marks}
                      onChange={(e) =>
                        handleMarksChange(
                          sectionIndex * questionsPerSection + index,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
