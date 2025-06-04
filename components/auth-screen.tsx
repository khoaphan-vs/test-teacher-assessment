"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Shield, Zap } from "lucide-react"

export function AuthScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Lernbericht Generator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Erstellen Sie schnell und qualitativ hochwertige individualisierte Lernberichte mit Hilfe von KI-gestützter
            Textgenerierung für Schweizer Schulen.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">KI-gestützt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Intelligente Textgenerierung basierend auf standardisierten Einschätzungen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Individualisiert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Personalisierte Berichte mit verschiedenen Tonfall- und Fokusoptionen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Datenschutz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Schweizer Datenschutzstandards und sichere Verschlüsselung
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Authentication Card */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Willkommen</CardTitle>
            <CardDescription>
              Melden Sie sich an oder erstellen Sie ein Konto, um mit der Erstellung von Lernberichten zu beginnen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignInButton mode="modal">
              <Button className="w-full" size="lg">
                Anmelden
              </Button>
            </SignInButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">oder</span>
              </div>
            </div>

            <SignUpButton mode="modal">
              <Button variant="outline" className="w-full" size="lg">
                Neues Konto erstellen
              </Button>
            </SignUpButton>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2024 Lernbericht Generator - Datenschutzkonform entwickelt für Schweizer Schulen</p>
        </div>
      </div>
    </div>
  )
}
