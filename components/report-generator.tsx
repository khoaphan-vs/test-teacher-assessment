"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Copy, ChevronLeft, RotateCcw, FileText, Settings } from "lucide-react"
import type { StudentData, Assessment } from "@/app/page"
import { generateReport } from "@/lib/report-generator"

interface ReportGeneratorProps {
  studentData: StudentData
  assessment: Assessment
  onBack: () => void
  onReset: () => void
}

export function ReportGenerator({ studentData, assessment, onBack, onReset }: ReportGeneratorProps) {
  const [generatedReport, setGeneratedReport] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportLength, setReportLength] = useState<"short" | "medium" | "long">("medium")
  const [reportFocus, setReportFocus] = useState<"balanced" | "strengths" | "weaknesses">("balanced")
  const [reportTone, setReportTone] = useState<"supportive" | "neutral" | "direct">("supportive")
  const [reportAudience, setReportAudience] = useState<"parents" | "students" | "teachers">("parents")

  useEffect(() => {
    handleGenerateReport()
  }, [])

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const report = await generateReport(studentData, assessment, {
        length: reportLength,
        focus: reportFocus,
        tone: reportTone,
        audience: reportAudience,
      })
      setGeneratedReport(report)
    } catch (error) {
      console.error("Error generating report:", error)
      setGeneratedReport("Fehler beim Generieren des Berichts. Bitte versuchen Sie es erneut.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generatedReport)
  }

  const handleDownloadReport = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedReport], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Lernbericht_${studentData.firstName}_${studentData.lastName}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            Lernbericht für {studentData.firstName} {studentData.lastName}
          </h3>
          <p className="text-sm text-gray-600">
            {studentData.classLevel}. Klasse
            {studentData.schoolLocation && ` • ${studentData.schoolLocation}`}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Bericht generiert
        </Badge>
      </div>

      {/* Report Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Berichteinstellungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Berichtlänge</label>
              <Select
                value={reportLength}
                onValueChange={(value: "short" | "medium" | "long") => setReportLength(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Kurz</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="long">Ausführlich</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fokus</label>
              <Select
                value={reportFocus}
                onValueChange={(value: "balanced" | "strengths" | "weaknesses") => setReportFocus(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Ausgewogen</SelectItem>
                  <SelectItem value="strengths">Stärken</SelectItem>
                  <SelectItem value="weaknesses">Entwicklungspotenziale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tonfall</label>
              <Select
                value={reportTone}
                onValueChange={(value: "supportive" | "neutral" | "direct") => setReportTone(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supportive">Wohlwollend</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="direct">Sachlich-direkt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Zielgruppe</label>
              <Select
                value={reportAudience}
                onValueChange={(value: "parents" | "students" | "teachers") => setReportAudience(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parents">Eltern</SelectItem>
                  <SelectItem value="students">Schüler*innen</SelectItem>
                  <SelectItem value="teachers">Lehrpersonen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Bericht wird generiert...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Bericht neu generieren
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generierter Bericht
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Der Bericht wird generiert...</p>
                <p className="text-sm text-gray-500 mt-2">Dies kann einen Moment dauern.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={generatedReport}
                onChange={(e) => setGeneratedReport(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Der generierte Bericht wird hier angezeigt..."
              />

              <div className="flex gap-2">
                <Button onClick={handleCopyReport} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Kopieren
                </Button>
                <Button onClick={handleDownloadReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Als Textdatei herunterladen
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Zurück zur Einschätzung
        </Button>

        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Neuen Bericht erstellen
        </Button>
      </div>
    </div>
  )
}
