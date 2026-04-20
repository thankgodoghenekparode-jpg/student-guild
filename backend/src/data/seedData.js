const { quizQuestions } = require("../constants/quizQuestions")

const seededCourses = [
  {
    title: "Computer Science",
    institutionType: "University",
    category: "Computing & Digital Technology",
    summary: "A strong fit for students who enjoy mathematics, logic, and building digital products.",
    overview: "Computer Science trains students to design software, understand algorithms, manage data, and solve real-life problems with technology.",
    cutoffMark: 250,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Software Engineer", "Data Analyst", "Cybersecurity Analyst", "Product Engineer"],
    sideSkills: ["Python", "Git and GitHub", "UI/UX basics", "Technical writing"],
    tags: ["technology", "digital", "high-demand"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology", "design"],
      workStyles: ["data", "technology"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Software Engineering",
    institutionType: "University",
    category: "Computing & Digital Technology",
    summary: "Ideal for students who want to build applications and digital systems used by real people.",
    overview: "Software Engineering focuses on designing, testing, deploying, and maintaining reliable software products in teams.",
    cutoffMark: 245,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Frontend Engineer", "Backend Engineer", "Mobile Developer", "QA Engineer"],
    sideSkills: ["JavaScript", "Product thinking", "Cloud fundamentals", "Team collaboration"],
    tags: ["technology", "product", "engineering"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology"],
      workStyles: ["technology", "hands-on"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["practical-builds", "laboratory"]
    }
  },
  {
    title: "Cyber Security",
    institutionType: "University",
    category: "Computing & Digital Technology",
    summary: "Good for students who enjoy digital systems, risk prevention, and structured problem solving.",
    overview: "Cyber Security prepares students to protect networks, applications, and digital identities from attacks and misuse.",
    cutoffMark: 235,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Security Analyst", "Digital Forensics Specialist", "SOC Analyst", "Risk Consultant"],
    sideSkills: ["Linux", "Networking", "Ethical hacking basics", "Security writing"],
    tags: ["technology", "security", "risk"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology"],
      workStyles: ["data", "technology"],
      goals: ["solve-problems", "serve-community"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Data Science",
    institutionType: "University",
    category: "Computing & Digital Technology",
    summary: "Best for students who like numbers, trends, and evidence-based decision making.",
    overview: "Data Science combines statistics, computing, and storytelling to turn raw information into useful insight for organisations.",
    cutoffMark: 240,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Data Scientist", "Business Intelligence Analyst", "Machine Learning Engineer", "Research Analyst"],
    sideSkills: ["Excel", "SQL", "Python", "Data visualization"],
    tags: ["data", "analytics", "technology"],
    recommendationSignals: {
      strengths: ["mathematics", "economics", "physics"],
      interests: ["technology", "business"],
      workStyles: ["data", "technology"],
      goals: ["solve-problems", "build-products"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Medicine and Surgery",
    institutionType: "University",
    category: "Medical & Health Sciences",
    summary: "Designed for students committed to science, discipline, and patient care.",
    overview: "Medicine and Surgery covers diagnosis, treatment, clinical science, and long-term care within hospital and public health systems.",
    cutoffMark: 290,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Biology", "Chemistry", "Physics"],
    careers: ["Medical Doctor", "Clinical Researcher", "Public Health Physician", "Hospital Administrator"],
    sideSkills: ["Medical communication", "Research methods", "Digital record keeping", "Leadership"],
    tags: ["healthcare", "science", "high-demand"],
    recommendationSignals: {
      strengths: ["biology", "physics"],
      interests: ["healthcare", "social-impact"],
      workStyles: ["people", "leadership"],
      goals: ["help-people", "serve-community"],
      studyPreferences: ["laboratory", "fieldwork"]
    }
  },
  {
    title: "Nursing Science",
    institutionType: "University",
    category: "Medical & Health Sciences",
    summary: "A strong option for students who want direct impact through patient support and healthcare delivery.",
    overview: "Nursing Science develops practical and clinical skills for patient care, health education, and coordinated healthcare service.",
    cutoffMark: 260,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Biology", "Chemistry", "Physics"],
    careers: ["Registered Nurse", "Community Health Nurse", "Occupational Health Officer", "Nurse Educator"],
    sideSkills: ["Empathy", "Digital documentation", "Emergency response", "Health advocacy"],
    tags: ["healthcare", "service", "clinical"],
    recommendationSignals: {
      strengths: ["biology"],
      interests: ["healthcare", "social-impact"],
      workStyles: ["people", "hands-on"],
      goals: ["help-people", "serve-community"],
      studyPreferences: ["laboratory", "fieldwork"]
    }
  },
  {
    title: "Pharmacy",
    institutionType: "University",
    category: "Medical & Health Sciences",
    summary: "Good for science students who like healthcare but also enjoy precision and controlled systems.",
    overview: "Pharmacy focuses on drugs, dosage, patient safety, and pharmaceutical science across hospitals, manufacturing, and community settings.",
    cutoffMark: 270,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Biology", "Chemistry", "Physics"],
    careers: ["Pharmacist", "Drug Safety Officer", "Pharmaceutical Sales Specialist", "Regulatory Affairs Officer"],
    sideSkills: ["Inventory systems", "Patient counseling", "Research literacy", "Business basics"],
    tags: ["healthcare", "science", "precision"],
    recommendationSignals: {
      strengths: ["biology", "physics"],
      interests: ["healthcare", "business"],
      workStyles: ["people", "data"],
      goals: ["help-people", "solve-problems"],
      studyPreferences: ["laboratory", "case-study"]
    }
  },
  {
    title: "Medical Laboratory Science",
    institutionType: "University",
    category: "Medical & Health Sciences",
    summary: "Fits students who prefer scientific analysis behind clinical decision making.",
    overview: "Medical Laboratory Science prepares students to carry out diagnostic tests, analyse samples, and support disease management.",
    cutoffMark: 250,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Biology", "Chemistry", "Physics"],
    careers: ["Medical Laboratory Scientist", "Quality Control Analyst", "Diagnostic Specialist", "Biomedical Research Assistant"],
    sideSkills: ["Lab information systems", "Data entry accuracy", "Scientific writing", "Quality assurance"],
    tags: ["healthcare", "laboratory", "science"],
    recommendationSignals: {
      strengths: ["biology", "physics"],
      interests: ["healthcare", "technology"],
      workStyles: ["data", "hands-on"],
      goals: ["help-people", "solve-problems"],
      studyPreferences: ["laboratory"]
    }
  },
  {
    title: "Accounting",
    institutionType: "University",
    category: "Business, Finance & Management",
    summary: "Strong for students who like numbers, structure, and financial decision support.",
    overview: "Accounting equips students to record, analyse, and interpret financial information for organisations and entrepreneurs.",
    cutoffMark: 240,
    requiredSubjects: ["English Language", "Mathematics", "Economics", "Accounting/Commerce", "Government"],
    jambCombination: ["English", "Mathematics", "Economics", "Government"],
    careers: ["Accountant", "Auditor", "Tax Consultant", "Financial Analyst"],
    sideSkills: ["Excel", "Financial modeling", "Data storytelling", "Bookkeeping software"],
    tags: ["business", "finance", "numbers"],
    recommendationSignals: {
      strengths: ["mathematics", "economics"],
      interests: ["business"],
      workStyles: ["data", "leadership"],
      goals: ["run-business", "solve-problems"],
      studyPreferences: ["case-study", "reading-writing"]
    }
  },
  {
    title: "Economics",
    institutionType: "University",
    category: "Business, Finance & Management",
    summary: "A good fit for students who want to understand markets, policy, and resource allocation.",
    overview: "Economics trains students to study production, consumption, markets, policy, and financial systems within society.",
    cutoffMark: 235,
    requiredSubjects: ["English Language", "Mathematics", "Economics", "Government", "Any Social Science Subject"],
    jambCombination: ["English", "Mathematics", "Economics", "Government"],
    careers: ["Economist", "Policy Analyst", "Investment Analyst", "Development Consultant"],
    sideSkills: ["Statistics", "Excel", "Policy writing", "Presentation skills"],
    tags: ["business", "policy", "analysis"],
    recommendationSignals: {
      strengths: ["mathematics", "economics", "government"],
      interests: ["business", "social-impact"],
      workStyles: ["data", "leadership"],
      goals: ["run-business", "serve-community"],
      studyPreferences: ["case-study", "reading-writing"]
    }
  },
  {
    title: "Business Administration",
    institutionType: "University",
    category: "Business, Finance & Management",
    summary: "Works well for students who enjoy leadership, operations, and entrepreneurship.",
    overview: "Business Administration covers management, operations, strategy, human resources, and decision making for growing organisations.",
    cutoffMark: 230,
    requiredSubjects: ["English Language", "Mathematics", "Economics", "Commerce", "Government"],
    jambCombination: ["English", "Mathematics", "Economics", "Government"],
    careers: ["Operations Manager", "Business Analyst", "Entrepreneur", "HR Officer"],
    sideSkills: ["Excel", "Project management", "Sales communication", "Customer research"],
    tags: ["business", "leadership", "management"],
    recommendationSignals: {
      strengths: ["economics", "government"],
      interests: ["business", "communication"],
      workStyles: ["people", "leadership"],
      goals: ["run-business", "build-products"],
      studyPreferences: ["case-study", "fieldwork"]
    }
  },
  {
    title: "Banking and Finance",
    institutionType: "University",
    category: "Business, Finance & Management",
    summary: "Suitable for students who want exposure to money management, credit, and investment systems.",
    overview: "Banking and Finance focuses on financial institutions, risk, investment products, and practical money management.",
    cutoffMark: 225,
    requiredSubjects: ["English Language", "Mathematics", "Economics", "Commerce", "Government"],
    jambCombination: ["English", "Mathematics", "Economics", "Government"],
    careers: ["Banking Officer", "Financial Advisor", "Credit Analyst", "Treasury Associate"],
    sideSkills: ["Excel", "Fintech awareness", "Customer service", "Business communication"],
    tags: ["business", "finance", "banking"],
    recommendationSignals: {
      strengths: ["mathematics", "economics"],
      interests: ["business"],
      workStyles: ["data", "people"],
      goals: ["run-business", "solve-problems"],
      studyPreferences: ["case-study", "reading-writing"]
    }
  },
  {
    title: "Law",
    institutionType: "University",
    category: "Law, Governance & Humanities",
    summary: "Great for students who enjoy reading, argument, justice, and structured thinking.",
    overview: "Law develops legal reasoning, advocacy, research, and writing for public service, litigation, and business advisory work.",
    cutoffMark: 270,
    requiredSubjects: ["English Language", "Literature in English", "Government", "CRS/IRS", "Any Arts Subject"],
    jambCombination: ["English", "Literature", "Government", "CRS/IRS"],
    careers: ["Lawyer", "Legal Officer", "Compliance Manager", "Policy Advocate"],
    sideSkills: ["Public speaking", "Research writing", "Negotiation", "Document drafting"],
    tags: ["law", "communication", "justice"],
    recommendationSignals: {
      strengths: ["literature", "government"],
      interests: ["communication", "social-impact"],
      workStyles: ["people", "leadership"],
      goals: ["serve-community", "solve-problems"],
      studyPreferences: ["reading-writing"]
    }
  },
  {
    title: "Mass Communication",
    institutionType: "University",
    category: "Social Sciences & Communication",
    summary: "A strong path for students who enjoy writing, media, storytelling, and public influence.",
    overview: "Mass Communication trains students in journalism, broadcasting, strategic communication, and public relations.",
    cutoffMark: 235,
    requiredSubjects: ["English Language", "Literature in English", "Government", "Any Arts Subject", "CRS/IRS"],
    jambCombination: ["English", "Literature", "Government", "Any Arts Subject"],
    careers: ["Journalist", "PR Executive", "Broadcaster", "Content Strategist"],
    sideSkills: ["Copywriting", "Social media strategy", "Canva", "Video editing"],
    tags: ["media", "communication", "creative"],
    recommendationSignals: {
      strengths: ["literature", "government"],
      interests: ["communication", "design"],
      workStyles: ["people", "creativity"],
      goals: ["tell-stories", "serve-community"],
      studyPreferences: ["reading-writing", "studio"]
    }
  },
  {
    title: "Political Science",
    institutionType: "University",
    category: "Social Sciences & Communication",
    summary: "Best for students who care about institutions, leadership, and how society is organised.",
    overview: "Political Science examines governance, institutions, public administration, international relations, and civic participation.",
    cutoffMark: 220,
    requiredSubjects: ["English Language", "Government", "Economics", "Literature/CRS/IRS", "Any Arts Subject"],
    jambCombination: ["English", "Government", "Economics", "Literature/CRS/IRS"],
    careers: ["Policy Analyst", "Legislative Aide", "Civic Educator", "Public Affairs Officer"],
    sideSkills: ["Policy writing", "Research", "Presentation skills", "Stakeholder management"],
    tags: ["policy", "governance", "society"],
    recommendationSignals: {
      strengths: ["government", "economics"],
      interests: ["social-impact", "communication"],
      workStyles: ["people", "leadership"],
      goals: ["serve-community", "tell-stories"],
      studyPreferences: ["reading-writing", "fieldwork"]
    }
  },
  {
    title: "Psychology",
    institutionType: "University",
    category: "Social Sciences & Communication",
    summary: "A good fit for students interested in behaviour, support systems, and human decision making.",
    overview: "Psychology studies cognition, behaviour, wellbeing, and support systems across education, work, and healthcare.",
    cutoffMark: 225,
    requiredSubjects: ["English Language", "Biology", "Government", "Mathematics", "Any Social Science Subject"],
    jambCombination: ["English", "Biology", "Government", "Any Social Science Subject"],
    careers: ["Counsellor", "HR Specialist", "Behavior Analyst", "Research Assistant"],
    sideSkills: ["Empathy", "Interviewing", "Observation methods", "Report writing"],
    tags: ["people", "behaviour", "support"],
    recommendationSignals: {
      strengths: ["biology", "government"],
      interests: ["social-impact", "healthcare"],
      workStyles: ["people", "data"],
      goals: ["help-people", "serve-community"],
      studyPreferences: ["reading-writing", "fieldwork"]
    }
  },
  {
    title: "Sociology",
    institutionType: "University",
    category: "Social Sciences & Communication",
    summary: "Useful for students who want to understand communities, behaviour, and social change.",
    overview: "Sociology explores social structures, institutions, culture, and the causes of social problems.",
    cutoffMark: 210,
    requiredSubjects: ["English Language", "Government", "Economics", "Literature/CRS/IRS", "Any Social Science Subject"],
    jambCombination: ["English", "Government", "Economics", "Any Social Science Subject"],
    careers: ["Social Researcher", "Program Officer", "Community Development Officer", "NGO Coordinator"],
    sideSkills: ["Research methods", "Survey tools", "Writing", "Community engagement"],
    tags: ["society", "community", "research"],
    recommendationSignals: {
      strengths: ["government", "economics"],
      interests: ["social-impact", "communication"],
      workStyles: ["people", "leadership"],
      goals: ["serve-community", "help-people"],
      studyPreferences: ["reading-writing", "fieldwork"]
    }
  },
  {
    title: "Architecture",
    institutionType: "University",
    category: "Built Environment & Design",
    summary: "Good for students who blend creativity with physics, space planning, and technical thinking.",
    overview: "Architecture trains students to design buildings and spaces that are functional, safe, and visually meaningful.",
    cutoffMark: 245,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry/Geography", "Technical Drawing/Fine Art"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry/Geography"],
    careers: ["Architect", "Design Consultant", "Interior Space Planner", "Urban Design Assistant"],
    sideSkills: ["SketchUp", "AutoCAD", "Presentation design", "Model making"],
    tags: ["design", "space", "creative"],
    recommendationSignals: {
      strengths: ["mathematics", "physics", "literature"],
      interests: ["design"],
      workStyles: ["creativity", "hands-on"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["studio", "fieldwork"]
    }
  },
  {
    title: "Civil Engineering",
    institutionType: "University",
    category: "Engineering & Applied Technology",
    summary: "A solid route for students who want to build roads, bridges, structures, and public infrastructure.",
    overview: "Civil Engineering prepares students to design, build, and maintain infrastructure that supports transport and urban development.",
    cutoffMark: 245,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Civil Engineer", "Site Engineer", "Structural Analyst", "Project Supervisor"],
    sideSkills: ["AutoCAD", "Project planning", "Excel", "Site reporting"],
    tags: ["engineering", "infrastructure", "hands-on"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology", "social-impact"],
      workStyles: ["hands-on", "leadership"],
      goals: ["solve-problems", "serve-community"],
      studyPreferences: ["fieldwork", "practical-builds"]
    }
  },
  {
    title: "Mechanical Engineering",
    institutionType: "University",
    category: "Engineering & Applied Technology",
    summary: "Great for students who enjoy machines, design, and practical systems.",
    overview: "Mechanical Engineering covers mechanics, manufacturing, thermodynamics, and machine design for industry and innovation.",
    cutoffMark: 240,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Mechanical Engineer", "Maintenance Engineer", "Design Engineer", "Production Engineer"],
    sideSkills: ["CAD software", "Workshop safety", "3D design", "Technical documentation"],
    tags: ["engineering", "machines", "practical"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology"],
      workStyles: ["hands-on", "technology"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Electrical and Electronics Engineering",
    institutionType: "University",
    category: "Engineering & Applied Technology",
    summary: "Strong for students interested in circuits, power, communication systems, and devices.",
    overview: "Electrical and Electronics Engineering trains students to work on power systems, embedded devices, electronics, and automation.",
    cutoffMark: 250,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Electrical Engineer", "Electronics Engineer", "Embedded Systems Engineer", "Power Systems Analyst"],
    sideSkills: ["Circuit simulation", "Arduino", "Technical drawing", "Python"],
    tags: ["engineering", "electronics", "technology"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology"],
      workStyles: ["technology", "hands-on"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Mechatronics Engineering",
    institutionType: "University",
    category: "Engineering & Applied Technology",
    summary: "Perfect for students who want robotics, automation, and multi-disciplinary engineering exposure.",
    overview: "Mechatronics combines electronics, mechanics, automation, and control systems for modern intelligent machines.",
    cutoffMark: 248,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Automation Engineer", "Robotics Engineer", "Control Systems Engineer", "Maintenance Specialist"],
    sideSkills: ["Arduino", "Programming", "CAD", "Electronics repair"],
    tags: ["automation", "technology", "robotics"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology", "design"],
      workStyles: ["technology", "hands-on"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Chemical Engineering",
    institutionType: "University",
    category: "Engineering & Applied Technology",
    summary: "Strong for students who like chemistry, process systems, and industrial problem solving.",
    overview: "Chemical Engineering prepares students for process design, production systems, and industrial chemistry applications.",
    cutoffMark: 238,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Process Engineer", "Production Engineer", "Quality Assurance Officer", "Plant Engineer"],
    sideSkills: ["Process simulation", "Excel", "Safety management", "Report writing"],
    tags: ["engineering", "chemistry", "industry"],
    recommendationSignals: {
      strengths: ["mathematics", "physics", "biology"],
      interests: ["technology", "healthcare"],
      workStyles: ["data", "hands-on"],
      goals: ["solve-problems", "build-products"],
      studyPreferences: ["laboratory", "fieldwork"]
    }
  },
  {
    title: "Biochemistry",
    institutionType: "University",
    category: "Pure & Applied Sciences",
    summary: "A strong route for students who enjoy biology, chemistry, and laboratory science.",
    overview: "Biochemistry explains the chemistry of living systems and supports work in health, food, and pharmaceutical industries.",
    cutoffMark: 230,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Biology", "Chemistry", "Physics"],
    careers: ["Biochemist", "Quality Control Scientist", "Research Assistant", "Laboratory Analyst"],
    sideSkills: ["Lab safety", "Scientific writing", "Data entry", "Excel"],
    tags: ["science", "laboratory", "biology"],
    recommendationSignals: {
      strengths: ["biology", "physics"],
      interests: ["healthcare", "technology"],
      workStyles: ["data", "hands-on"],
      goals: ["solve-problems", "help-people"],
      studyPreferences: ["laboratory"]
    }
  },
  {
    title: "Microbiology",
    institutionType: "University",
    category: "Pure & Applied Sciences",
    summary: "Fits students who enjoy biology, experiments, and health or environmental applications.",
    overview: "Microbiology focuses on microorganisms, infection, food safety, and laboratory analysis across healthcare and industry.",
    cutoffMark: 225,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Biology", "Chemistry", "Physics"],
    careers: ["Microbiologist", "Food Safety Analyst", "Laboratory Scientist", "Public Health Assistant"],
    sideSkills: ["Microscopy basics", "Scientific writing", "Quality control", "Data logging"],
    tags: ["science", "biology", "health"],
    recommendationSignals: {
      strengths: ["biology"],
      interests: ["healthcare", "social-impact"],
      workStyles: ["data", "hands-on"],
      goals: ["help-people", "solve-problems"],
      studyPreferences: ["laboratory"]
    }
  },
  {
    title: "Statistics",
    institutionType: "University",
    category: "Pure & Applied Sciences",
    summary: "Best for students who love numbers, patterns, and drawing insight from data.",
    overview: "Statistics trains students to collect, organise, analyse, and interpret data for science, business, and public policy.",
    cutoffMark: 220,
    requiredSubjects: ["English Language", "Mathematics", "Physics/Economics", "Any Science Subject", "Any Social Science Subject"],
    jambCombination: ["English", "Mathematics", "Economics", "Any Science Subject"],
    careers: ["Statistician", "Data Analyst", "Research Officer", "Monitoring and Evaluation Analyst"],
    sideSkills: ["Excel", "SQL", "SPSS/R", "Dashboard storytelling"],
    tags: ["data", "numbers", "analysis"],
    recommendationSignals: {
      strengths: ["mathematics", "economics"],
      interests: ["business", "technology"],
      workStyles: ["data"],
      goals: ["solve-problems", "serve-community"],
      studyPreferences: ["case-study", "practical-builds"]
    }
  },
  {
    title: "Computer Engineering",
    institutionType: "University",
    category: "Engineering & Applied Technology",
    summary: "Great for students who want both hardware and software understanding.",
    overview: "Computer Engineering covers digital hardware, embedded systems, software integration, and intelligent device design.",
    cutoffMark: 245,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Embedded Systems Engineer", "Systems Engineer", "Hardware Engineer", "IoT Developer"],
    sideSkills: ["C/C++", "Arduino", "PCB basics", "Linux"],
    tags: ["hardware", "technology", "engineering"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology"],
      workStyles: ["technology", "hands-on"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Information Technology",
    institutionType: "University",
    category: "Computing & Digital Technology",
    summary: "A practical path for students who want tech careers focused on systems and support delivery.",
    overview: "Information Technology focuses on software systems, digital operations, user support, and enterprise technology services.",
    cutoffMark: 230,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Further Mathematics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["IT Support Specialist", "Systems Administrator", "Cloud Support Engineer", "Business Analyst"],
    sideSkills: ["Networking", "Microsoft Office", "Cloud basics", "Documentation"],
    tags: ["technology", "systems", "support"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology", "business"],
      workStyles: ["technology", "people"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["practical-builds", "case-study"]
    }
  },
  {
    title: "Information Systems",
    institutionType: "University",
    category: "Computing & Digital Technology",
    summary: "Good for students who sit between business processes and digital systems.",
    overview: "Information Systems blends technology, data, and operations so organisations can run better with software and information tools.",
    cutoffMark: 225,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Economics", "Any Science Subject"],
    jambCombination: ["English", "Mathematics", "Economics", "Physics"],
    careers: ["Business Systems Analyst", "Product Operations Analyst", "ERP Support Specialist", "Data Coordinator"],
    sideSkills: ["SQL", "Spreadsheet modeling", "Process mapping", "Stakeholder communication"],
    tags: ["technology", "business", "operations"],
    recommendationSignals: {
      strengths: ["mathematics", "economics"],
      interests: ["technology", "business"],
      workStyles: ["data", "leadership"],
      goals: ["run-business", "build-products"],
      studyPreferences: ["case-study", "practical-builds"]
    }
  },
  {
    title: "Marketing",
    institutionType: "University",
    category: "Business, Finance & Management",
    summary: "Strong for students who like persuasion, consumer behaviour, and business growth.",
    overview: "Marketing teaches brand strategy, consumer research, digital promotion, and customer relationship management.",
    cutoffMark: 215,
    requiredSubjects: ["English Language", "Mathematics", "Economics", "Commerce", "Government"],
    jambCombination: ["English", "Mathematics", "Economics", "Government"],
    careers: ["Marketing Executive", "Brand Strategist", "Growth Associate", "Market Research Assistant"],
    sideSkills: ["Canva", "Digital marketing", "Copywriting", "Analytics basics"],
    tags: ["business", "communication", "creative"],
    recommendationSignals: {
      strengths: ["economics", "literature", "government"],
      interests: ["business", "communication"],
      workStyles: ["people", "creativity"],
      goals: ["run-business", "tell-stories"],
      studyPreferences: ["case-study", "studio"]
    }
  },
  {
    title: "Public Administration",
    institutionType: "University",
    category: "Law, Governance & Humanities",
    summary: "A solid route for students interested in public institutions and service delivery.",
    overview: "Public Administration focuses on policy implementation, government systems, records, and public sector operations.",
    cutoffMark: 210,
    requiredSubjects: ["English Language", "Government", "Economics", "Mathematics", "Any Social Science Subject"],
    jambCombination: ["English", "Government", "Economics", "Any Social Science Subject"],
    careers: ["Administrative Officer", "Program Officer", "Local Government Officer", "Policy Support Specialist"],
    sideSkills: ["Report writing", "Excel", "Project coordination", "Communication"],
    tags: ["governance", "service", "administration"],
    recommendationSignals: {
      strengths: ["government", "economics"],
      interests: ["social-impact", "business"],
      workStyles: ["people", "leadership"],
      goals: ["serve-community", "help-people"],
      studyPreferences: ["reading-writing", "fieldwork"]
    }
  },
  {
    title: "English and Literary Studies",
    institutionType: "University",
    category: "Law, Governance & Humanities",
    summary: "Perfect for students who enjoy language, interpretation, and strong written expression.",
    overview: "English and Literary Studies develops critical reading, writing, communication, and cultural analysis skills.",
    cutoffMark: 215,
    requiredSubjects: ["English Language", "Literature in English", "Government/History", "CRS/IRS", "Any Arts Subject"],
    jambCombination: ["English", "Literature", "Government/History", "Any Arts Subject"],
    careers: ["Editor", "Writer", "Communications Officer", "Content Strategist"],
    sideSkills: ["Creative writing", "Public speaking", "Copy editing", "Digital publishing"],
    tags: ["writing", "communication", "arts"],
    recommendationSignals: {
      strengths: ["literature", "government"],
      interests: ["communication", "design"],
      workStyles: ["creativity", "people"],
      goals: ["tell-stories", "serve-community"],
      studyPreferences: ["reading-writing", "studio"]
    }
  },
  {
    title: "Theatre Arts",
    institutionType: "University",
    category: "Law, Governance & Humanities",
    summary: "Suitable for expressive students interested in performance, storytelling, and production.",
    overview: "Theatre Arts covers acting, directing, script work, production, and the cultural role of performance.",
    cutoffMark: 205,
    requiredSubjects: ["English Language", "Literature in English", "Government/History", "CRS/IRS", "Fine Art/Music"],
    jambCombination: ["English", "Literature", "Government/History", "Any Arts Subject"],
    careers: ["Actor", "Script Writer", "Media Producer", "Creative Director"],
    sideSkills: ["Video editing", "Presentation", "Voice training", "Social media storytelling"],
    tags: ["creative", "media", "arts"],
    recommendationSignals: {
      strengths: ["literature"],
      interests: ["communication", "design"],
      workStyles: ["creativity", "people"],
      goals: ["tell-stories", "build-products"],
      studyPreferences: ["studio", "reading-writing"]
    }
  },
  {
    title: "Fine and Applied Arts",
    institutionType: "University",
    category: "Law, Governance & Humanities",
    summary: "A good path for visually creative students who want design or art careers.",
    overview: "Fine and Applied Arts develops visual communication, design thinking, craft, and artistic production skills.",
    cutoffMark: 200,
    requiredSubjects: ["English Language", "Fine Art", "Literature/CRS/IRS", "Government/History", "Any Arts Subject"],
    jambCombination: ["English", "Fine Art", "Literature", "Any Arts Subject"],
    careers: ["Graphic Designer", "Illustrator", "Art Director", "Creative Entrepreneur"],
    sideSkills: ["Canva", "Adobe tools", "Photography", "Portfolio building"],
    tags: ["design", "creative", "visual"],
    recommendationSignals: {
      strengths: ["literature"],
      interests: ["design"],
      workStyles: ["creativity"],
      goals: ["tell-stories", "build-products"],
      studyPreferences: ["studio"]
    }
  },
  {
    title: "Agricultural Economics",
    institutionType: "University",
    category: "Agriculture & Environmental Resources",
    summary: "Strong for students interested in food systems, entrepreneurship, and development.",
    overview: "Agricultural Economics links farming, business, finance, and policy to improve food systems and agribusiness performance.",
    cutoffMark: 210,
    requiredSubjects: ["English Language", "Mathematics", "Biology/Agricultural Science", "Chemistry", "Economics"],
    jambCombination: ["English", "Biology/Agricultural Science", "Chemistry", "Economics"],
    careers: ["Agribusiness Analyst", "Farm Operations Officer", "Extension Program Assistant", "Commodity Analyst"],
    sideSkills: ["Excel", "Business planning", "Supply chain basics", "Grant writing"],
    tags: ["agriculture", "business", "development"],
    recommendationSignals: {
      strengths: ["economics", "biology"],
      interests: ["business", "social-impact"],
      workStyles: ["data", "fieldwork"],
      goals: ["run-business", "serve-community"],
      studyPreferences: ["fieldwork", "case-study"]
    }
  },
  {
    title: "Food Science and Technology",
    institutionType: "University",
    category: "Agriculture & Environmental Resources",
    summary: "Ideal for students who enjoy science and want to improve food quality and production.",
    overview: "Food Science and Technology focuses on food safety, processing, quality control, and industrial production systems.",
    cutoffMark: 220,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Chemistry", "Biology", "Physics/Mathematics"],
    careers: ["Food Scientist", "Quality Assurance Officer", "Production Supervisor", "Regulatory Assistant"],
    sideSkills: ["HACCP basics", "Quality documentation", "Excel", "Research methods"],
    tags: ["food", "science", "industry"],
    recommendationSignals: {
      strengths: ["biology", "physics"],
      interests: ["healthcare", "business"],
      workStyles: ["hands-on", "data"],
      goals: ["solve-problems", "help-people"],
      studyPreferences: ["laboratory", "fieldwork"]
    }
  },
  {
    title: "Education and Biology",
    institutionType: "University",
    category: "Education & Learning Sciences",
    summary: "Useful for students who enjoy biology and want to teach, mentor, or guide younger learners.",
    overview: "Education and Biology combines subject knowledge with teaching practice, curriculum, and learner development.",
    cutoffMark: 200,
    requiredSubjects: ["English Language", "Biology", "Chemistry", "Mathematics", "Any Approved Subject"],
    jambCombination: ["English", "Biology", "Chemistry", "Any Approved Subject"],
    careers: ["Biology Teacher", "Curriculum Assistant", "Learning Facilitator", "Education Program Officer"],
    sideSkills: ["Presentation", "Classroom tech tools", "Lesson planning", "Mentoring"],
    tags: ["education", "biology", "teaching"],
    recommendationSignals: {
      strengths: ["biology"],
      interests: ["social-impact", "healthcare"],
      workStyles: ["people", "leadership"],
      goals: ["help-people", "serve-community"],
      studyPreferences: ["reading-writing", "fieldwork"]
    }
  },
  {
    title: "Guidance and Counselling",
    institutionType: "University",
    category: "Education & Learning Sciences",
    summary: "A meaningful option for students who want to support academic and emotional development.",
    overview: "Guidance and Counselling develops helping skills for school support, personal development, and career guidance work.",
    cutoffMark: 190,
    requiredSubjects: ["English Language", "Government", "Biology", "Mathematics", "Any Social Science Subject"],
    jambCombination: ["English", "Government", "Biology", "Any Social Science Subject"],
    careers: ["School Counsellor", "Student Support Officer", "Youth Program Facilitator", "Career Adviser"],
    sideSkills: ["Active listening", "Documentation", "Workshop facilitation", "Digital scheduling"],
    tags: ["support", "education", "people"],
    recommendationSignals: {
      strengths: ["government", "biology"],
      interests: ["social-impact", "communication"],
      workStyles: ["people"],
      goals: ["help-people", "serve-community"],
      studyPreferences: ["reading-writing", "fieldwork"]
    }
  },
  {
    title: "Science Laboratory Technology",
    institutionType: "Polytechnic",
    category: "Science, ICT & Laboratory Technology",
    summary: "Practical for students who want hands-on laboratory and science support skills.",
    overview: "Science Laboratory Technology provides practical laboratory training for research, diagnostics, and technical support environments.",
    cutoffMark: 180,
    requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
    jambCombination: ["English", "Biology", "Chemistry", "Physics"],
    careers: ["Lab Technologist", "QC Technician", "Research Technician", "Field Testing Officer"],
    sideSkills: ["Lab safety", "Data logging", "Equipment maintenance", "Reporting"],
    tags: ["polytechnic", "laboratory", "science"],
    recommendationSignals: {
      strengths: ["biology", "physics"],
      interests: ["healthcare", "technology"],
      workStyles: ["hands-on", "data"],
      goals: ["solve-problems", "help-people"],
      studyPreferences: ["laboratory"]
    }
  },
  {
    title: "Computer Engineering Technology",
    institutionType: "Polytechnic",
    category: "Engineering Technology",
    summary: "A practical route into hardware, networking, repairs, and embedded systems support.",
    overview: "Computer Engineering Technology emphasises practical system assembly, maintenance, networking, and embedded tools.",
    cutoffMark: 180,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Technical Drawing/Basic Electronics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Hardware Technician", "Network Support Engineer", "Embedded Systems Technician", "IT Field Support"],
    sideSkills: ["PC repair", "Networking", "Linux", "Basic programming"],
    tags: ["polytechnic", "hardware", "technology"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology"],
      workStyles: ["hands-on", "technology"],
      goals: ["build-products", "solve-problems"],
      studyPreferences: ["practical-builds", "laboratory"]
    }
  },
  {
    title: "Mass Communication",
    institutionType: "Polytechnic",
    category: "Creative, Media & Service Industries",
    summary: "Great for students who want a practical route into media, PR, and content creation.",
    overview: "Polytechnic Mass Communication focuses on practical media production, reporting, PR, and digital communication execution.",
    cutoffMark: 180,
    requiredSubjects: ["English Language", "Literature in English", "Government", "Any Arts Subject", "CRS/IRS"],
    jambCombination: ["English", "Literature", "Government", "Any Arts Subject"],
    careers: ["Reporter", "Media Assistant", "Content Creator", "PR Officer"],
    sideSkills: ["Video editing", "Canva", "Script writing", "Social media management"],
    tags: ["polytechnic", "media", "creative"],
    recommendationSignals: {
      strengths: ["literature", "government"],
      interests: ["communication", "design"],
      workStyles: ["people", "creativity"],
      goals: ["tell-stories", "build-products"],
      studyPreferences: ["studio", "reading-writing"]
    }
  },
  {
    title: "Accountancy",
    institutionType: "Polytechnic",
    category: "Business & Administrative Studies",
    summary: "Practical and employable for students who want accounting skills quickly.",
    overview: "Polytechnic Accountancy gives applied training in bookkeeping, reporting, and business financial operations.",
    cutoffMark: 180,
    requiredSubjects: ["English Language", "Mathematics", "Economics", "Commerce/Accounting", "Government"],
    jambCombination: ["English", "Mathematics", "Economics", "Government"],
    careers: ["Accounts Officer", "Bookkeeper", "Payroll Officer", "Finance Assistant"],
    sideSkills: ["Excel", "Accounting software", "Data entry", "Business communication"],
    tags: ["polytechnic", "finance", "business"],
    recommendationSignals: {
      strengths: ["mathematics", "economics"],
      interests: ["business"],
      workStyles: ["data"],
      goals: ["run-business", "solve-problems"],
      studyPreferences: ["case-study"]
    }
  },
  {
    title: "Electrical and Electronic Engineering Technology",
    institutionType: "Polytechnic",
    category: "Engineering Technology",
    summary: "Best for students who want practical electrical, electronics, and maintenance skills.",
    overview: "This course trains students in power systems, electronics maintenance, instrumentation, and applied engineering practice.",
    cutoffMark: 180,
    requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Technical Drawing/Basic Electronics"],
    jambCombination: ["English", "Mathematics", "Physics", "Chemistry"],
    careers: ["Electrical Technician", "Maintenance Technologist", "Electronics Specialist", "Field Service Engineer"],
    sideSkills: ["Circuit troubleshooting", "Safety practice", "Technical drawing", "Solar basics"],
    tags: ["polytechnic", "electronics", "engineering"],
    recommendationSignals: {
      strengths: ["mathematics", "physics"],
      interests: ["technology"],
      workStyles: ["hands-on", "technology"],
      goals: ["solve-problems", "build-products"],
      studyPreferences: ["laboratory", "practical-builds"]
    }
  },
  {
    title: "Business Administration and Management",
    institutionType: "Polytechnic",
    category: "Business & Administrative Studies",
    summary: "A practical option for students who want management and entrepreneurship skills.",
    overview: "This programme emphasises applied management, records, operations, and small business growth.",
    cutoffMark: 180,
    requiredSubjects: ["English Language", "Mathematics", "Economics", "Commerce", "Government"],
    jambCombination: ["English", "Mathematics", "Economics", "Government"],
    careers: ["Admin Officer", "Operations Assistant", "Customer Experience Executive", "Entrepreneur"],
    sideSkills: ["Excel", "Sales", "Project coordination", "Business writing"],
    tags: ["polytechnic", "business", "management"],
    recommendationSignals: {
      strengths: ["economics", "government"],
      interests: ["business", "communication"],
      workStyles: ["people", "leadership"],
      goals: ["run-business", "serve-community"],
      studyPreferences: ["case-study", "fieldwork"]
    }
  }
]

const seededArticles = [
  {
    title: "Financial discipline for your first years after secondary school",
    category: "Financial discipline",
    summary: "Simple rules to manage transport, feeding, savings, and school expenses without pressure.",
    content: [
      "Start by tracking the small daily spending that usually feels invisible, especially transport, snacks, and data.",
      "Separate emergency money from flexible money so you do not touch school or exam funds casually.",
      "If you earn from side gigs, split income into savings, upkeep, and reinvestment instead of spending everything at once.",
      "Build a habit of waiting before impulse purchases, especially phones, fashion, and social outings."
    ],
    imageUrl: "",
    readTimeMinutes: 6,
    featured: true
  },
  {
    title: "How to avoid bad influence without isolating yourself",
    category: "Avoiding bad influence",
    summary: "Learn how to keep your standards, manage peer pressure, and still maintain healthy friendships.",
    content: [
      "Notice the environments that weaken your discipline before you focus only on individual people.",
      "Use clear, calm boundaries when you are invited into risky situations you already know are wrong for you.",
      "Stay close to classmates, mentors, or relatives who normalize focus, honesty, and healthy ambition.",
      "You do not need to insult people to protect your future; distance and consistency are often enough."
    ],
    imageUrl: "",
    readTimeMinutes: 5,
    featured: true
  },
  {
    title: "Study techniques that work when motivation is low",
    category: "Study techniques",
    summary: "Use active recall, short focus blocks, and realistic revision plans that help you keep moving.",
    content: [
      "Start difficult reading sessions with one short question instead of waiting for perfect motivation.",
      "Use active recall by closing your notes and explaining topics out loud in your own words.",
      "Practice past questions under time pressure because memory improves when retrieval is harder.",
      "Review mistakes the same day so weak topics become revision targets instead of hidden problems."
    ],
    imageUrl: "",
    readTimeMinutes: 7,
    featured: true
  },
  {
    title: "Skill development ideas every Nigerian student can start early",
    category: "Skill development",
    summary: "Pick side skills that make your degree stronger and open doors before graduation.",
    content: [
      "Choose one digital skill that fits your likely course path, such as Excel, Canva, coding, research, or video editing.",
      "Build evidence of progress with simple projects, not only certificates.",
      "Join school clubs, volunteer groups, and internships that expose you to teamwork and accountability.",
      "Your side skill should support your academic direction, not become a distraction from it."
    ],
    imageUrl: "",
    readTimeMinutes: 6,
    featured: false
  },
  {
    title: "Internship preparation before you even enter university",
    category: "Internship preparation",
    summary: "Prepare CV basics, communication habits, and project samples early so opportunities find you ready.",
    content: [
      "Keep a simple record of leadership roles, volunteer work, and projects from secondary school onward.",
      "Learn professional email writing now because many students delay this until they need urgent help.",
      "Ask what employers value in your intended field and begin practicing those tools early.",
      "A small portfolio or one-page CV is easier to improve gradually than to rush later."
    ],
    imageUrl: "",
    readTimeMinutes: 5,
    featured: false
  }
]

const seededDemoUser = {
  name: "Demo Student",
  email: "student@example.com",
  password: "Student@12345",
  role: "student"
}

module.exports = {
  quizQuestions,
  seededArticles,
  seededCourses,
  seededDemoUser
}
