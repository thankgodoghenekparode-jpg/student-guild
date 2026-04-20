const { expansionPracticeBank } = require("./practiceExpansionSeedData")

const practiceBank = {
  JAMB: {
    "Use of English": [
      {
        topic: "Lexis and structure",
        year: "2024",
        prompt: "Choose the option that best completes the sentence: The principal advised the students to desist ______ examination malpractice.",
        options: ["from", "with", "to", "against"],
        correctOption: 0,
        explanation: "The verb 'desist' is correctly followed by 'from' when introducing the activity being stopped."
      },
      {
        topic: "Comprehension",
        year: "2023",
        prompt: "In comprehension questions, the main purpose of a topic sentence in a paragraph is to:",
        options: [
          "introduce the central idea of the paragraph",
          "summarize the entire passage",
          "list examples only",
          "announce the conclusion of the writer"
        ],
        correctOption: 0,
        explanation: "A topic sentence introduces the controlling idea that the rest of the paragraph develops."
      },
      {
        topic: "Register",
        year: "2022",
        prompt: "Which of these belongs most naturally to the register of medicine?",
        options: ["diagnosis", "decree", "ledger", "syllabus"],
        correctOption: 0,
        explanation: "'Diagnosis' is a medical term used in identifying disease or illness."
      },
      {
        topic: "Oral English",
        year: "2021",
        prompt: "Which word has a different stress pattern from the others?",
        options: ["teacher", "beauty", "become", "market"],
        correctOption: 2,
        explanation: "'Become' is stressed on the second syllable, while the others are stressed on the first."
      },
      {
        topic: "Sentence completion",
        year: "2020",
        prompt: "Choose the option that best completes the sentence: The committee has not yet arrived ______ a final decision.",
        options: ["for", "at", "on", "in"],
        correctOption: 1,
        explanation: "The standard expression is 'arrive at a decision'."
      }
    ],
    Mathematics: [
      {
        topic: "Algebra",
        year: "2024",
        prompt: "If 3x - 5 = 16, what is the value of x?",
        options: ["5", "6", "7", "8"],
        correctOption: 2,
        explanation: "Add 5 to both sides to get 3x = 21, then divide by 3, so x = 7."
      },
      {
        topic: "Percentages",
        year: "2023",
        prompt: "A trader bought a bag for N20,000 and sold it for N23,000. What was the percentage profit?",
        options: ["10%", "12.5%", "15%", "20%"],
        correctOption: 2,
        explanation: "Profit = 3,000. Percentage profit = 3,000 / 20,000 x 100 = 15%."
      },
      {
        topic: "Geometry",
        year: "2022",
        prompt: "The sum of the interior angles of a triangle is:",
        options: ["90 degrees", "180 degrees", "270 degrees", "360 degrees"],
        correctOption: 1,
        explanation: "Every triangle has an interior angle sum of 180 degrees."
      },
      {
        topic: "Statistics",
        year: "2021",
        prompt: "Find the mean of 3, 5, 7, and 9.",
        options: ["5", "6", "6.5", "7"],
        correctOption: 1,
        explanation: "Add the values: 3 + 5 + 7 + 9 = 24. Divide by 4 to get 6."
      },
      {
        topic: "Quadratic equations",
        year: "2020",
        prompt: "Solve x^2 - 9 = 0.",
        options: ["x = 3 only", "x = -3 only", "x = 3 or x = -3", "x = 0 or x = 9"],
        correctOption: 2,
        explanation: "x^2 = 9, so x = plus or minus 3."
      }
    ],
    Biology: [
      {
        topic: "Ecology",
        year: "2024",
        prompt: "Green plants are referred to as producers in an ecosystem because they:",
        options: [
          "manufacture their own food",
          "consume primary consumers",
          "store only water",
          "decompose dead organisms"
        ],
        correctOption: 0,
        explanation: "Plants manufacture food by photosynthesis, which is why they are producers."
      },
      {
        topic: "Cell biology",
        year: "2023",
        prompt: "Which cell organelle is mainly responsible for respiration and energy release?",
        options: ["Ribosome", "Mitochondrion", "Nucleus", "Golgi body"],
        correctOption: 1,
        explanation: "The mitochondrion is the site of aerobic respiration and ATP production."
      },
      {
        topic: "Human physiology",
        year: "2022",
        prompt: "The blood vessel that carries oxygenated blood from the lungs to the heart is the:",
        options: ["pulmonary artery", "vena cava", "pulmonary vein", "aorta"],
        correctOption: 2,
        explanation: "The pulmonary vein returns oxygenated blood from the lungs to the left atrium."
      },
      {
        topic: "Genetics",
        year: "2021",
        prompt: "Inherited characteristics are transmitted from parents to offspring through:",
        options: ["enzymes", "genes", "hormones", "tissues"],
        correctOption: 1,
        explanation: "Genes are the hereditary units that carry inherited traits."
      },
      {
        topic: "Classification",
        year: "2020",
        prompt: "The class Mammalia is distinguished from other vertebrates mainly because mammals:",
        options: ["possess mammary glands", "lay eggs in water", "have cold blood", "breathe only with gills"],
        correctOption: 0,
        explanation: "Mammary glands are a defining characteristic of mammals."
      }
    ],
    Physics: [
      {
        topic: "Motion",
        year: "2024",
        prompt: "Velocity is defined as:",
        options: [
          "distance moved in a given direction",
          "speed in a given direction",
          "force times distance",
          "mass multiplied by speed"
        ],
        correctOption: 1,
        explanation: "Velocity is speed with direction."
      },
      {
        topic: "Waves",
        year: "2023",
        prompt: "The SI unit of frequency is:",
        options: ["metre", "pascal", "hertz", "joule"],
        correctOption: 2,
        explanation: "Frequency is measured in hertz (Hz)."
      },
      {
        topic: "Electricity",
        year: "2022",
        prompt: "Which instrument is used to measure electric current?",
        options: ["Voltmeter", "Ammeter", "Ohmmeter", "Barometer"],
        correctOption: 1,
        explanation: "An ammeter is the standard instrument for measuring current."
      },
      {
        topic: "Energy",
        year: "2021",
        prompt: "Potential energy possessed by a body due to its position is called:",
        options: ["kinetic energy", "chemical energy", "gravitational potential energy", "heat energy"],
        correctOption: 2,
        explanation: "Energy due to position in a gravitational field is gravitational potential energy."
      },
      {
        topic: "Heat",
        year: "2020",
        prompt: "The process by which heat is transferred through solids without bulk movement is:",
        options: ["convection", "radiation", "conduction", "evaporation"],
        correctOption: 2,
        explanation: "Conduction is heat transfer through matter without overall movement of the medium."
      }
    ],
    Chemistry: [
      {
        topic: "Atomic structure",
        year: "2024",
        prompt: "The number of protons in the nucleus of an atom is known as its:",
        options: ["mass number", "atomic number", "molar mass", "nucleon number"],
        correctOption: 1,
        explanation: "Atomic number is the number of protons in an atom."
      },
      {
        topic: "Acids and bases",
        year: "2023",
        prompt: "A substance with pH 2 is best described as:",
        options: ["neutral", "weakly basic", "strongly acidic", "strongly basic"],
        correctOption: 2,
        explanation: "A pH of 2 indicates a strongly acidic substance."
      },
      {
        topic: "Chemical combination",
        year: "2022",
        prompt: "The chemical formula for sodium chloride is:",
        options: ["NaCl", "KCl", "NaCO3", "NaSO4"],
        correctOption: 0,
        explanation: "Sodium chloride consists of sodium and chlorine in a 1:1 ratio, so the formula is NaCl."
      },
      {
        topic: "Gas laws",
        year: "2021",
        prompt: "At constant pressure, the volume of a fixed mass of gas is directly proportional to its:",
        options: ["density", "temperature in kelvin", "pressure", "molar mass"],
        correctOption: 1,
        explanation: "Charles' law states that volume is directly proportional to absolute temperature at constant pressure."
      },
      {
        topic: "Electrolysis",
        year: "2020",
        prompt: "During electrolysis, the electrode connected to the positive terminal of the battery is the:",
        options: ["cathode", "salt bridge", "anode", "separator"],
        correctOption: 2,
        explanation: "In electrolysis, the anode is the positive electrode."
      }
    ],
    Economics: [
      {
        topic: "Demand",
        year: "2024",
        prompt: "A fall in the price of a commodity, other things being equal, will usually lead to:",
        options: ["a fall in quantity demanded", "a rise in quantity demanded", "a fall in supply", "no change in demand"],
        correctOption: 1,
        explanation: "According to the law of demand, quantity demanded rises when price falls, all else equal."
      },
      {
        topic: "Inflation",
        year: "2023",
        prompt: "Inflation refers to a sustained increase in the general:",
        options: ["quality of goods", "price level", "level of imports", "rate of production only"],
        correctOption: 1,
        explanation: "Inflation is a persistent rise in the general price level."
      },
      {
        topic: "Opportunity cost",
        year: "2022",
        prompt: "Opportunity cost is the:",
        options: [
          "money spent on a commodity",
          "next best alternative forgone",
          "profit made on a decision",
          "difference between demand and supply"
        ],
        correctOption: 1,
        explanation: "Opportunity cost is the value of the next best option given up."
      },
      {
        topic: "Money",
        year: "2021",
        prompt: "Which of the following is a function of money?",
        options: ["unit of account", "source of all wealth", "determinant of taste", "means of production only"],
        correctOption: 0,
        explanation: "Money serves as a unit of account, medium of exchange, and store of value."
      },
      {
        topic: "Production",
        year: "2020",
        prompt: "Land, labour, capital, and enterprise are referred to as:",
        options: ["goods", "factors of production", "markets", "means of exchange"],
        correctOption: 1,
        explanation: "They are the four main factors of production."
      }
    ],
    Government: [
      {
        topic: "Democracy",
        year: "2024",
        prompt: "A system of government in which the people rule directly or through elected representatives is:",
        options: ["oligarchy", "democracy", "monarchy", "autocracy"],
        correctOption: 1,
        explanation: "Democracy is rule by the people either directly or through representatives."
      },
      {
        topic: "Constitution",
        year: "2023",
        prompt: "The constitution of a state is primarily designed to:",
        options: [
          "record election slogans",
          "set out the basic laws and structure of government",
          "protect only political parties",
          "list international treaties"
        ],
        correctOption: 1,
        explanation: "A constitution contains the fundamental rules and structure of the state."
      },
      {
        topic: "Arms of government",
        year: "2022",
        prompt: "Which arm of government makes laws?",
        options: ["executive", "judiciary", "legislature", "civil service"],
        correctOption: 2,
        explanation: "The legislature is responsible for making laws."
      },
      {
        topic: "Citizenship",
        year: "2021",
        prompt: "A person who enjoys full political and civil rights in a state is a:",
        options: ["foreigner", "citizen", "refugee", "migrant"],
        correctOption: 1,
        explanation: "A citizen is legally recognized as a full member of a state."
      },
      {
        topic: "Rule of law",
        year: "2020",
        prompt: "The principle that no person is above the law is known as:",
        options: ["judicial review", "separation of powers", "rule of law", "checks and balances"],
        correctOption: 2,
        explanation: "Rule of law means everyone is subject to the law."
      }
    ]
  },
  WAEC: {
    "English Language": [
      {
        topic: "Grammar",
        year: "2024",
        prompt: "Choose the correct option: Neither the teacher nor the students ______ ready for the inspection.",
        options: ["is", "was", "are", "be"],
        correctOption: 2,
        explanation: "With 'neither...nor', the verb agrees with the subject closest to it. 'Students' takes 'are'."
      },
      {
        topic: "Vocabulary",
        year: "2023",
        prompt: "Choose the word nearest in meaning to 'diligent'.",
        options: ["careless", "hardworking", "stubborn", "playful"],
        correctOption: 1,
        explanation: "'Diligent' means hardworking or careful in one's work."
      },
      {
        topic: "Sentence interpretation",
        year: "2022",
        prompt: "If a student says, 'I have burnt the midnight oil,' it means the student has:",
        options: ["spoilt a lamp", "slept too much", "studied late into the night", "wasted electricity"],
        correctOption: 2,
        explanation: "The idiom means working or studying very late at night."
      },
      {
        topic: "Lexis and structure",
        year: "2021",
        prompt: "Choose the correct option: The news ______ surprising to everyone in the hall.",
        options: ["were", "are", "is", "have been"],
        correctOption: 2,
        explanation: "'News' takes a singular verb in standard English."
      },
      {
        topic: "Concord",
        year: "2020",
        prompt: "Choose the correct option: Each of the players ______ given a certificate after the tournament.",
        options: ["were", "have been", "was", "are"],
        correctOption: 2,
        explanation: "'Each' takes a singular verb, so 'was' is correct."
      }
    ],
    Mathematics: [
      {
        topic: "Number base",
        year: "2024",
        prompt: "Convert 1011 base two to base ten.",
        options: ["9", "10", "11", "12"],
        correctOption: 2,
        explanation: "1011 base two = 8 + 0 + 2 + 1 = 11."
      },
      {
        topic: "Mensuration",
        year: "2023",
        prompt: "The area of a rectangle of length 8 cm and width 5 cm is:",
        options: ["13 cm square", "26 cm square", "40 cm square", "80 cm square"],
        correctOption: 2,
        explanation: "Area = length x width = 8 x 5 = 40 cm square."
      },
      {
        topic: "Indices",
        year: "2022",
        prompt: "Simplify 2^3 x 2^2.",
        options: ["2^5", "4^5", "2^6", "4^6"],
        correctOption: 0,
        explanation: "When multiplying like bases, add the powers: 3 + 2 = 5."
      },
      {
        topic: "Linear equations",
        year: "2021",
        prompt: "Solve for y: 2y + 4 = 18.",
        options: ["5", "6", "7", "9"],
        correctOption: 2,
        explanation: "Subtract 4 to get 2y = 14, then divide by 2, so y = 7."
      },
      {
        topic: "Probability",
        year: "2020",
        prompt: "If a fair die is tossed once, what is the probability of getting an even number?",
        options: ["1/6", "1/3", "1/2", "2/3"],
        correctOption: 2,
        explanation: "There are 3 even outcomes out of 6 possible outcomes, so the probability is 3/6 = 1/2."
      }
    ],
    Biology: [
      {
        topic: "Nutrition",
        year: "2024",
        prompt: "Photosynthesis takes place mainly in the ______ of green plants.",
        options: ["roots", "stomata", "chloroplasts", "phloem"],
        correctOption: 2,
        explanation: "Photosynthesis occurs in chloroplasts, which contain chlorophyll."
      },
      {
        topic: "Reproduction",
        year: "2023",
        prompt: "Fusion of male and female gametes results in the formation of a:",
        options: ["zygote", "spore", "tissue", "placenta"],
        correctOption: 0,
        explanation: "The immediate product of fertilization is a zygote."
      },
      {
        topic: "Ecology",
        year: "2022",
        prompt: "The association in which two organisms benefit from living together is called:",
        options: ["parasitism", "commensalism", "competition", "mutualism"],
        correctOption: 3,
        explanation: "Mutualism is a symbiotic relationship where both organisms benefit."
      },
      {
        topic: "Classification",
        year: "2021",
        prompt: "A major characteristic of mammals is that they:",
        options: ["lay shelled eggs", "have feathers", "possess mammary glands", "breathe through gills"],
        correctOption: 2,
        explanation: "Mammals are distinguished by the presence of mammary glands."
      },
      {
        topic: "Transport system",
        year: "2020",
        prompt: "The liquid component of blood in which cells are suspended is called:",
        options: ["lymph", "plasma", "serum", "platelet"],
        correctOption: 1,
        explanation: "Blood cells are suspended in plasma."
      }
    ],
    Government: [
      {
        topic: "Political concepts",
        year: "2024",
        prompt: "Sovereignty refers to the:",
        options: [
          "ability of a government to borrow",
          "supreme power of the state",
          "right of citizens to vote only",
          "separation of powers in a state"
        ],
        correctOption: 1,
        explanation: "Sovereignty means the ultimate and supreme authority of the state."
      },
      {
        topic: "Constitution",
        year: "2023",
        prompt: "A constitution is best described as:",
        options: [
          "the daily speech of political leaders",
          "a record of party manifestoes",
          "the body of fundamental laws of a state",
          "a list of election results"
        ],
        correctOption: 2,
        explanation: "A constitution contains the fundamental rules and principles governing a state."
      },
      {
        topic: "Democracy",
        year: "2022",
        prompt: "Universal adult suffrage means:",
        options: [
          "only educated adults can vote",
          "every adult citizen has the right to vote",
          "only public servants can vote",
          "all adults must contest elections"
        ],
        correctOption: 1,
        explanation: "Universal adult suffrage gives every qualified adult citizen voting rights."
      },
      {
        topic: "Arms of government",
        year: "2021",
        prompt: "The arm of government responsible for interpreting laws is the:",
        options: ["executive", "judiciary", "legislature", "civil service"],
        correctOption: 1,
        explanation: "The judiciary interprets laws and settles disputes."
      },
      {
        topic: "Electoral systems",
        year: "2020",
        prompt: "An election in which the candidate with the highest number of votes wins is known as:",
        options: [
          "proportional representation",
          "referendum",
          "simple majority system",
          "recall election"
        ],
        correctOption: 2,
        explanation: "The simple majority system awards victory to the candidate with the highest votes."
      }
    ],
    Chemistry: [
      {
        topic: "Elements and compounds",
        year: "2024",
        prompt: "Which of the following is an element?",
        options: ["air", "water", "iron", "salt"],
        correctOption: 2,
        explanation: "Iron is an element, while the others are compounds or mixtures."
      },
      {
        topic: "Chemical change",
        year: "2023",
        prompt: "Rusting of iron is an example of:",
        options: ["physical change", "chemical change", "distillation", "sublimation"],
        correctOption: 1,
        explanation: "Rusting forms a new substance, so it is a chemical change."
      },
      {
        topic: "Acids and bases",
        year: "2022",
        prompt: "Litmus paper turns blue in a:",
        options: ["neutral solution", "basic solution", "salt crystal only", "strong acid"],
        correctOption: 1,
        explanation: "Bases turn red litmus blue."
      },
      {
        topic: "Periodic table",
        year: "2021",
        prompt: "Elements in the same group of the periodic table have the same number of:",
        options: ["protons", "electrons", "valence electrons", "neutrons"],
        correctOption: 2,
        explanation: "Group members share the same number of outer-shell electrons."
      },
      {
        topic: "Gas collection",
        year: "2020",
        prompt: "Oxygen can be collected over water because it is:",
        options: ["highly soluble in water", "slightly soluble in water", "lighter than air only", "a noble gas"],
        correctOption: 1,
        explanation: "Oxygen is only slightly soluble in water, so it can be collected over water."
      }
    ],
    Economics: [
      {
        topic: "Scarcity",
        year: "2024",
        prompt: "The basic economic problem in every society is:",
        options: ["corruption", "scarcity", "inflation only", "monopoly"],
        correctOption: 1,
        explanation: "Scarcity of resources relative to human wants is the central economic problem."
      },
      {
        topic: "Demand and supply",
        year: "2023",
        prompt: "When demand is greater than supply, price will tend to:",
        options: ["fall", "remain constant always", "rise", "disappear"],
        correctOption: 2,
        explanation: "Excess demand tends to push prices upward."
      },
      {
        topic: "Money",
        year: "2022",
        prompt: "Money used for buying and selling goods acts as a:",
        options: ["medium of exchange", "factor of production", "means of taxation", "measure of population"],
        correctOption: 0,
        explanation: "One of the main functions of money is to serve as a medium of exchange."
      },
      {
        topic: "Production",
        year: "2021",
        prompt: "The reward for labour is called:",
        options: ["interest", "rent", "wages", "profit"],
        correctOption: 2,
        explanation: "Labour is rewarded with wages."
      },
      {
        topic: "Population",
        year: "2020",
        prompt: "A rapid increase in population without a matching increase in output may lead to:",
        options: ["higher living standards automatically", "unemployment", "complete price stability", "lower demand"],
        correctOption: 1,
        explanation: "When population growth outpaces production, unemployment pressure can increase."
      }
    ],
    "Literature in English": [
      {
        topic: "Poetry",
        year: "2024",
        prompt: "A poem that praises a person, thing, or event is called an:",
        options: ["ode", "epitaph", "dirge", "satire"],
        correctOption: 0,
        explanation: "An ode is a lyric poem of praise or celebration."
      },
      {
        topic: "Drama",
        year: "2023",
        prompt: "The list of characters at the beginning of a play is called the:",
        options: ["cast", "plot", "setting", "theme"],
        correctOption: 0,
        explanation: "The cast is the list of characters in the play."
      },
      {
        topic: "Prose",
        year: "2022",
        prompt: "The person who tells the story in a novel is the:",
        options: ["narrator", "audience", "playwright", "chorus"],
        correctOption: 0,
        explanation: "The narrator is the voice that tells the story."
      },
      {
        topic: "Figures of speech",
        year: "2021",
        prompt: "The expression 'the wind whispered through the trees' is an example of:",
        options: ["hyperbole", "personification", "alliteration", "irony"],
        correctOption: 1,
        explanation: "Personification gives human qualities to a non-human thing."
      },
      {
        topic: "Tragedy",
        year: "2020",
        prompt: "A tragic flaw in a literary character is also known as:",
        options: ["conflict", "setting", "hamartia", "denouement"],
        correctOption: 2,
        explanation: "Hamartia is the tragic flaw or error that contributes to a hero's downfall."
      }
    ]
  }
}

const supplementalPracticeBank = {
  JAMB: {
    "Use of English": [
      {
        topic: "Summary",
        year: "2019",
        prompt: "In summary questions, the best sentence is usually the one that:",
        options: [
          "copies every word from the passage",
          "captures the main idea concisely",
          "adds the writer's opinion",
          "contains the longest expression"
        ],
        correctOption: 1,
        explanation: "A good summary states the main idea briefly and accurately without unnecessary detail."
      },
      {
        topic: "Synonyms",
        year: "2018",
        prompt: "Choose the option nearest in meaning to the word 'scarce'.",
        options: ["plentiful", "rare", "useful", "expensive"],
        correctOption: 1,
        explanation: "'Scarce' means rare or not easily available."
      },
      {
        topic: "Antonyms",
        year: "2017",
        prompt: "Choose the word opposite in meaning to 'hostile'.",
        options: ["friendly", "lively", "harsh", "careful"],
        correctOption: 0,
        explanation: "'Friendly' is the opposite of hostile."
      },
      {
        topic: "Punctuation",
        year: "2016",
        prompt: "Which punctuation mark is correctly used to introduce a list?",
        options: ["comma", "colon", "apostrophe", "hyphen"],
        correctOption: 1,
        explanation: "A colon is commonly used to introduce a list or explanation."
      },
      {
        topic: "Spelling",
        year: "2015",
        prompt: "Which of the following words is correctly spelt?",
        options: ["occassion", "seperate", "privilege", "embarassment"],
        correctOption: 2,
        explanation: "'Privilege' is the correctly spelt word among the options."
      }
    ],
    Mathematics: [
      {
        topic: "Simultaneous equations",
        year: "2019",
        prompt: "Solve: x + y = 9 and x - y = 3.",
        options: ["x = 6, y = 3", "x = 3, y = 6", "x = 9, y = 3", "x = 6, y = 6"],
        correctOption: 0,
        explanation: "Adding both equations gives 2x = 12, so x = 6 and y = 3."
      },
      {
        topic: "Trigonometry",
        year: "2018",
        prompt: "The value of sin 30 degrees is:",
        options: ["1", "1/2", "sqrt(3)/2", "0"],
        correctOption: 1,
        explanation: "sin 30 degrees = 1/2."
      },
      {
        topic: "Set theory",
        year: "2017",
        prompt: "If U = {1,2,3,4,5} and A = {1,3,5}, then A' is:",
        options: ["{1,3,5}", "{2,4}", "{1,2,3}", "{4,5}"],
        correctOption: 1,
        explanation: "The complement of A in U consists of the elements of U not in A, which are 2 and 4."
      },
      {
        topic: "Variation",
        year: "2016",
        prompt: "If y varies directly as x and y = 12 when x = 3, find y when x = 5.",
        options: ["15", "18", "20", "24"],
        correctOption: 2,
        explanation: "y = kx. Since 12 = 3k, k = 4. Therefore y = 4 x 5 = 20."
      },
      {
        topic: "Bearing",
        year: "2015",
        prompt: "A direction of 090 degrees is:",
        options: ["North", "South", "East", "West"],
        correctOption: 2,
        explanation: "A bearing of 090 degrees points due East."
      }
    ],
    Biology: [
      {
        topic: "Respiration",
        year: "2019",
        prompt: "The main gas released during aerobic respiration is:",
        options: ["oxygen", "nitrogen", "carbon dioxide", "hydrogen"],
        correctOption: 2,
        explanation: "Carbon dioxide is a waste product of aerobic respiration."
      },
      {
        topic: "Osmosis",
        year: "2018",
        prompt: "Osmosis is the movement of water molecules from a region of:",
        options: [
          "higher water potential to lower water potential",
          "lower pressure to higher pressure only",
          "higher solute concentration to lower solute concentration",
          "warm region to cold region"
        ],
        correctOption: 0,
        explanation: "Water moves from higher to lower water potential across a selectively permeable membrane."
      },
      {
        topic: "Excretion",
        year: "2017",
        prompt: "The organ primarily responsible for the removal of urea in humans is the:",
        options: ["liver", "kidney", "skin", "large intestine"],
        correctOption: 1,
        explanation: "The kidneys filter blood and remove urea in urine."
      },
      {
        topic: "Plant transport",
        year: "2016",
        prompt: "Water and mineral salts move through plants mainly by the:",
        options: ["phloem", "xylem", "cortex", "epidermis"],
        correctOption: 1,
        explanation: "Xylem vessels conduct water and mineral salts through plants."
      },
      {
        topic: "Evolution",
        year: "2015",
        prompt: "Variation among organisms of the same species is important because it:",
        options: [
          "prevents reproduction",
          "supports adaptation and survival",
          "eliminates inheritance",
          "stops natural selection"
        ],
        correctOption: 1,
        explanation: "Variation provides the raw material for adaptation and natural selection."
      }
    ],
    Physics: [
      {
        topic: "Light",
        year: "2019",
        prompt: "A plane mirror forms an image that is:",
        options: ["real and inverted", "virtual and upright", "real and upright", "magnified and real"],
        correctOption: 1,
        explanation: "A plane mirror produces a virtual, upright image of the same size."
      },
      {
        topic: "Simple machines",
        year: "2018",
        prompt: "The mechanical advantage of a machine is the ratio of:",
        options: ["effort to load", "load to effort", "distance moved by effort to load", "time to work done"],
        correctOption: 1,
        explanation: "Mechanical advantage equals load divided by effort."
      },
      {
        topic: "Density",
        year: "2017",
        prompt: "Density is defined as mass per unit:",
        options: ["area", "time", "temperature", "volume"],
        correctOption: 3,
        explanation: "Density = mass/volume."
      },
      {
        topic: "Pressure",
        year: "2016",
        prompt: "Pressure is measured in:",
        options: ["newton", "watt", "pascal", "joule"],
        correctOption: 2,
        explanation: "The SI unit of pressure is the pascal."
      },
      {
        topic: "Momentum",
        year: "2015",
        prompt: "Momentum is the product of mass and:",
        options: ["volume", "acceleration", "velocity", "density"],
        correctOption: 2,
        explanation: "Momentum = mass x velocity."
      }
    ],
    Chemistry: [
      {
        topic: "Organic chemistry",
        year: "2019",
        prompt: "Methane is a member of the ______ family.",
        options: ["alkanes", "alkenes", "alkynes", "alcohols"],
        correctOption: 0,
        explanation: "Methane is the simplest alkane."
      },
      {
        topic: "Separation techniques",
        year: "2018",
        prompt: "The process used to separate an insoluble solid from a liquid is:",
        options: ["distillation", "filtration", "sublimation", "fractionation"],
        correctOption: 1,
        explanation: "Filtration separates insoluble solids from liquids."
      },
      {
        topic: "Valency",
        year: "2017",
        prompt: "The valency of oxygen in most compounds is:",
        options: ["1", "2", "3", "4"],
        correctOption: 1,
        explanation: "Oxygen commonly has valency 2."
      },
      {
        topic: "Metals and non-metals",
        year: "2016",
        prompt: "Which of the following is a non-metal?",
        options: ["sodium", "calcium", "sulphur", "iron"],
        correctOption: 2,
        explanation: "Sulphur is a non-metal."
      },
      {
        topic: "Redox",
        year: "2015",
        prompt: "Oxidation can be described as the:",
        options: ["gain of oxygen", "loss of water", "gain of electrons", "removal of catalyst"],
        correctOption: 0,
        explanation: "One classical definition of oxidation is the gain of oxygen."
      }
    ],
    Economics: [
      {
        topic: "Elasticity",
        year: "2019",
        prompt: "Demand is said to be elastic when:",
        options: [
          "quantity demanded responds greatly to price change",
          "price never changes",
          "supply exceeds demand",
          "consumers stop buying completely"
        ],
        correctOption: 0,
        explanation: "Elastic demand changes significantly when price changes."
      },
      {
        topic: "Market structure",
        year: "2018",
        prompt: "A market with one seller and many buyers is called:",
        options: ["perfect competition", "monopoly", "duopoly", "monopolistic competition"],
        correctOption: 1,
        explanation: "A monopoly has a single seller dominating the market."
      },
      {
        topic: "National income",
        year: "2017",
        prompt: "National income refers broadly to the total:",
        options: [
          "money in banks only",
          "value of goods and services produced by a country",
          "exports of a country only",
          "income of government workers"
        ],
        correctOption: 1,
        explanation: "National income measures the value of output or earnings in an economy."
      },
      {
        topic: "Division of labour",
        year: "2016",
        prompt: "One major advantage of division of labour is:",
        options: ["lower specialization", "reduced efficiency", "higher productivity", "higher waste only"],
        correctOption: 2,
        explanation: "Division of labour often increases efficiency and productivity."
      },
      {
        topic: "Taxation",
        year: "2015",
        prompt: "A tax imposed directly on income is known as:",
        options: ["indirect tax", "direct tax", "import duty", "sales discount"],
        correctOption: 1,
        explanation: "Income tax is a direct tax."
      }
    ],
    Government: [
      {
        topic: "Pressure groups",
        year: "2019",
        prompt: "Pressure groups influence government mainly by:",
        options: [
          "seizing power forcefully",
          "promoting the interests of specific groups",
          "abolishing elections",
          "writing the constitution alone"
        ],
        correctOption: 1,
        explanation: "Pressure groups try to influence policy in favour of the interests they represent."
      },
      {
        topic: "Local government",
        year: "2018",
        prompt: "One key function of local government is the provision of:",
        options: ["foreign policy", "grassroots administration", "national defence", "currency regulation"],
        correctOption: 1,
        explanation: "Local governments handle administration and services at the grassroots level."
      },
      {
        topic: "Federalism",
        year: "2017",
        prompt: "A federal system of government shares powers between:",
        options: ["only local councils", "central and regional governments", "only courts and ministries", "the army and police"],
        correctOption: 1,
        explanation: "Federalism divides powers constitutionally between central and component governments."
      },
      {
        topic: "Public opinion",
        year: "2016",
        prompt: "Public opinion can be described as the:",
        options: [
          "private thoughts of judges only",
          "views commonly held by members of the public on issues",
          "belief of one political leader",
          "decision of the cabinet alone"
        ],
        correctOption: 1,
        explanation: "Public opinion refers to generally held views of the public on an issue."
      },
      {
        topic: "Political parties",
        year: "2015",
        prompt: "Political parties are formed mainly to:",
        options: [
          "organize cultural festivals only",
          "contest elections and control government",
          "replace the judiciary",
          "eliminate opposition completely"
        ],
        correctOption: 1,
        explanation: "Political parties organize to win elections and control government."
      }
    ]
  },
  WAEC: {
    "English Language": [
      {
        topic: "Speech work",
        year: "2019",
        prompt: "Choose the word with a different vowel sound.",
        options: ["seat", "beat", "sit", "heat"],
        correctOption: 2,
        explanation: "'Sit' has a different short vowel sound from the others."
      },
      {
        topic: "Comprehension",
        year: "2018",
        prompt: "The central idea of a passage is often referred to as its:",
        options: ["tone", "theme", "setting", "punctuation"],
        correctOption: 1,
        explanation: "The theme is the central idea or message of a passage."
      },
      {
        topic: "Idioms",
        year: "2017",
        prompt: "If a student is told to 'face the music', the student is being asked to:",
        options: ["sing loudly", "accept the consequences", "join the choir", "play an instrument"],
        correctOption: 1,
        explanation: "The idiom means to accept the unpleasant results of one's actions."
      },
      {
        topic: "Parts of speech",
        year: "2016",
        prompt: "In the sentence 'The boy ran quickly', the word 'quickly' is an:",
        options: ["adjective", "adverb", "noun", "preposition"],
        correctOption: 1,
        explanation: "'Quickly' modifies the verb 'ran', so it is an adverb."
      },
      {
        topic: "Concord",
        year: "2015",
        prompt: "Choose the correct option: Bread and butter ______ my favourite breakfast.",
        options: ["are", "were", "is", "have been"],
        correctOption: 2,
        explanation: "As a single dish, 'bread and butter' takes a singular verb."
      }
    ],
    Mathematics: [
      {
        topic: "Ratio",
        year: "2019",
        prompt: "If 2 mangoes cost N50, how much will 6 mangoes cost at the same rate?",
        options: ["N100", "N120", "N150", "N180"],
        correctOption: 2,
        explanation: "If 2 cost N50, then 6 cost three times as much, which is N150."
      },
      {
        topic: "Trigonometry",
        year: "2018",
        prompt: "The value of cos 60 degrees is:",
        options: ["0", "1/2", "sqrt(3)/2", "1"],
        correctOption: 1,
        explanation: "cos 60 degrees = 1/2."
      },
      {
        topic: "Set theory",
        year: "2017",
        prompt: "If A = {a,b,c} and B = {c,d,e}, then A intersection B is:",
        options: ["{a,b,c,d,e}", "{c}", "{a,b}", "{d,e}"],
        correctOption: 1,
        explanation: "The intersection contains only the common element c."
      },
      {
        topic: "Transformation",
        year: "2016",
        prompt: "A reflection flips a shape over a:",
        options: ["point", "line", "circle", "scale factor"],
        correctOption: 1,
        explanation: "A reflection is a flip over a line called the mirror line."
      },
      {
        topic: "Simple interest",
        year: "2015",
        prompt: "Find the simple interest on N1,000 at 10% per annum for 2 years.",
        options: ["N100", "N150", "N200", "N250"],
        correctOption: 2,
        explanation: "Simple interest = PRT/100 = 1000 x 10 x 2 / 100 = N200."
      }
    ],
    Biology: [
      {
        topic: "Respiration",
        year: "2019",
        prompt: "The taking in of oxygen and giving out of carbon dioxide is associated with:",
        options: ["respiration", "circulation", "reproduction", "growth"],
        correctOption: 0,
        explanation: "Gas exchange is part of respiration."
      },
      {
        topic: "Habitat",
        year: "2018",
        prompt: "The natural home of an organism is called its:",
        options: ["species", "habitat", "niche only", "kingdom"],
        correctOption: 1,
        explanation: "Habitat is the natural place where an organism lives."
      },
      {
        topic: "Sense organs",
        year: "2017",
        prompt: "The organ responsible for hearing is the:",
        options: ["eye", "nose", "ear", "tongue"],
        correctOption: 2,
        explanation: "The ear is the sense organ for hearing."
      },
      {
        topic: "Soil fertility",
        year: "2016",
        prompt: "Leguminous plants help to improve soil fertility by:",
        options: [
          "removing all soil water",
          "fixing nitrogen into the soil",
          "preventing photosynthesis",
          "destroying microorganisms"
        ],
        correctOption: 1,
        explanation: "Legumes enrich soil through nitrogen fixation."
      },
      {
        topic: "Circulation",
        year: "2015",
        prompt: "The pumping organ of the circulatory system in humans is the:",
        options: ["liver", "kidney", "heart", "lung"],
        correctOption: 2,
        explanation: "The heart pumps blood round the body."
      }
    ],
    Government: [
      {
        topic: "Rule of law",
        year: "2019",
        prompt: "Rule of law implies that:",
        options: [
          "leaders are above the law",
          "everyone is equal before the law",
          "judges make all laws",
          "elections are unnecessary"
        ],
        correctOption: 1,
        explanation: "Rule of law requires equal treatment of all persons before the law."
      },
      {
        topic: "Citizenship",
        year: "2018",
        prompt: "Citizenship by birth is acquired through:",
        options: ["business registration", "naturalization only", "being born to citizen parents or in a qualified territory", "tax payment"],
        correctOption: 2,
        explanation: "Citizenship by birth is based on birth circumstances recognized by law."
      },
      {
        topic: "Public corporation",
        year: "2017",
        prompt: "A public corporation is mainly owned by the:",
        options: ["students", "private family", "government", "trade union"],
        correctOption: 2,
        explanation: "Public corporations are established and owned mainly by government."
      },
      {
        topic: "Legislature",
        year: "2016",
        prompt: "One important function of the legislature is to:",
        options: ["interpret laws", "execute laws", "make laws", "appoint traditional rulers"],
        correctOption: 2,
        explanation: "The legislature is responsible for lawmaking."
      },
      {
        topic: "Franchise",
        year: "2015",
        prompt: "Franchise in government refers to the right to:",
        options: ["contest any examination", "vote in elections", "own land only", "collect taxes"],
        correctOption: 1,
        explanation: "Franchise means the right to vote."
      }
    ],
    Chemistry: [
      {
        topic: "Covalent bond",
        year: "2019",
        prompt: "A covalent bond is formed through the:",
        options: ["transfer of protons", "sharing of electrons", "loss of neutrons", "sharing of nuclei"],
        correctOption: 1,
        explanation: "Covalent bonding involves sharing electrons."
      },
      {
        topic: "Mixtures",
        year: "2018",
        prompt: "Air is classified as a:",
        options: ["compound", "element", "mixture", "molecule only"],
        correctOption: 2,
        explanation: "Air is a mixture of gases."
      },
      {
        topic: "Oxidation",
        year: "2017",
        prompt: "In chemistry, oxidation may involve the:",
        options: ["loss of oxygen", "gain of electrons", "loss of electrons", "addition of catalyst only"],
        correctOption: 2,
        explanation: "Oxidation can be defined as loss of electrons."
      },
      {
        topic: "Chemical symbols",
        year: "2016",
        prompt: "The chemical symbol for potassium is:",
        options: ["P", "Pt", "K", "Po"],
        correctOption: 2,
        explanation: "Potassium has the symbol K."
      },
      {
        topic: "Alkalis",
        year: "2015",
        prompt: "A common alkali used in the laboratory is:",
        options: ["hydrochloric acid", "sodium hydroxide", "sulphur", "carbon dioxide"],
        correctOption: 1,
        explanation: "Sodium hydroxide is a common alkali."
      }
    ],
    Economics: [
      {
        topic: "Scale of preference",
        year: "2019",
        prompt: "A scale of preference helps a consumer to:",
        options: ["ignore scarcity", "rank wants in order of importance", "fix market prices", "avoid budgeting"],
        correctOption: 1,
        explanation: "A scale of preference arranges wants according to importance."
      },
      {
        topic: "Budget",
        year: "2018",
        prompt: "A budget is a statement showing expected:",
        options: ["rainfall and sunshine", "income and expenditure", "imports only", "population growth"],
        correctOption: 1,
        explanation: "A budget outlines expected income and expenditure."
      },
      {
        topic: "Specialization",
        year: "2017",
        prompt: "Specialization in production often leads to:",
        options: ["lower efficiency", "higher output", "higher illiteracy", "no exchange"],
        correctOption: 1,
        explanation: "Specialization often increases output and efficiency."
      },
      {
        topic: "Trade",
        year: "2016",
        prompt: "The exchange of goods and services is known as:",
        options: ["production", "trade", "consumption", "capitalization"],
        correctOption: 1,
        explanation: "Trade involves the exchange of goods and services."
      },
      {
        topic: "Saving",
        year: "2015",
        prompt: "Saving refers to the part of income that is:",
        options: ["spent immediately", "lent only to banks", "not spent on consumption", "used only on rent"],
        correctOption: 2,
        explanation: "Savings are the portion of income left after consumption expenditure."
      }
    ],
    "Literature in English": [
      {
        topic: "Climax",
        year: "2019",
        prompt: "The point of highest tension in a plot is known as the:",
        options: ["exposition", "climax", "resolution", "prologue"],
        correctOption: 1,
        explanation: "The climax is the most intense point in the plot."
      },
      {
        topic: "Dramatic irony",
        year: "2018",
        prompt: "Dramatic irony occurs when:",
        options: [
          "the audience knows more than a character",
          "a poem has many lines",
          "a play contains a chorus only",
          "the writer uses rhyme"
        ],
        correctOption: 0,
        explanation: "Dramatic irony happens when the audience knows something a character does not."
      },
      {
        topic: "Rhyme",
        year: "2017",
        prompt: "Words ending with similar sounds in a poem illustrate:",
        options: ["rhyme", "setting", "tone", "prose"],
        correctOption: 0,
        explanation: "Rhyme occurs when words have similar end sounds."
      },
      {
        topic: "Characterization",
        year: "2016",
        prompt: "Characterization refers to the way an author:",
        options: [
          "chooses a title",
          "creates and presents characters",
          "divides chapters only",
          "prints the text"
        ],
        correctOption: 1,
        explanation: "Characterization is the method used to develop characters in a literary work."
      },
      {
        topic: "Setting",
        year: "2015",
        prompt: "Setting in literature refers to the:",
        options: ["moral lesson only", "time and place of the action", "publisher of the book", "length of the text"],
        correctOption: 1,
        explanation: "Setting describes where and when the events of a work take place."
      }
    ]
  }
}

function mergePracticeBanks(...banks) {
  const merged = {}

  for (const bank of banks) {
    for (const [examType, subjects] of Object.entries(bank || {})) {
      if (!merged[examType]) {
        merged[examType] = {}
      }

      for (const [subject, questions] of Object.entries(subjects || {})) {
        merged[examType][subject] = [...(merged[examType][subject] || []), ...questions]
      }
    }
  }

  return merged
}

const mergedPracticeBank = mergePracticeBanks(practiceBank, supplementalPracticeBank, expansionPracticeBank)

const seededPracticeQuestions = Object.entries(mergedPracticeBank).flatMap(([examType, subjects]) =>
  Object.entries(subjects).flatMap(([subject, questions]) =>
    questions.map((question) => ({
      examType,
      subject,
      topic: question.topic,
      year: question.year,
      prompt: question.prompt,
      options: question.options,
      correctOption: question.correctOption,
      explanation: question.explanation
    }))
  )
)

module.exports = { seededPracticeQuestions }
