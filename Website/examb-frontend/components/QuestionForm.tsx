"use client";
import { Key, useState } from "react";
import { adminService } from "@/services/adminService";

interface QuestionFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: any;
}

export default function QuestionForm({
  onSubmit,
  onCancel,
  initialData,
}: QuestionFormProps) {
  const [formData, setFormData] = useState({
    questionText: initialData?.questionText || "",
    examId: initialData?.examId || "",
    options: initialData?.options || [
      "",
      "",
      "",
      "",
    ],
    correctAnswer:
      initialData?.correctAnswer || 0,
    marks: initialData?.marks || 1,
    questionType:
      initialData?.questionType ||
      "multiple-choice",
  });
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (
    index: number,
    value: string
  ) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await adminService.updateQuestion(
          initialData._id,
          formData
        );
      } else {
        await adminService.createQuestion(
          formData
        );
      }
      onSubmit();
    } catch (error) {
      console.error(
        "Error saving question:",
        error
      );
      alert("Error saving question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question Text
        </label>
        <textarea
          required
          value={formData.questionText}
          onChange={(e) =>
            setFormData({
              ...formData,
              questionText: e.target.value,
            })
          }
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Exam ID
        </label>
        <input
          type="text"
          required
          value={formData.examId}
          onChange={(e) =>
            setFormData({
              ...formData,
              examId: e.target.value,
            })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question Type
        </label>
        <select
          value={formData.questionType}
          onChange={(e) =>
            setFormData({
              ...formData,
              questionType: e.target.value,
            })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="multiple-choice">
            Multiple Choice
          </option>
          <option value="true-false">
            True/False
          </option>
          <option value="short-answer">
            Short Answer
          </option>
          <option value="essay">Essay</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        {formData.options.map(
          (
            option:
              | string
              | number
              | readonly string[]
              | undefined,
            index: Key | null | undefined
          ) => (
            <div
              key={index}
              className="flex items-center space-x-2 mb-2"
            >
              <span className="w-6 text-sm">
                {index + 1}.
              </span>
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange(
                    index,
                    e.target.value
                  )
                }
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Option ${
                  index + 1
                }`}
              />
            </div>
          )
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Correct Answer (Option Number)
        </label>
        <input
          type="number"
          min="1"
          max="4"
          value={formData.correctAnswer + 1}
          onChange={(e) =>
            setFormData({
              ...formData,
              correctAnswer:
                parseInt(e.target.value) - 1,
            })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Marks
        </label>
        <input
          type="number"
          value={formData.marks}
          onChange={(e) =>
            setFormData({
              ...formData,
              marks: parseInt(e.target.value),
            })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update"
            : "Create"}
        </button>
      </div>
    </form>
  );
}
