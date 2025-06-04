import type { StudentData, Assessment } from "@/app/page"
import { assessmentData } from "./assessment-data"

interface ReportOptions {
  length: "short" | "medium" | "long"
  focus: "balanced" | "strengths" | "weaknesses"
  tone: "supportive" | "neutral" | "direct"
  audience: "parents" | "students" | "teachers"
}

export async function generateReport(
  studentData: StudentData,
  assessment: Assessment,
  options: ReportOptions,
): Promise<string> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const pronoun = getPronoun(studentData.gender, studentData.reportForm)
  const name = studentData.reportForm === "du" ? studentData.firstName : `${studentData.firstName}`

  let report = generateReportHeader(studentData)

  // Generate content for each assessed category
  Object.entries(assessment).forEach(([category, subcategories]) => {
    const categoryContent = generateCategoryContent(category, subcategories, pronoun, name, options)
    if (categoryContent) {
      report += `\n\n**${category}**\n${categoryContent}`
    }
  })

  // Add support and therapy information if available
  if (studentData.support.length > 0 || studentData.therapies.length > 0) {
    report += generateSupportSection(studentData, pronoun)
  }

  // Add conclusion based on focus
  report += generateConclusion(studentData, assessment, options, pronoun)

  return report
}

function getPronoun(gender: string, reportForm: string) {
  if (reportForm === "du") {
    return {
      subject: "du",
      object: "dich",
      possessive: "dein/deine",
      reflexive: "dich",
    }
  }

  if (gender === "female") {
    return {
      subject: "sie",
      object: "sie",
      possessive: "ihre",
      reflexive: "sich",
    }
  } else {
    return {
      subject: "er",
      object: "ihn",
      possessive: "seine",
      reflexive: "sich",
    }
  }
}

function generateReportHeader(studentData: StudentData): string {
  const currentDate = new Date().toLocaleDateString("de-CH")

  return `**Lernbericht**

**Schüler/in:** ${studentData.firstName} ${studentData.lastName}
**Klasse:** ${studentData.classLevel}. Klasse
${studentData.schoolLocation ? `**Schulort:** ${studentData.schoolLocation}\n` : ""}**Datum:** ${currentDate}

---`
}

function generateCategoryContent(
  category: string,
  subcategories: { [key: string]: "positive" | "neutral" | "negative" | null },
  pronoun: any,
  name: string,
  options: ReportOptions,
): string {
  const sentences: string[] = []

  Object.entries(subcategories).forEach(([subcategory, level]) => {
    if (level && assessmentData[category]?.[subcategory]) {
      const levelIndex = level === "positive" ? 0 : level === "neutral" ? 1 : 2
      let sentence = assessmentData[category][subcategory][levelIndex]

      // Replace placeholder with name/pronoun
      sentence = sentence.replace("...", name)

      // Apply focus filter
      if (options.focus === "strengths" && level === "negative") return
      if (options.focus === "weaknesses" && level === "positive") return

      sentences.push(sentence)
    }
  })

  if (sentences.length === 0) return ""

  // Adjust length based on options
  if (options.length === "short" && sentences.length > 3) {
    return sentences.slice(0, 3).join(" ")
  } else if (options.length === "long") {
    return sentences.join(" ")
  } else {
    return sentences.slice(0, Math.min(5, sentences.length)).join(" ")
  }
}

function generateSupportSection(studentData: StudentData, pronoun: any): string {
  let section = "\n\n**Unterstützung und Förderung**\n"

  if (studentData.support.length > 0) {
    section += `${studentData.firstName} erhält folgende schulische Unterstützung: ${studentData.support.join(", ")}. `
  }

  if (studentData.therapies.length > 0) {
    section += `Zusätzlich nimmt ${pronoun.subject} an folgenden Therapien teil: ${studentData.therapies.join(", ")}. `
  }

  return section
}

function generateConclusion(
  studentData: StudentData,
  assessment: Assessment,
  options: ReportOptions,
  pronoun: any,
): string {
  const positiveCount = countAssessmentLevels(assessment, "positive")
  const negativeCount = countAssessmentLevels(assessment, "negative")

  let conclusion = "\n\n**Fazit**\n"

  if (options.focus === "strengths" || positiveCount > negativeCount) {
    conclusion += `${studentData.firstName} zeigt in vielen Bereichen erfreuliche Entwicklungen und bringt ${pronoun.possessive} Stärken gut ein. `
  } else if (options.focus === "weaknesses" || negativeCount > positiveCount) {
    conclusion += `Für ${studentData.firstName} ergeben sich verschiedene Entwicklungsmöglichkeiten, die mit gezielter Unterstützung gefördert werden können. `
  } else {
    conclusion += `${studentData.firstName} zeigt eine ausgewogene Entwicklung mit sowohl Stärken als auch Bereichen, in denen weitere Fortschritte möglich sind. `
  }

  // Add tone-specific ending
  if (options.tone === "supportive") {
    conclusion += `Wir werden ${pronoun.object} weiterhin individuell fördern und ${pronoun.possessive} Entwicklung aufmerksam begleiten.`
  } else if (options.tone === "direct") {
    conclusion += `Die genannten Punkte sollten in der weiteren Lernbegleitung berücksichtigt werden.`
  } else {
    conclusion += `Die weitere Entwicklung wird regelmässig beobachtet und dokumentiert.`
  }

  return conclusion
}

function countAssessmentLevels(assessment: Assessment, level: "positive" | "negative"): number {
  let count = 0
  Object.values(assessment).forEach((subcategories) => {
    Object.values(subcategories).forEach((assessmentLevel) => {
      if (assessmentLevel === level) count++
    })
  })
  return count
}
