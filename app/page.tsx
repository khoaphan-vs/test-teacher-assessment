"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentDataForm } from "@/components/student-data-form"
import { AssessmentForm } from "@/components/assessment-form"
import { ReportGenerator } from "@/components/report-generator"
import { BookOpen, FileText, Settings, Users } from "lucide-react"

export type StudentData = {
  firstName: string
  lastName: string
  gender: "male" | "female" | "diverse"
  reportForm: "er-sie" | "du"
  classLevel: string
  schoolLocation?: string
  support: string[]
  therapies: string[]
}

export type Assessment = {
  [category: string]: {
    [subcategory: string]: "positive" | "neutral" | "negative" | null
  }
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<"data" | "assessment" | "report">("data")
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [assessment, setAssessment] = useState<Assessment>({})

  const handleStudentDataSubmit = (data: StudentData) => {
    setStudentData(data)
    setCurrentStep("assessment")
  }

  const handleAssessmentSubmit = (assessmentData: Assessment) => {
    setAssessment(assessmentData)
    setCurrentStep("report")
  }

  const resetApp = () => {
    setCurrentStep("data")
    setStudentData(null)
    setAssessment({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Lernbericht Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Erstellen Sie schnell und qualitativ hochwertige individualisierte Lernberichte mit Hilfe von KI-gestützter
            Textgenerierung.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                currentStep === "data"
                  ? "bg-blue-600 text-white"
                  : studentData
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="font-medium">Schülerdaten</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                currentStep === "assessment"
                  ? "bg-blue-600 text-white"
                  : Object.keys(assessment).length > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium">Einschätzung</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                currentStep === "report" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Bericht</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === "data" && (
            <Card>
              <CardHeader>
                <CardTitle>Grunddaten der Schülerin / des Schülers</CardTitle>
                <CardDescription>
                  Bitte geben Sie die grundlegenden Informationen zur Schülerin oder zum Schüler ein.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudentDataForm onSubmit={handleStudentDataSubmit} />
              </CardContent>
            </Card>
          )}

          {currentStep === "assessment" && studentData && (
            <Card>
              <CardHeader>
                <CardTitle>Einschätzung durch Satzbausteine</CardTitle>
                <CardDescription>
                  Beurteilen Sie {studentData.firstName} {studentData.lastName} durch Auswahl der passenden
                  Satzbausteine.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AssessmentForm
                  studentData={studentData}
                  onSubmit={handleAssessmentSubmit}
                  onBack={() => setCurrentStep("data")}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === "report" && studentData && (
            <ReportGenerator
              studentData={studentData}
              assessment={assessment}
              onBack={() => setCurrentStep("assessment")}
              onReset={resetApp}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2024 Lernbericht Generator - Datenschutzkonform entwickelt für Schweizer Schulen</p>
        </div>
      </div>
    </div>
  )
}
