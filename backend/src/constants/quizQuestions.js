const quizQuestions = [
  {
    id: "subjectStrength",
    label: "Which subject currently feels like your strongest area?",
    category: "strengths",
    options: [
      { label: "Mathematics", value: "mathematics" },
      { label: "Biology", value: "biology" },
      { label: "Economics", value: "economics" },
      { label: "Literature", value: "literature" },
      { label: "Physics", value: "physics" },
      { label: "Government", value: "government" }
    ]
  },
  {
    id: "interestArea",
    label: "Which kind of problem would you rather solve?",
    category: "interests",
    options: [
      { label: "Building software and digital tools", value: "technology" },
      { label: "Caring for health and wellbeing", value: "healthcare" },
      { label: "Growing businesses and managing money", value: "business" },
      { label: "Designing spaces or visual ideas", value: "design" },
      { label: "Communicating stories and influence", value: "communication" },
      { label: "Improving communities and policy", value: "social-impact" }
    ]
  },
  {
    id: "workStyle",
    label: "What kind of work environment suits you most?",
    category: "workStyles",
    options: [
      { label: "People-centered and collaborative", value: "people" },
      { label: "Data-driven and analytical", value: "data" },
      { label: "Practical and hands-on", value: "hands-on" },
      { label: "Tech-focused and problem-solving", value: "technology" },
      { label: "Creative and expressive", value: "creativity" },
      { label: "Leadership and coordination", value: "leadership" }
    ]
  },
  {
    id: "goal",
    label: "What outcome matters most to you right now?",
    category: "goals",
    options: [
      { label: "Helping people directly", value: "help-people" },
      { label: "Creating products that people use", value: "build-products" },
      { label: "Starting or running a business", value: "run-business" },
      { label: "Telling stories and shaping opinion", value: "tell-stories" },
      { label: "Solving difficult national problems", value: "solve-problems" },
      { label: "Serving society through institutions", value: "serve-community" }
    ]
  },
  {
    id: "studyPreference",
    label: "What kind of course experience do you prefer?",
    category: "studyPreferences",
    options: [
      { label: "Laboratory and experiments", value: "laboratory" },
      { label: "Case studies and business strategy", value: "case-study" },
      { label: "Studio, drafting, and projects", value: "studio" },
      { label: "Fieldwork and site visits", value: "fieldwork" },
      { label: "Reading, writing, and debate", value: "reading-writing" },
      { label: "Coding, systems, and practical builds", value: "practical-builds" }
    ]
  }
]

module.exports = { quizQuestions }
