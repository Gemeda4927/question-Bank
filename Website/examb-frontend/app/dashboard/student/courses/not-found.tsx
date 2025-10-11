"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Adjust import based on your UI library

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    console.log(
      "🔍 Not Found page loaded for /student/courses/[courseId]"
    );
  }, []);

  const handleGoBack = () => {
    router.push("/dashboard/student/marketplace");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404 - Course Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The course with ID{" "}
          {new URLSearchParams(
            window.location.search
          ).get("id") || "[courseId]"}{" "}
          could not be found.
        </p>
        <Button
          onClick={handleGoBack}
          className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg"
        >
          Back to Marketplace
        </Button>
      </div>
    </div>
  );
}
