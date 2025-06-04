import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { studentData, assessment, generatedReport, reportSettings } = body

    // Get user from database
    const user = await sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Save report to database
    const savedReport = await sql`
      INSERT INTO reports (
        user_id,
        student_first_name,
        student_last_name,
        student_class,
        student_gender,
        report_form,
        school_location,
        support_services,
        therapies,
        assessment_data,
        generated_report,
        report_settings
      )
      VALUES (
        ${user[0].id},
        ${studentData.firstName},
        ${studentData.lastName},
        ${studentData.classLevel},
        ${studentData.gender},
        ${studentData.reportForm},
        ${studentData.schoolLocation || null},
        ${studentData.support},
        ${studentData.therapies},
        ${JSON.stringify(assessment)},
        ${generatedReport},
        ${JSON.stringify(reportSettings)}
      )
      RETURNING id, created_at
    `

    return NextResponse.json({
      id: savedReport[0].id,
      createdAt: savedReport[0].created_at,
    })
  } catch (error) {
    console.error("Error saving report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's reports
    const reports = await sql`
      SELECT 
        id,
        student_first_name,
        student_last_name,
        student_class,
        created_at
      FROM reports 
      WHERE user_id = ${user[0].id}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
