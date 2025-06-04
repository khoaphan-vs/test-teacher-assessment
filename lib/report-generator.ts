import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { StudentData, Assessment } from "@/app/page";
import { assessmentData } from "./assessment-data";
import { xai } from "@ai-sdk/xai";
import { anthropic } from "@ai-sdk/anthropic";

interface ReportOptions {
  length: "short" | "medium" | "long";
  focus: "balanced" | "strengths" | "weaknesses";
  tone: "supportive" | "neutral" | "direct";
  audience: "parents" | "students" | "teachers";
}

export async function generateReport(
  studentData: StudentData,
  assessment: Assessment,
  options: ReportOptions
): Promise<string> {
  try {
    // Prepare assessment data for AI
    const assessmentSummary = prepareAssessmentData(assessment);
    const contextInfo = prepareContextInfo(studentData);

    const prompt = buildPrompt(
      studentData,
      assessmentSummary,
      contextInfo,
      options
    );

    // const { text } = await generateText({
    //   model: openai("gpt-4.1-mini"),
    //   prompt,
    //   temperature: 0.7,
    //   maxTokens:
    //     options.length === "short"
    //       ? 800
    //       : options.length === "medium"
    //       ? 1200
    //       : 1800,
    // });

    // const { text } = await generateText({
    //   model: xai("grok-3"),
    //   prompt: prompt,
    //   temperature: 0.7,
    //   maxTokens:
    //     options.length === "short"
    //       ? 800
    //       : options.length === "medium"
    //       ? 1200
    //       : 1800,
    // });

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens:
        options.length === "short"
          ? 800
          : options.length === "medium"
          ? 1200
          : 1800,
    });

    return formatReport(text, studentData);
  } catch (error) {
    console.error("Error generating AI report:", error);
    // Fallback to template-based generation
    return generateFallbackReport(studentData, assessment, options);
  }
}

function prepareAssessmentData(assessment: Assessment): string {
  const assessmentText: string[] = [];

  Object.entries(assessment).forEach(([category, subcategories]) => {
    const categoryAssessments: string[] = [];

    Object.entries(subcategories).forEach(([subcategory, level]) => {
      if (level && assessmentData[category]?.[subcategory]) {
        const levelIndex =
          level === "positive" ? 0 : level === "neutral" ? 1 : 2;
        const sentence = assessmentData[category][subcategory][levelIndex];
        categoryAssessments.push(`${subcategory}: ${sentence}`);
      }
    });

    if (categoryAssessments.length > 0) {
      assessmentText.push(`${category}:\n${categoryAssessments.join("\n")}`);
    }
  });

  return assessmentText.join("\n\n");
}

function prepareContextInfo(studentData: StudentData): string {
  const context: string[] = [];

  if (studentData.support.length > 0) {
    context.push(`Schulische Unterstützung: ${studentData.support.join(", ")}`);
  }

  if (studentData.therapies.length > 0) {
    context.push(`Aktuelle Therapien: ${studentData.therapies.join(", ")}`);
  }

  return context.join("\n");
}

function buildPrompt(
  studentData: StudentData,
  assessmentSummary: string,
  contextInfo: string,
  options: ReportOptions
): string {
  const pronoun =
    studentData.reportForm === "du"
      ? "du"
      : studentData.gender === "female"
      ? "sie"
      : "er";
  const lengthInstruction = {
    short: "einen kurzen, prägnanten",
    medium: "einen ausgewogenen, mittellangen",
    long: "einen ausführlichen, detaillierten",
  }[options.length];

  const focusInstruction = {
    balanced: "ausgewogen sowohl Stärken als auch Entwicklungsbereiche",
    strengths: "hauptsächlich die Stärken und positiven Aspekte",
    weaknesses:
      "hauptsächlich die Entwicklungsbereiche und Verbesserungsmöglichkeiten",
  }[options.focus];

  const toneInstruction = {
    supportive: "wohlwollend, ermutigend und unterstützend",
    neutral: "sachlich, neutral und objektiv",
    direct: "direkt, klar und ohne Umschweife",
  }[options.tone];

  const audienceInstruction = {
    parents: "für Eltern verständlich und informativ",
    students: "für Schüler*innen motivierend und verständlich",
    teachers: "für Lehrpersonen fachlich präzise und umsetzungsorientiert",
  }[options.audience];

  return `Du bist ein erfahrener Schweizer Primarschullehrer und erstellst professionelle Lernberichte. 

Erstelle ${lengthInstruction} Lernbericht für ${studentData.firstName} ${
    studentData.lastName
  } (${studentData.classLevel}. Klasse).

WICHTIGE VORGABEN:
- Verwende die ${
    studentData.reportForm === "du" ? "Du-Form" : "Er/Sie-Form"
  } konsequent
- Schreibe ${audienceInstruction}
- Der Tonfall soll ${toneInstruction} sein
- Betone ${focusInstruction}
- Verwende Schweizer Hochdeutsch
- Strukturiere den Bericht in thematische Abschnitte
- Beginne nicht mit "Liebe Eltern" oder ähnlichen Anreden

EINSCHÄTZUNGEN:
${assessmentSummary}

${contextInfo ? `ZUSÄTZLICHE INFORMATIONEN:\n${contextInfo}` : ""}

Erstelle einen kohärenten, gut strukturierten Lernbericht, der die Einschätzungen sinnvoll verknüpft und ein vollständiges Bild der Schülerin/des Schülers vermittelt.`;
}

function formatReport(text: string, studentData: StudentData): string {
  const currentDate = new Date().toLocaleDateString("de-CH");

  const header = `**Lernbericht**

**Schüler/in:** ${studentData.firstName} ${studentData.lastName}
**Klasse:** ${studentData.classLevel}. Klasse
${
  studentData.schoolLocation
    ? `**Schulort:** ${studentData.schoolLocation}\n`
    : ""
}**Datum:** ${currentDate}

---

`;

  return header + text;
}

// Fallback function for when AI fails
function generateFallbackReport(
  studentData: StudentData,
  assessment: Assessment,
  options: ReportOptions
): string {
  const pronoun = getPronoun(studentData.gender, studentData.reportForm);
  const name =
    studentData.reportForm === "du"
      ? studentData.firstName
      : `${studentData.firstName}`;

  let report = generateReportHeader(studentData);

  // Generate content for each assessed category
  Object.entries(assessment).forEach(([category, subcategories]) => {
    const categoryContent = generateCategoryContent(
      category,
      subcategories,
      pronoun,
      name,
      options
    );
    if (categoryContent) {
      report += `\n\n**${category}**\n${categoryContent}`;
    }
  });

  // Add support and therapy information if available
  if (studentData.support.length > 0 || studentData.therapies.length > 0) {
    report += generateSupportSection(studentData, pronoun);
  }

  // Add conclusion based on focus
  report += generateConclusion(studentData, assessment, options, pronoun);

  return report;
}

function getPronoun(gender: string, reportForm: string) {
  if (reportForm === "du") {
    return {
      subject: "du",
      object: "dich",
      possessive: "dein/deine",
      reflexive: "dich",
    };
  }

  if (gender === "female") {
    return {
      subject: "sie",
      object: "sie",
      possessive: "ihre",
      reflexive: "sich",
    };
  } else {
    return {
      subject: "er",
      object: "ihn",
      possessive: "seine",
      reflexive: "sich",
    };
  }
}

function generateReportHeader(studentData: StudentData): string {
  const currentDate = new Date().toLocaleDateString("de-CH");

  return `**Lernbericht**

**Schüler/in:** ${studentData.firstName} ${studentData.lastName}
**Klasse:** ${studentData.classLevel}. Klasse
${
  studentData.schoolLocation
    ? `**Schulort:** ${studentData.schoolLocation}\n`
    : ""
}**Datum:** ${currentDate}

---`;
}

function generateCategoryContent(
  category: string,
  subcategories: { [key: string]: "positive" | "neutral" | "negative" | null },
  pronoun: any,
  name: string,
  options: ReportOptions
): string {
  const sentences: string[] = [];

  Object.entries(subcategories).forEach(([subcategory, level]) => {
    if (level && assessmentData[category]?.[subcategory]) {
      const levelIndex = level === "positive" ? 0 : level === "neutral" ? 1 : 2;
      let sentence = assessmentData[category][subcategory][levelIndex];

      // Replace placeholder with name/pronoun
      sentence = sentence.replace("...", name);

      // Apply focus filter
      if (options.focus === "strengths" && level === "negative") return;
      if (options.focus === "weaknesses" && level === "positive") return;

      sentences.push(sentence);
    }
  });

  if (sentences.length === 0) return "";

  // Adjust length based on options
  if (options.length === "short" && sentences.length > 3) {
    return sentences.slice(0, 3).join(" ");
  } else if (options.length === "long") {
    return sentences.join(" ");
  } else {
    return sentences.slice(0, Math.min(5, sentences.length)).join(" ");
  }
}

function generateSupportSection(
  studentData: StudentData,
  pronoun: any
): string {
  let section = "\n\n**Unterstützung und Förderung**\n";

  if (studentData.support.length > 0) {
    section += `${
      studentData.firstName
    } erhält folgende schulische Unterstützung: ${studentData.support.join(
      ", "
    )}. `;
  }

  if (studentData.therapies.length > 0) {
    section += `Zusätzlich nimmt ${
      pronoun.subject
    } an folgenden Therapien teil: ${studentData.therapies.join(", ")}. `;
  }

  return section;
}

function generateConclusion(
  studentData: StudentData,
  assessment: Assessment,
  options: ReportOptions,
  pronoun: any
): string {
  const positiveCount = countAssessmentLevels(assessment, "positive");
  const negativeCount = countAssessmentLevels(assessment, "negative");

  let conclusion = "\n\n**Fazit**\n";

  if (options.focus === "strengths" || positiveCount > negativeCount) {
    conclusion += `${studentData.firstName} zeigt in vielen Bereichen erfreuliche Entwicklungen und bringt ${pronoun.possessive} Stärken gut ein. `;
  } else if (options.focus === "weaknesses" || negativeCount > positiveCount) {
    conclusion += `Für ${studentData.firstName} ergeben sich verschiedene Entwicklungsmöglichkeiten, die mit gezielter Unterstützung gefördert werden können. `;
  } else {
    conclusion += `${studentData.firstName} zeigt eine ausgewogene Entwicklung mit sowohl Stärken als auch Bereichen, in denen weitere Fortschritte möglich sind. `;
  }

  // Add tone-specific ending
  if (options.tone === "supportive") {
    conclusion += `Wir werden ${pronoun.object} weiterhin individuell fördern und ${pronoun.possessive} Entwicklung aufmerksam begleiten.`;
  } else if (options.tone === "direct") {
    conclusion += `Die genannten Punkte sollten in der weiteren Lernbegleitung berücksichtigt werden.`;
  } else {
    conclusion += `Die weitere Entwicklung wird regelmässig beobachtet und dokumentiert.`;
  }

  return conclusion;
}

function countAssessmentLevels(
  assessment: Assessment,
  level: "positive" | "negative"
): number {
  let count = 0;
  Object.values(assessment).forEach((subcategories) => {
    Object.values(subcategories).forEach((assessmentLevel) => {
      if (assessmentLevel === level) count++;
    });
  });
  return count;
}
