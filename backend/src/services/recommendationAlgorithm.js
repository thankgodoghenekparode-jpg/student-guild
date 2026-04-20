const categoryWeights = {
  strengths: 28,
  interests: 24,
  workStyles: 18,
  goals: 20,
  studyPreferences: 10
}

const signalLabels = {
  mathematics: "your comfort with Mathematics",
  biology: "your strength in Biology",
  economics: "your interest in Economics and decision-making",
  literature: "your strength in reading and expression",
  physics: "your confidence in Physics and technical problem solving",
  government: "your awareness of civic and policy issues",
  technology: "your interest in technology-driven work",
  healthcare: "your desire to work in health and wellbeing",
  business: "your interest in business and money systems",
  design: "your creative and design-oriented side",
  communication: "your communication and storytelling interest",
  "social-impact": "your motivation to improve communities",
  people: "your preference for people-centered work",
  data: "your analytical and data-focused style",
  "hands-on": "your practical, hands-on approach",
  creativity: "your expressive and creative style",
  leadership: "your interest in leading people or systems",
  "help-people": "your goal of helping people directly",
  "build-products": "your drive to create useful products",
  "run-business": "your business and entrepreneurship goal",
  "tell-stories": "your interest in shaping stories and public perception",
  "solve-problems": "your desire to solve difficult problems",
  "serve-community": "your interest in service and public impact",
  laboratory: "your comfort with laboratory-based learning",
  "case-study": "your preference for case studies and applied examples",
  studio: "your studio and project-based learning preference",
  fieldwork: "your preference for field exposure and site experience",
  "reading-writing": "your comfort with reading, writing, and argument",
  "practical-builds": "your preference for practical builds and real systems"
}

const categoryBoosts = {
  mathematics: ["Computing", "Engineering", "Business"],
  biology: ["Health", "Agriculture", "Science"],
  economics: ["Business", "Governance", "Social"],
  literature: ["Humanities", "Communication", "Arts"],
  physics: ["Engineering", "Computing", "Science"],
  government: ["Governance", "Law", "Social"]
}

function calculateRecommendationResults(courses, answers) {
  const totalPossible = Object.values(categoryWeights).reduce((total, value) => total + value, 0) + 10

  const rankedCourses = courses.map((course) => {
    const matchedSignals = []
    let rawScore = 0

    for (const [category, answer] of Object.entries(answers)) {
      const weight = categoryWeights[category]

      if (!weight || !answer) {
        continue
      }

      if ((course.recommendationSignals?.[category] || []).includes(answer)) {
        rawScore += weight
        matchedSignals.push(answer)
      }

      if (category === "strengths") {
        const boosts = categoryBoosts[answer] || []

        if (boosts.some((label) => course.category.includes(label))) {
          rawScore += 10
        }
      }
    }

    const matchPercentage = Math.min(98, Math.max(35, Math.round((rawScore / totalPossible) * 100)))
    const whyFit = buildWhyFit(matchedSignals, course)

    return {
      courseId: course.id,
      courseTitle: course.title,
      matchPercentage,
      whyFit,
      requiredSubjects: course.requiredSubjects,
      jambCombination: course.jambCombination,
      possibleCareers: course.careers,
      recommendedTechSkills: course.sideSkills,
      category: course.category,
      institutionType: course.institutionType,
      cutoffMark: course.cutoffMark,
      summary: course.summary,
      score: rawScore
    }
  })

  return rankedCourses
    .sort((left, right) => right.score - left.score || right.matchPercentage - left.matchPercentage)
    .slice(0, 3)
}

function buildWhyFit(matchedSignals, course) {
  const topSignals = matchedSignals.slice(0, 3).map((signal) => signalLabels[signal]).filter(Boolean)

  if (topSignals.length === 0) {
    return `This course still fits because its ${course.category.toLowerCase()} pathway aligns with the kind of practical opportunities many students build into over time.`
  }

  if (topSignals.length === 1) {
    return `This course fits because of ${topSignals[0]}, and it develops that into clear career options.`
  }

  if (topSignals.length === 2) {
    return `This course fits because it connects ${topSignals[0]} with ${topSignals[1]}.`
  }

  return `This course fits because it combines ${topSignals[0]}, ${topSignals[1]}, and ${topSignals[2]}.`
}

module.exports = { calculateRecommendationResults }
