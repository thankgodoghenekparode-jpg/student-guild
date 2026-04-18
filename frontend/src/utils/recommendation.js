import { careers } from "../data/careers"

const attributeWeights = {
  people: ["Counseling", "Law", "Medicine", "Business", "Education"],
  data: ["Data Science", "Accounting", "Economics", "Software Engineering"],
  technology: ["Software Engineering", "Engineering", "Data Science"],
  creativity: ["Graphic Design", "Architecture", "Media"]
}

export function getCareerRecommendations(answers) {
  const scores = careers.map((career) => ({
    ...career,
    score: 0
  }))

  answers.forEach((answer) => {
    scores.forEach((career) => {
      if (career.tags.includes(answer)) career.score += 3
      if (career.subjects.includes(answer)) career.score += 2
      if (attributeWeights[answer]?.some((tag) => career.tags.includes(tag))) {
        career.score += 2
      }
    })
  })

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
