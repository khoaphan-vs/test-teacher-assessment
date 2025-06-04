import { type NextRequest, NextResponse } from "next/server"

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
  school?: string
}

// Mock user database - in production, this would be a real database
const mockUsers = [
  {
    id: "1",
    email: "demo@schule.ch",
    password: "demo123", // In production, this would be hashed
    name: "Demo Lehrperson",
    school: "Primarschule Musterstadt",
  },
  {
    id: "2",
    email: "maria.mueller@schule.ch",
    password: "secure123",
    name: "Maria Müller",
    school: "Sekundarschule Beispielstadt",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "login") {
      const { email, password }: LoginRequest = body

      // Find user in mock database
      const user = mockUsers.find((u) => u.email === email && u.password === password)

      if (!user) {
        return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 })
      }

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json({ user: userWithoutPassword })
    }

    if (action === "register") {
      const { email, password, name, school }: RegisterRequest = body

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email)
      if (existingUser) {
        return NextResponse.json({ error: "E-Mail-Adresse bereits registriert" }, { status: 400 })
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, hash this password
        name,
        school: school || undefined,
      }

      // Add to mock database
      mockUsers.push(newUser)

      // Return user data without password
      const { password: _, ...userWithoutPassword } = newUser
      return NextResponse.json({ user: userWithoutPassword })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
