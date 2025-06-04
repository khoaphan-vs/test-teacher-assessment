// Configuration for AI model settings
export const AI_CONFIG = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: {
    short: 800,
    medium: 1200,
    long: 1800,
  },
  // Fallback to GPT-3.5 if GPT-4 is not available
  fallbackModel: "gpt-3.5-turbo",
};

// Swiss German educational terminology and phrases
export const SWISS_EDUCATIONAL_PHRASES = {
  positive: [
    "zeigt erfreuliche Fortschritte",
    "bringt sich engagiert ein",
    "arbeitet selbstständig und zuverlässig",
    "zeigt grosse Motivation",
    "übertrifft die Erwartungen",
  ],
  neutral: [
    "arbeitet im Rahmen der Erwartungen",
    "zeigt solide Leistungen",
    "bemüht sich um gute Resultate",
    "arbeitet mit wechselndem Erfolg",
    "zeigt teilweise gute Ansätze",
  ],
  negative: [
    "benötigt noch Unterstützung",
    "zeigt Entwicklungspotenzial",
    "braucht gezielte Förderung",
    "hat noch Mühe mit",
    "sollte verstärkt üben",
  ],
};
