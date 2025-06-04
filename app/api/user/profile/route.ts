import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface CreateUserRequest {
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  school?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json()
    const { clerkId, email, firstName, lastName, school } = body

    if (!clerkId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE clerk_id = ${clerkId}
    `

    if (existingUser.length > 0) {
      // User exists, return existing profile
      return NextResponse.json({
        id: existingUser[0].id,
        email: existingUser[0].email,
        firstName: existingUser[0].first_name,
        lastName: existingUser[0].last_name,
        school: existingUser[0].school,
        role: existingUser[0].role,
        createdAt: existingUser[0].created_at,
      })
    }

    // Create new user
    const newUser = await sql`
      INSERT INTO users (clerk_id, email, first_name, last_name, school, role)
      VALUES (${clerkId}, ${email}, ${firstName}, ${lastName}, ${school || null}, 'teacher')
      RETURNING *
    `

    return NextResponse.json({
      id: newUser[0].id,
      email: newUser[0].email,
      firstName: newUser[0].first_name,
      lastName: newUser[0].last_name,
      school: newUser[0].school,
      role: newUser[0].role,
      createdAt: newUser[0].created_at,
    })
  } catch (error) {
    console.error("Error creating/fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clerkId = searchParams.get("clerkId")

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 })
    }

    const user = await sql`
      SELECT * FROM users WHERE clerk_id = ${clerkId}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user[0].id,
      email: user[0].email,
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      school: user[0].school,
      role: user[0].role,
      createdAt: user[0].created_at,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
