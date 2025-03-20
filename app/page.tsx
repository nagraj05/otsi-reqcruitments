"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const sectionsCount = 3;
const questionsPerSection = 10;

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [questionPaper, setQuestionPaper] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [sections, setSections] = useState(
    Array.from({ length: sectionsCount }, (_, sectionIndex) => ({
      sectionNumber: sectionIndex + 1,
      questions: Array.from(
        { length: questionsPerSection },
        (_, questionIndex) => ({
          number: questionIndex + 1,
          type: "",
          marks: "",
        })
      ),
    }))
  );
  const [loading, setLoading] = useState(!!id);
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [recordId, setRecordId] = useState<number | null>(id ? parseInt(id) : null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecord(parseInt(id));
    }
  }, [id]);

  const fetchRecord = async (recordId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("question_papers")
        .select("*")
        .eq("id", recordId)
        .single();

      if (error) throw error;
      
      if (data) {
        setName(data.name);
        setQuestionPaper(data.question_paper);
        
        if (data.sections_data) {
          setSections(data.sections_data);
        }
      }
    } catch (error) {
      console.error("Error fetching record:", error);
      toast.error("Error loading the record");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionTypeChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].type = value;
    setSections(updatedSections);
  };

  const handleMarksChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].marks = value;
    setSections(updatedSections);
  };

  const handleSubmitClick = () => {
    const hasIncompleteQuestions = sections.some((section) =>
      section.questions.some(
        (question) =>
          (!question.type && question.marks) ||
          (question.type && !question.marks)
      )
    );

    if (hasIncompleteQuestions) {
      toast.error(
        "Please fill both question type and marks for all questions with data"
      );
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const sectionMarks = sections.map((section) => {
        return section.questions.reduce((total, question) => {
          return total + (parseInt(question.marks) || 0);
        }, 0);
      });

      const totalMarks = sectionMarks.reduce((sum, marks) => sum + marks, 0);
      
      const recordData = {
        name,
        question_paper: questionPaper,
        section_1_marks: sectionMarks[0],
        section_2_marks: sectionMarks[1],
        section_3_marks: sectionMarks[2],
        total_marks: totalMarks,
        sections_data: sections,
      };
      
      let error;
      
      if (isEditMode && recordId) {
        // Update existing record
        const result = await supabase
          .from("question_papers")
          .update(recordData)
          .eq("id", recordId);
          
        error = result.error;
        
        if (!error) {
          toast.success("Record updated successfully!");
        }
      } else {
        // Insert new record
        const result = await supabase
          .from("question_papers")
          .insert([recordData]);
          
        error = result.error;
        
        if (!error) {
          toast.success("Data submitted successfully!");
          handleClear();
        }
      }

      if (error) throw error;
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const handleClear = () => {
    setQuestionPaper("");
    setName("");
    setIsEditMode(false);
    setRecordId(null);
    setSections(
      Array.from({ length: sectionsCount }, (_, sectionIndex) => ({
        sectionNumber: sectionIndex + 1,
        questions: Array.from(
          { length: questionsPerSection },
          (_, questionIndex) => ({
            number: questionIndex + 1,
            type: "",
            marks: "",
          })
        ),
      }))
    );
  };

  if (loading) {
    return <div className="p-8 flex justify-center">Loading form data...</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="flex justify-between p-4 items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">Name</h1>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <h1 className="text-lg font-bold w-[300px]">Question Paper</h1>
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
        <div className="flex gap-2">
          {isEditMode && (
            <Button
              variant="outline"
              onClick={handleClear}
              className="px-4 py-2"
            >
              New Form
            </Button>
          )}
          <Button
            onClick={handleSubmitClick}
            className="px-4 py-2"
            disabled={!name || !questionPaper}
          >
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
      <div className="p-4">
        {questionPaper && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Question Paper {questionPaper}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {sections.map((section, sectionIndex) => (
                <div key={section.sectionNumber} className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Section {section.sectionNumber}
                  </h3>
                  <div className="">
                    {section.questions.map((question, questionIndex) => (
                      <div
                        key={question.number}
                        className="flex items-center gap-4 mb-2"
                      >
                        <span className="w-8">Q{question.number}.</span>
                        <Select
                          value={question.type}
                          onValueChange={(value) =>
                            handleQuestionTypeChange(
                              sectionIndex,
                              questionIndex,
                              value
                            )
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Question Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">
                              Single Choice
                            </SelectItem>
                            <SelectItem value="multiple">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="fill">
                              Fill in the blank
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <input
                          type="number"
                          placeholder="Marks"
                          className="border p-2 w-20 rounded"
                          value={question.marks}
                          onChange={(e) =>
                            handleMarksChange(
                              sectionIndex,
                              questionIndex,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {isEditMode ? "Update" : "Submission"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {isEditMode ? "update" : "submit"}? {!isEditMode && "Once submitted, you cannot modify the data."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit}>{isEditMode ? "Update" : "Submit"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}