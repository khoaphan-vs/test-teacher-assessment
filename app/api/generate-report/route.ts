import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateReport } from "@/lib/report-generator";
import type { StudentData, Assessment } from "@/app/page";

interface ReportRequest {
  studentData: StudentData;
  assessment: Assessment;
  options: {
    length: "short" | "medium" | "long";
    focus: "balanced" | "strengths" | "weaknesses";
    tone: "supportive" | "neutral" | "direct";
    audience: "parents" | "students" | "teachers";
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ReportRequest = await request.json();

    // Validate required fields
    if (!body.studentData || !body.assessment || !body.options) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate the report using AI
    const report = await generateReport(
      body.studentData,
      body.assessment,
      body.options
    );

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error in generate-report API:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
