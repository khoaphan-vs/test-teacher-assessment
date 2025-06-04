"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { StudentData, Assessment } from "@/app/page"
import { assessmentData } from "@/lib/assessment-data"

interface AssessmentFormProps {
  studentData: StudentData
  onSubmit: (assessment: Assessment) => void
  onBack: () => void
}

export function AssessmentForm({ studentData, onSubmit, onBack }: AssessmentFormProps) {
  const [assessment, setAssessment] = useState<Assessment>({})
  const [currentCategory, setCurrentCategory] = useState(0)

  const categories = Object.keys(assessmentData)

  const handleAssessmentChange = (
    category: string,
    subcategory: string,
    level: "positive" | "neutral" | "negative" | null,
  ) => {
    setAssessment((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: level,
      },
    }))
  }

  const handleSubmit = () => {
    onSubmit(assessment)
  }

  const getCompletionCount = () => {
    let total = 0
    let completed = 0

    Object.entries(assessmentData).forEach(([category, subcategories]) => {
      Object.keys(subcategories).forEach((subcategory) => {
        total++
        if (assessment[category]?.[subcategory]) {
          completed++
        }
      })
    })

    return { completed, total }
  }

  const { completed, total } = getCompletionCount()

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            Einschätzung für {studentData.firstName} {studentData.lastName}
          </h3>
          <p className="text-sm text-gray-600">
            {completed} von {total} Bereichen bewertet
          </p>
        </div>
        <Badge variant="outline">{Math.round((completed / total) * 100)}% abgeschlossen</Badge>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => {
          const categoryAssessment = assessment[category] || {}
          const categorySubcategories = Object.keys(assessmentData[category])
          const categoryCompleted = categorySubcategories.filter((sub) => categoryAssessment[sub]).length

          return (
            <Button
              key={category}
              variant={index === currentCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentCategory(index)}
              className="relative"
            >
              {category}
              {categoryCompleted > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {categoryCompleted}/{categorySubcategories.length}
                </Badge>
              )}
            </Button>
          )
        })}
      </div>

      {/* Current Category Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>{categories[currentCategory]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(assessmentData[categories[currentCategory]]).map(([subcategory, options]) => (
            <div key={subcategory} className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">{subcategory}</h4>
              <div className="grid gap-2">
                {options.map((option, index) => {
                  const level = index === 0 ? "positive" : index === 1 ? "neutral" : "negative"
                  const isSelected = assessment[categories[currentCategory]]?.[subcategory] === level

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        handleAssessmentChange(categories[currentCategory], subcategory, isSelected ? null : level)
                      }
                      className={`p-3 text-left text-sm rounded-lg border transition-colors ${
                        isSelected
                          ? level === "positive"
                            ? "bg-green-50 border-green-200 text-green-800"
                            : level === "neutral"
                              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                              : "bg-red-50 border-red-200 text-red-800"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            level === "positive" ? "bg-green-500" : level === "neutral" ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        />
                        <span>{option}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Zurück zu Schülerdaten
          </Button>

          {currentCategory > 0 && (
            <Button variant="outline" onClick={() => setCurrentCategory(currentCategory - 1)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Vorherige Kategorie
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {currentCategory < categories.length - 1 && (
            <Button variant="outline" onClick={() => setCurrentCategory(currentCategory + 1)}>
              Nächste Kategorie
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          <Button onClick={handleSubmit} disabled={completed === 0}>
            Bericht generieren
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
