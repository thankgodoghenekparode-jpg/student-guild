function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const templates = {
  universityComputing: {
    type: "University",
    category: "Computing & Digital Technology",
    overview: (name) => `${name} prepares students for software, systems, data, and digital innovation careers.`,
    waecSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombo: ["Mathematics", "Physics", "Chemistry"],
    careers: ["Software engineer", "Systems analyst", "Technology specialist"]
  },
  universityEngineering: {
    type: "University",
    category: "Engineering & Applied Technology",
    overview: (name) => `${name} builds strong foundations in design, problem-solving, and industrial systems.`,
    waecSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombo: ["Mathematics", "Physics", "Chemistry"],
    careers: ["Design engineer", "Project engineer", "Operations specialist"]
  },
  universityScience: {
    type: "University",
    category: "Pure & Applied Sciences",
    overview: (name) => `${name} focuses on scientific theory, laboratory work, analysis, and research skills.`,
    waecSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology"],
    jambCombo: ["Mathematics", "Chemistry", "Physics/Biology"],
    careers: ["Research scientist", "Laboratory analyst", "Technical specialist"]
  },
  universityHealth: {
    type: "University",
    category: "Health & Clinical Sciences",
    overview: (name) => `${name} supports clinical practice, diagnostics, patient care, and public health systems.`,
    waecSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombo: ["Biology", "Chemistry", "Physics"],
    careers: ["Healthcare practitioner", "Clinical specialist", "Public health professional"]
  },
  universityBusiness: {
    type: "University",
    category: "Business, Finance & Management",
    overview: (name) => `${name} develops skills for finance, decision-making, management, and enterprise growth.`,
    waecSubjects: ["English Language", "Mathematics", "Economics", "Commerce/Accounting", "Government/Geography"],
    jambCombo: ["Mathematics", "Economics", "Government/Commerce"],
    careers: ["Business analyst", "Operations manager", "Entrepreneur"]
  },
  universitySocial: {
    type: "University",
    category: "Social Sciences & Communication",
    overview: (name) => `${name} explores society, institutions, communication, and human behaviour.`,
    waecSubjects: ["English Language", "Mathematics", "Government", "Economics", "Literature/CRS/IRS"],
    jambCombo: ["Government", "Economics", "Literature/CRS/IRS"],
    careers: ["Policy analyst", "Communications officer", "Social researcher"]
  },
  universityArts: {
    type: "University",
    category: "Arts, Languages & Humanities",
    overview: (name) => `${name} strengthens creative, language, critical thinking, and cultural analysis skills.`,
    waecSubjects: ["English Language", "Literature in English", "Government/History", "CRS/IRS", "Any Arts Subject"],
    jambCombo: ["Literature in English", "Government/History", "CRS/IRS/Any Arts Subject"],
    careers: ["Content specialist", "Research writer", "Creative professional"]
  },
  universityBuiltEnvironment: {
    type: "University",
    category: "Built Environment & Planning",
    overview: (name) => `${name} combines design, planning, valuation, and spatial development skills.`,
    waecSubjects: ["English Language", "Mathematics", "Physics", "Chemistry/Geography", "Technical Drawing/Fine Art"],
    jambCombo: ["Mathematics", "Physics", "Chemistry/Geography/Fine Art"],
    careers: ["Design consultant", "Planning specialist", "Construction professional"]
  },
  universityAgriculture: {
    type: "University",
    category: "Agriculture & Environmental Resources",
    overview: (name) => `${name} prepares students for food systems, production, environmental resources, and sustainability work.`,
    waecSubjects: ["English Language", "Mathematics", "Biology/Agricultural Science", "Chemistry", "Geography/Physics"],
    jambCombo: ["Biology/Agricultural Science", "Chemistry", "Physics/Geography"],
    careers: ["Agribusiness specialist", "Field officer", "Resource manager"]
  },
  universityEducation: {
    type: "University",
    category: "Education & Learning Sciences",
    overview: (name) => `${name} combines subject expertise with teaching, curriculum, and learner development skills.`,
    waecSubjects: ["English Language", "Mathematics", "Relevant Teaching Subject 1", "Relevant Teaching Subject 2", "Any Approved Subject"],
    jambCombo: ["Relevant Teaching Subject 1", "Relevant Teaching Subject 2", "Any Related Subject"],
    careers: ["Teacher", "Curriculum specialist", "Education administrator"]
  },
  polytechnicEngineering: {
    type: "Polytechnic",
    category: "Engineering Technology",
    overview: (name) => `${name} emphasizes practical technical training, workshop skills, and applied industry projects.`,
    waecSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Technical Drawing/Basic Electronics"],
    jambCombo: ["Mathematics", "Physics", "Chemistry/Technical Drawing"],
    careers: ["Engineering technologist", "Maintenance specialist", "Plant technician"]
  },
  polytechnicScience: {
    type: "Polytechnic",
    category: "Science, ICT & Laboratory Technology",
    overview: (name) => `${name} blends practical computing, laboratory work, instrumentation, and technical support skills.`,
    waecSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology"],
    jambCombo: ["Mathematics", "Physics", "Chemistry/Biology"],
    careers: ["Laboratory technologist", "Technical officer", "ICT support specialist"]
  },
  polytechnicBusiness: {
    type: "Polytechnic",
    category: "Business & Administrative Studies",
    overview: (name) => `${name} focuses on practical business operations, records, finance, and organizational support.`,
    waecSubjects: ["English Language", "Mathematics", "Economics", "Commerce/Accounting", "Government"],
    jambCombo: ["Mathematics", "Economics", "Government/Commerce"],
    careers: ["Administrative officer", "Business executive", "Accounts assistant"]
  },
  polytechnicBuiltEnvironment: {
    type: "Polytechnic",
    category: "Built Environment & Design Technology",
    overview: (name) => `${name} offers hands-on training in drafting, valuation, surveying, planning, and design production.`,
    waecSubjects: ["English Language", "Mathematics", "Physics", "Geography", "Technical Drawing/Fine Art"],
    jambCombo: ["Mathematics", "Physics", "Geography/Technical Drawing"],
    careers: ["Site technologist", "Drafting specialist", "Survey assistant"]
  },
  polytechnicCreative: {
    type: "Polytechnic",
    category: "Creative, Media & Service Industries",
    overview: (name) => `${name} prepares students for media production, design execution, service delivery, and vocational practice.`,
    waecSubjects: ["English Language", "Mathematics", "Literature/CRS/IRS", "Government", "Fine Art/Home Economics"],
    jambCombo: ["Literature in English", "Government", "Any Arts or Social Science Subject"],
    careers: ["Media producer", "Creative technologist", "Service industry specialist"]
  },
  polytechnicAgriculture: {
    type: "Polytechnic",
    category: "Agriculture & Food Technology",
    overview: (name) => `${name} emphasizes practical food production, agricultural systems, and processing operations.`,
    waecSubjects: ["English Language", "Mathematics", "Biology/Agricultural Science", "Chemistry", "Physics/Geography"],
    jambCombo: ["Biology/Agricultural Science", "Chemistry", "Physics/Geography"],
    careers: ["Agricultural technologist", "Food processing officer", "Extension support officer"]
  }
}

const universityGroups = [
  {
    template: "universityComputing",
    courses: [
      { name: "Computer Science", aliases: ["Computing"] },
      "Software Engineering",
      "Cyber Security",
      "Data Science",
      "Information Technology",
      "Information Systems",
      "Artificial Intelligence",
      "Computer Engineering",
      "Systems Engineering",
      "Library and Information Science",
      "Information and Communication Technology",
      "Computer with Economics",
      "Computer with Statistics",
      "Information Science and Media Studies",
      "Management Information Systems",
      "Business Information Technology",
      "Software and Information Engineering",
      "Computational Science",
      "Informatics",
      "Cyber Forensics"
    ]
  },
  {
    template: "universityEngineering",
    courses: [
      "Civil Engineering",
      "Mechanical Engineering",
      {
        name: "Electrical and Electronics Engineering",
        aliases: [
          "Electrical Engineering",
          "Electronics Engineering",
          "Electronic Engineering",
          "Electronic Enginering",
          "Electrical and Electronic Engineering"
        ]
      },
      "Chemical Engineering",
      "Petroleum Engineering",
      "Mechatronics Engineering",
      "Biomedical Engineering",
      "Agricultural Engineering",
      "Marine Engineering",
      "Industrial and Production Engineering",
      "Metallurgical and Materials Engineering",
      "Mining Engineering",
      "Food Engineering",
      "Automotive Engineering",
      "Telecommunications Engineering",
      "Environmental Engineering",
      "Aeronautical Engineering",
      "Aerospace Engineering",
      "Naval Architecture",
      "Gas Engineering",
      "Water Resources Engineering",
      "Polymer Engineering",
      "Materials Engineering",
      "Textile Engineering",
      "Wood Products Engineering",
      "Energy Engineering",
      "Petrochemical Engineering",
      "Robotics Engineering",
      "Instrumentation Engineering",
      "Structural Engineering"
    ]
  },
  {
    template: "universityScience",
    courses: [
      "Mathematics",
      "Statistics",
      "Physics",
      "Industrial Physics",
      "Chemistry",
      "Industrial Chemistry",
      "Biochemistry",
      "Biology",
      "Biotechnology",
      "Microbiology",
      "Geology",
      "Geophysics",
      "Geography",
      "Zoology",
      "Botany",
      "Science Laboratory Technology",
      "Marine Biology",
      "Environmental Science",
      "Applied Mathematics",
      "Industrial Mathematics",
      "Mathematics with Computer Science",
      "Mathematics with Economics",
      "Applied Physics",
      "Electronics and Computer Technology",
      "Applied Chemistry",
      "Hydrology and Water Resources Science",
      "Marine Science",
      "Oceanography",
      "Meteorology and Climate Science",
      "Ecology",
      "Cell Biology and Genetics",
      "Molecular Biology",
      "Plant Science and Biotechnology",
      "Animal and Environmental Biology",
      "Bioinformatics",
      "Earth Science",
      "Remote Sensing and GIS",
      "Forensic Science"
    ]
  },
  {
    template: "universityHealth",
    courses: [
      "Medicine and Surgery",
      "Dentistry",
      "Nursing Science",
      "Pharmacy",
      "Medical Laboratory Science",
      "Physiotherapy",
      "Radiography",
      "Public Health",
      "Anatomy",
      "Physiology",
      "Nutrition and Dietetics",
      "Optometry",
      "Veterinary Medicine",
      "Environmental Health Science",
      "Health Information Management",
      "Human Kinetics",
      "Medical Rehabilitation",
      "Occupational Therapy",
      "Speech and Language Therapy",
      "Biomedical Technology",
      "Community Health Science",
      "Dental Technology",
      "Dental Therapy",
      "Biomedical Science",
      "Emergency Medical Care"
    ]
  },
  {
    template: "universityBusiness",
    courses: [
      { name: "Accounting", aliases: ["Accountancy"] },
      "Actuarial Science",
      "Banking and Finance",
      {
        name: "Business Administration",
        aliases: [
          "Business Administration and Management",
          "Business Management",
          "Business Admin"
        ]
      },
      "Economics",
      "Entrepreneurship",
      "Marketing",
      "Public Administration",
      "Insurance",
      "Taxation",
      "Industrial Relations and Personnel Management",
      "Procurement Management",
      "Hospitality and Tourism Management",
      "Human Resource Management",
      "Logistics and Supply Chain Management",
      "Project Management",
      "International Business",
      "Real Estate Finance",
      "Development Studies",
      "Investment and Securities",
      "Cooperative and Rural Development",
      "Secretarial Administration",
      "Transport and Logistics Management",
      "Operations Research"
    ]
  },
  {
    template: "universitySocial",
    courses: [
      "Mass Communication",
      "Political Science",
      "International Relations",
      "Sociology",
      "Psychology",
      "Criminology and Security Studies",
      "Social Work",
      "Peace and Conflict Studies",
      "Demography and Social Statistics",
      "Broadcasting",
      "Economics and Development Studies",
      "Anthropology",
      "Geography and Regional Planning",
      "Public Policy and Administration",
      "Social Justice",
      "Intelligence and Security Studies",
      "International Studies and Diplomacy",
      "Media and Communication Studies",
      "Journalism and Media Studies",
      "Strategic Communication",
      "Gender Studies",
      "Labour and Employment Relations",
      "Population Studies",
      "Social Policy",
      "Development and Strategic Studies"
    ]
  },
  {
    template: "universityArts",
    courses: [
      "Law",
      "English and Literary Studies",
      "Linguistics",
      "History and International Studies",
      "Philosophy",
      "Religious Studies",
      "Theatre Arts",
      "Music",
      "Fine and Applied Arts",
      "French",
      "Arabic Studies",
      "Yoruba",
      "Igbo",
      "Hausa",
      "Creative Arts",
      "Performing Arts",
      "Theatre and Film Studies",
      "Archaeology",
      "Archaeology and Tourism",
      "Comparative Religious Studies",
      "Christian Religious Studies",
      "Islamic Studies",
      "Portuguese",
      "German",
      "Chinese Studies",
      "Russian",
      "Visual Arts",
      "Culture and Media Studies"
    ]
  },
  {
    template: "universityBuiltEnvironment",
    courses: [
      "Architecture",
      "Building",
      "Estate Management",
      "Quantity Surveying",
      "Urban and Regional Planning",
      "Surveying and Geo-Informatics",
      "Environmental Management",
      "Transport Management",
      "Land Surveying",
      "Geomatics",
      "Landscape Architecture",
      "Housing Studies",
      "Construction Management",
      "Interior Architecture",
      "Property Development",
      "Cartography and GIS",
      "Environmental Design",
      "Regional Development Planning"
    ]
  },
  {
    template: "universityAgriculture",
    courses: [
      "Agriculture",
      "Agricultural Economics",
      "Animal Science",
      "Crop Science",
      "Fisheries and Aquaculture",
      "Forestry and Wildlife Management",
      "Soil Science",
      "Food Science and Technology",
      "Agricultural Extension",
      "Water Resources Management",
      "Agronomy",
      "Crop Production",
      "Animal Breeding and Genetics",
      "Animal Nutrition and Biotechnology",
      "Pasture and Range Management",
      "Agricultural Extension and Rural Development",
      "Agricultural Resource Economics",
      "Home Science and Management",
      "Forestry",
      "Wildlife and Ecotourism",
      "Horticulture",
      "Irrigation and Drainage"
    ]
  },
  {
    template: "universityEducation",
    courses: [
      "Education and Biology",
      "Education and Chemistry",
      "Education and Mathematics",
      "Education and Physics",
      "Education and English Language",
      "Education and Economics",
      "Educational Management",
      "Guidance and Counselling",
      "Early Childhood Education",
      "Adult Education",
      "Education and Computer Science",
      "Education and Geography",
      "Education and Political Science",
      "Education and Social Studies",
      "Education and Religious Studies",
      "Education and Agricultural Science",
      "Business Education",
      "Technical Education",
      "Health Education",
      "Human Kinetics Education",
      "Special Education",
      "Primary Education Studies",
      "Educational Technology",
      "Library and Information Science Education",
      "Adult and Community Education"
    ]
  }
]

const polytechnicGroups = [
  {
    template: "polytechnicScience",
    courses: [
      "Computer Science",
      "Science Laboratory Technology",
      "Statistics",
      "Software and Web Development",
      "Networking and Cloud Computing",
      "Library and Information Science",
      "Public Health Technology",
      "Nutrition and Dietetics",
      "Microbiology",
      "Biochemistry",
      "Industrial Chemistry",
      "Physics Electronics",
      "Geology Technology",
      "Environmental Science and Management Technology",
      "Surveying and Geoinformatics Technology",
      "Computer Networking and System Security",
      "Multimedia Technology",
      "Data Analytics"
    ]
  },
  {
    template: "polytechnicEngineering",
    courses: [
      "Civil Engineering Technology",
      "Mechanical Engineering Technology",
      {
        name: "Electrical and Electronic Engineering Technology",
        aliases: [
          "Electrical Engineering Technology",
          "Electronic Engineering Technology",
          "Electronics Engineering Technology",
          "Electronic Enginering Technology"
        ]
      },
      "Computer Engineering Technology",
      "Mechatronics Engineering Technology",
      "Agricultural and Bio-Environmental Engineering Technology",
      "Chemical Engineering Technology",
      "Metallurgical Engineering Technology",
      "Welding and Fabrication Technology",
      "Foundry Engineering Technology",
      "Mineral and Petroleum Resources Engineering Technology",
      "Marine Engineering Technology",
      "Automotive Engineering Technology",
      "Power and Machinery Engineering Technology",
      "Renewable Energy Engineering Technology",
      "Instrumentation and Control Engineering Technology",
      "Telecommunication Engineering Technology",
      "Water Resources Engineering Technology",
      "Building Services Engineering Technology",
      "Industrial Maintenance Engineering Technology",
      "Rail Transport Engineering Technology",
      "Petroleum Engineering Technology"
    ]
  },
  {
    template: "polytechnicBusiness",
    courses: [
      "Accountancy",
      "Banking and Finance",
      "Business Administration and Management",
      "Marketing",
      "Public Administration",
      "Office Technology and Management",
      "Purchasing and Supply",
      "Taxation",
      "Local Government Studies",
      "Cooperative Economics and Management",
      "Insurance",
      "Human Resource Management",
      "Transport Planning and Management",
      "Entrepreneurship and Business Innovation",
      "Customer Relationship Management",
      "Project Management Technology",
      "Legal Studies",
      "Economic and Management Studies",
      "Social Development",
      "Business Informatics",
      "Logistics and Transport Management"
    ]
  },
  {
    template: "polytechnicBuiltEnvironment",
    courses: [
      "Architectural Technology",
      "Building Technology",
      "Quantity Surveying",
      "Estate Management and Valuation",
      "Surveying and Geo-Informatics",
      "Urban and Regional Planning",
      "Landscape Design Technology",
      "Cartography and Geographic Information Systems",
      "Construction Technology",
      "Property Management",
      "Highway Engineering Technology",
      "Furniture Design and Wood Technology"
    ]
  },
  {
    template: "polytechnicCreative",
    courses: [
      "Mass Communication",
      "Art and Design",
      "Fashion Design and Clothing Technology",
      "Printing Technology",
      "Leisure and Tourism Management",
      "Hospitality Management",
      "Film and Multimedia Studies",
      "Journalism and Media Studies",
      "Broadcasting Technology",
      "Photography and Cinematography",
      "Music Technology",
      "Performing and Media Arts",
      "Culinary Arts",
      "Event Management Technology",
      "Cosmetology and Beauty Technology",
      "Textile Design Technology",
      "Animation and Game Art"
    ]
  },
  {
    template: "polytechnicAgriculture",
    courses: [
      "Agricultural Technology",
      "Food Technology",
      "Home and Rural Economics",
      "Fisheries Technology",
      "Forestry Technology",
      "Agribusiness Management",
      "Animal Health and Production Technology",
      "Horticultural Technology",
      "Crop Production Technology",
      "Agricultural and Extension Management",
      "Pest Management Technology",
      "Leather Technology",
      "Forestry and Environmental Technology",
      "Fisheries and Marine Technology"
    ]
  }
]

function expandGroups(groups) {
  return groups.flatMap(({ template, courses: items }) =>
    items.map((entry) => {
      const details = typeof entry === "string" ? { name: entry } : entry
      const preset = templates[template]

      return {
        id: `${slugify(details.name)}-${slugify(preset.type)}`,
        name: details.name,
        type: preset.type,
        category: details.category || preset.category,
        overview: details.overview || preset.overview(details.name),
        waecSubjects: details.waecSubjects || preset.waecSubjects,
        jambCombo: details.jambCombo || preset.jambCombo,
        careers: details.careers || preset.careers,
        aliases: details.aliases || []
      }
    })
  )
}

export const courses = [...expandGroups(universityGroups), ...expandGroups(polytechnicGroups)].sort((a, b) => {
  if (a.type !== b.type) {
    return a.type.localeCompare(b.type)
  }

  return a.name.localeCompare(b.name)
})

export const courseSearchSuggestions = Array.from(
  new Set(
    courses.flatMap(({ name, aliases = [], category, type }) => [name, ...aliases, category, type])
  )
).sort((a, b) => a.localeCompare(b))
