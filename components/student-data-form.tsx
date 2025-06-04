"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentData } from "@/app/page"

interface StudentDataFormProps {
  onSubmit: (data: StudentData) => void
}

export function StudentDataForm({ onSubmit }: StudentDataFormProps) {
  const [formData, setFormData] = useState<StudentData>({
    firstName: "",
    lastName: "",
    gender: "male",
    reportForm: "er-sie",
    classLevel: "",
    schoolLocation: "",
    support: [],
    therapies: [],
  })

  const supportOptions = [
    "Deutsch als Zweitsprache (DaZ)",
    "Begabungsförderung",
    "Hausaufgabenhilfe",
    "Integrative Förderung (IF)",
    "Integrative Förderung mit Lernzielanpassung (iFmL)",
    "Integrative Förderung ohne Lernzielanpassung (iFoL)",
    "Sonderpädagogische Unterstützung",
    "Assistenzperson",
  ]

  const therapyOptions = ["Logopädie", "Psychomotorik", "Ergotherapie", "Psychotherapie"]

  const handleSupportChange = (option: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      support: checked ? [...prev.support, option] : prev.support.filter((item) => item !== option),
    }))
  }

  const handleTherapyChange = (option: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      therapies: checked ? [...prev.therapies, option] : prev.therapies.filter((item) => item !== option),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.firstName && formData.lastName && formData.classLevel) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pflichtfelder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pflichtfelder</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nachname *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Geschlecht</Label>
            <Select
              value={formData.gender}
              onValueChange={(value: "male" | "female" | "diverse") =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Knabe</SelectItem>
                <SelectItem value="female">Mädchen</SelectItem>
                <SelectItem value="diverse">Divers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportForm">Berichtform</Label>
            <Select
              value={formData.reportForm}
              onValueChange={(value: "er-sie" | "du") => setFormData((prev) => ({ ...prev, reportForm: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="er-sie">Er-/Sie-Form</SelectItem>
                <SelectItem value="du">Du-Form</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="classLevel">Klasse / Schulstufe *</Label>
            <Select
              value={formData.classLevel}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, classLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Klasse auswählen" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    {level}. Klasse
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kontextinformationen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kontextinformationen (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="schoolLocation">Schulort</Label>
            <Input
              id="schoolLocation"
              value={formData.schoolLocation}
              onChange={(e) => setFormData((prev) => ({ ...prev, schoolLocation: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Schulische Unterstützung</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`support-${option}`}
                    checked={formData.support.includes(option)}
                    onCheckedChange={(checked) => handleSupportChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`support-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Aktuelle Therapien</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {therapyOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`therapy-${option}`}
                    checked={formData.therapies.includes(option)}
                    onCheckedChange={(checked) => handleTherapyChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`therapy-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={!formData.firstName || !formData.lastName || !formData.classLevel}>
          Weiter zur Einschätzung
        </Button>
      </div>
    </form>
  )
}
