"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, AlertCircle } from "lucide-react"
import type { User } from "@/app/page"

interface AuthFormProps {
  onLogin: (user: User) => void
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    school: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        throw new Error("Bitte füllen Sie alle Pflichtfelder aus.")
      }

      if (!isLogin && !formData.name) {
        throw new Error("Name ist erforderlich für die Registrierung.")
      }

      // Call authentication API
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isLogin ? "login" : "register",
          email: formData.email,
          password: formData.password,
          name: formData.name,
          school: formData.school,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ein Fehler ist aufgetreten.")
      }

      // Successfully authenticated
      onLogin(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.")
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes, provide a quick login function
  const handleDemoLogin = () => {
    onLogin({
      id: "demo",
      email: "demo@schule.ch",
      name: "Demo Lehrperson",
      school: "Primarschule Musterstadt",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center gap-2 mb-8">
        <BookOpen className="h-10 w-10 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">Lernbericht Generator</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Anmelden" : "Registrieren"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Melden Sie sich an, um Lernberichte zu erstellen."
              : "Erstellen Sie ein Konto, um Lernberichte zu generieren."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vor- und Nachname"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ihre.email@schule.ch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="school">Schule (optional)</Label>
                <Input
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Name Ihrer Schule"
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wird verarbeitet..." : isLogin ? "Anmelden" : "Registrieren"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" type="button" className="w-full" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Neues Konto erstellen" : "Zurück zur Anmeldung"}
          </Button>
          <Button variant="ghost" type="button" className="w-full text-blue-600" onClick={handleDemoLogin}>
            Demo-Zugang verwenden
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">Datenschutzkonform entwickelt für Schweizer Schulen</p>
        </CardFooter>
      </Card>
    </div>
  )
}
