const expansionPracticeBank = {
  JAMB: {
    "Use of English": [
      {
        topic: "Antonyms",
        year: "2014",
        prompt: "Choose the option opposite in meaning to 'scarce'.",
        options: ["plentiful", "useful", "careful", "distant"],
        correctOption: 0,
        explanation: "'Scarce' means limited in supply, so the opposite is 'plentiful'."
      },
      {
        topic: "Lexis and structure",
        year: "2013",
        prompt: "Choose the option that best completes the sentence: The chairman insisted ______ seeing the receipts before approving the payment.",
        options: ["on", "at", "for", "with"],
        correctOption: 0,
        explanation: "The correct expression is 'insisted on seeing'."
      },
      {
        topic: "Concord",
        year: "2012",
        prompt: "Choose the correct option: One of the girls ______ awarded the scholarship last week.",
        options: ["were", "have been", "was", "are"],
        correctOption: 2,
        explanation: "The subject is 'one', so the singular verb 'was' is correct."
      },
      {
        topic: "Oral English",
        year: "2011",
        prompt: "Which word ends with a different consonant sound?",
        options: ["laugh", "cough", "rough", "bough"],
        correctOption: 3,
        explanation: "'Bough' ends with the /au/ sound, unlike the /f/ ending in the others."
      },
      {
        topic: "Comprehension",
        year: "2010",
        prompt: "A writer's tone can best be described as the writer's:",
        options: ["sentence length", "attitude to the subject", "choice of title only", "punctuation style"],
        correctOption: 1,
        explanation: "Tone reflects the writer's attitude toward the topic or audience."
      }
    ],
    Mathematics: [
      {
        topic: "Simultaneous equations",
        year: "2014",
        prompt: "Solve the equations x + y = 9 and x - y = 3.",
        options: ["x = 3, y = 6", "x = 6, y = 3", "x = 9, y = 3", "x = 12, y = -3"],
        correctOption: 1,
        explanation: "Add the equations to get 2x = 12, so x = 6 and y = 3."
      },
      {
        topic: "Trigonometry",
        year: "2013",
        prompt: "Find the value of sin 30 degrees.",
        options: ["0", "1/2", "sqrt(3)/2", "1"],
        correctOption: 1,
        explanation: "sin 30 degrees equals 1/2."
      },
      {
        topic: "Variation",
        year: "2012",
        prompt: "If y varies directly as x and y = 18 when x = 6, find y when x = 10.",
        options: ["24", "28", "30", "36"],
        correctOption: 2,
        explanation: "y = kx, so k = 18/6 = 3 and y = 3 x 10 = 30."
      },
      {
        topic: "Bearing",
        year: "2011",
        prompt: "A bearing of 090 degrees means due:",
        options: ["north", "south", "east", "west"],
        correctOption: 2,
        explanation: "A bearing of 090 degrees points due east."
      },
      {
        topic: "Sequence and series",
        year: "2010",
        prompt: "Find the next term in the sequence 2, 5, 8, 11, ...",
        options: ["12", "13", "14", "15"],
        correctOption: 2,
        explanation: "The sequence increases by 3, so the next term is 14."
      }
    ],
    Biology: [
      {
        topic: "Excretion",
        year: "2014",
        prompt: "The organ mainly responsible for removing urea from human blood is the:",
        options: ["heart", "kidney", "liver", "lung"],
        correctOption: 1,
        explanation: "The kidney filters blood and removes urea in urine."
      },
      {
        topic: "Ecology",
        year: "2013",
        prompt: "In a food chain, grass is usually classified as a:",
        options: ["consumer", "decomposer", "producer", "parasite"],
        correctOption: 2,
        explanation: "Grass produces its own food through photosynthesis, so it is a producer."
      },
      {
        topic: "Evolution",
        year: "2012",
        prompt: "A major idea in evolution is that organisms survive best when they are:",
        options: ["largest", "best adapted", "most colorful", "most numerous at birth"],
        correctOption: 1,
        explanation: "Natural selection favors organisms better adapted to their environment."
      },
      {
        topic: "Reproduction",
        year: "2011",
        prompt: "Pollination in flowering plants refers to the transfer of pollen grains from the anther to the:",
        options: ["ovary", "stigma", "sepal", "ovule"],
        correctOption: 1,
        explanation: "Pollination is the transfer of pollen grains to the stigma."
      },
      {
        topic: "Transport system",
        year: "2010",
        prompt: "Water is conducted in plants mainly through the:",
        options: ["phloem", "xylem", "cortex", "epidermis"],
        correctOption: 1,
        explanation: "Xylem transports water and mineral salts in plants."
      }
    ],
    Physics: [
      {
        topic: "Vectors",
        year: "2014",
        prompt: "Which of the following is a vector quantity?",
        options: ["speed", "distance", "mass", "velocity"],
        correctOption: 3,
        explanation: "Velocity has both magnitude and direction, so it is a vector."
      },
      {
        topic: "Sound",
        year: "2013",
        prompt: "Sound cannot travel through:",
        options: ["water", "air", "vacuum", "steel"],
        correctOption: 2,
        explanation: "Sound needs a material medium and cannot travel through a vacuum."
      },
      {
        topic: "Current electricity",
        year: "2012",
        prompt: "The unit of electrical resistance is the:",
        options: ["ampere", "volt", "ohm", "watt"],
        correctOption: 2,
        explanation: "Electrical resistance is measured in ohms."
      },
      {
        topic: "Optics",
        year: "2011",
        prompt: "The image formed by a plane mirror is always:",
        options: ["real and inverted", "virtual and upright", "magnified only", "smaller and real"],
        correctOption: 1,
        explanation: "A plane mirror forms a virtual, upright image of the same size."
      },
      {
        topic: "Radioactivity",
        year: "2010",
        prompt: "Alpha particles carry a:",
        options: ["negative charge", "positive charge", "neutral charge", "variable charge"],
        correctOption: 1,
        explanation: "Alpha particles are positively charged."
      }
    ],
    Chemistry: [
      {
        topic: "Periodic table",
        year: "2014",
        prompt: "Elements in the same group of the periodic table have the same number of:",
        options: ["neutrons", "electron shells", "valence electrons", "isotopes"],
        correctOption: 2,
        explanation: "Group members have the same number of electrons in their outermost shell."
      },
      {
        topic: "Mole concept",
        year: "2013",
        prompt: "The relative molecular mass of H2O is:",
        options: ["16", "17", "18", "20"],
        correctOption: 2,
        explanation: "H2O has 2 hydrogen atoms and 1 oxygen atom, so 2(1) + 16 = 18."
      },
      {
        topic: "Solubility",
        year: "2012",
        prompt: "A solution that cannot dissolve any more solute at a given temperature is said to be:",
        options: ["dilute", "saturated", "basic", "volatile"],
        correctOption: 1,
        explanation: "A saturated solution contains the maximum amount of dissolved solute at that temperature."
      },
      {
        topic: "Hydrocarbons",
        year: "2011",
        prompt: "Ethene belongs to the family of:",
        options: ["alkanes", "alkenes", "alkynes", "alkanols"],
        correctOption: 1,
        explanation: "Ethene contains a carbon-carbon double bond, so it is an alkene."
      },
      {
        topic: "Rate of reaction",
        year: "2010",
        prompt: "One factor that increases the rate of a chemical reaction is:",
        options: ["reducing temperature", "using larger lumps of reactant", "adding a catalyst", "removing the reactants"],
        correctOption: 2,
        explanation: "Catalysts increase reaction rate without being used up."
      }
    ],
    Economics: [
      {
        topic: "Scarcity",
        year: "2014",
        prompt: "Scarcity in economics means that resources are:",
        options: ["unlimited", "limited relative to wants", "available only in rural areas", "owned by government only"],
        correctOption: 1,
        explanation: "Scarcity arises because human wants are many but resources are limited."
      },
      {
        topic: "Utility",
        year: "2013",
        prompt: "In economics, utility refers to the:",
        options: ["price of a commodity", "satisfaction derived from consumption", "amount of money in circulation", "cost of production"],
        correctOption: 1,
        explanation: "Utility is the satisfaction a consumer gets from using goods or services."
      },
      {
        topic: "Price mechanism",
        year: "2012",
        prompt: "Equilibrium price is determined at the point where:",
        options: ["supply exceeds demand", "demand equals supply", "price is highest", "government fixes the price"],
        correctOption: 1,
        explanation: "Market equilibrium occurs where quantity demanded equals quantity supplied."
      },
      {
        topic: "Balance of payments",
        year: "2011",
        prompt: "Balance of payments records a country's transactions with the:",
        options: ["central bank only", "rest of the world", "local governments only", "manufacturing sector only"],
        correctOption: 1,
        explanation: "The balance of payments summarizes transactions between a country and other countries."
      },
      {
        topic: "Population",
        year: "2010",
        prompt: "A rapidly growing population may lead to:",
        options: ["lower pressure on social services", "higher unemployment", "fewer consumers", "automatic capital growth"],
        correctOption: 1,
        explanation: "Fast population growth can increase unemployment if job creation lags behind."
      }
    ],
    Government: [
      {
        topic: "Parliamentary system",
        year: "2014",
        prompt: "In a parliamentary system, the head of government is usually the:",
        options: ["chief justice", "prime minister", "speaker", "president of the senate"],
        correctOption: 1,
        explanation: "The prime minister is typically the head of government in a parliamentary system."
      },
      {
        topic: "Delegated legislation",
        year: "2013",
        prompt: "Delegated legislation refers to laws made by:",
        options: ["traditional rulers only", "subordinate authorities under powers given by parliament", "voters during elections", "political parties alone"],
        correctOption: 1,
        explanation: "Delegated legislation is made by bodies authorized by the legislature."
      },
      {
        topic: "Human rights",
        year: "2012",
        prompt: "The right to express opinions freely is known as freedom of:",
        options: ["movement", "association", "expression", "occupation"],
        correctOption: 2,
        explanation: "Freedom of expression protects the right to state opinions lawfully."
      },
      {
        topic: "International organizations",
        year: "2011",
        prompt: "ECOWAS was created mainly to promote cooperation among countries in:",
        options: ["East Africa", "North Africa", "West Africa", "Southern Africa"],
        correctOption: 2,
        explanation: "ECOWAS is the Economic Community of West African States."
      },
      {
        topic: "Public administration",
        year: "2010",
        prompt: "The civil service is primarily responsible for:",
        options: ["conducting political rallies", "implementing government policies", "overthrowing governments", "interpreting the constitution"],
        correctOption: 1,
        explanation: "The civil service helps implement and administer government policies."
      }
    ]
  },
  WAEC: {
    "English Language": [
      {
        topic: "Sentence interpretation",
        year: "2014",
        prompt: "If a student says, 'I am at sea,' the student means that he or she is:",
        options: ["traveling by ship", "confused", "feeling cold", "on holiday"],
        correctOption: 1,
        explanation: "The expression 'at sea' means confused or uncertain."
      },
      {
        topic: "Register",
        year: "2013",
        prompt: "Which of the following belongs to the register of law?",
        options: ["invoice", "verdict", "enzyme", "chorus"],
        correctOption: 1,
        explanation: "'Verdict' is a term commonly used in legal contexts."
      },
      {
        topic: "Vocabulary",
        year: "2012",
        prompt: "Choose the word nearest in meaning to 'brief'.",
        options: ["short", "bitter", "sharp", "sudden"],
        correctOption: 0,
        explanation: "'Brief' means short in duration or length."
      },
      {
        topic: "Oral English",
        year: "2011",
        prompt: "Choose the word with a different stress pattern.",
        options: ["father", "doctor", "hotel", "teacher"],
        correctOption: 2,
        explanation: "'Hotel' is stressed on the second syllable, unlike the others."
      },
      {
        topic: "Grammar",
        year: "2010",
        prompt: "Choose the correct option: If I ______ enough money, I would buy a new laptop.",
        options: ["have", "had", "has", "am having"],
        correctOption: 1,
        explanation: "The sentence expresses an unreal present condition, so 'had' is correct."
      }
    ],
    Mathematics: [
      {
        topic: "Statistics",
        year: "2014",
        prompt: "Find the median of 4, 6, 7, 9, and 12.",
        options: ["6", "7", "8", "9"],
        correctOption: 1,
        explanation: "The numbers are already arranged, so the middle value is 7."
      },
      {
        topic: "Bearing",
        year: "2013",
        prompt: "A bearing of 180 degrees points due:",
        options: ["north", "south", "east", "west"],
        correctOption: 1,
        explanation: "A full bearing of 180 degrees points due south."
      },
      {
        topic: "Inequalities",
        year: "2012",
        prompt: "Solve the inequality 2x + 3 > 11.",
        options: ["x > 3", "x < 3", "x > 4", "x < 4"],
        correctOption: 2,
        explanation: "2x > 8, so x > 4."
      },
      {
        topic: "Mensuration",
        year: "2011",
        prompt: "Find the surface area of a cube of edge 3 cm.",
        options: ["9 cm square", "18 cm square", "27 cm square", "54 cm square"],
        correctOption: 3,
        explanation: "Surface area of a cube is 6a^2 = 6 x 9 = 54 cm square."
      },
      {
        topic: "Number line",
        year: "2010",
        prompt: "Which of the following is less than -2?",
        options: ["-1", "0", "-3", "2"],
        correctOption: 2,
        explanation: "-3 lies to the left of -2 on the number line, so it is less."
      }
    ],
    Biology: [
      {
        topic: "Tissues",
        year: "2014",
        prompt: "A group of similar cells performing the same function is called a:",
        options: ["system", "tissue", "species", "pigment"],
        correctOption: 1,
        explanation: "A tissue is a group of similar cells carrying out a common function."
      },
      {
        topic: "Digestive system",
        year: "2013",
        prompt: "The enzyme in saliva that acts on starch is:",
        options: ["pepsin", "lipase", "amylase", "trypsin"],
        correctOption: 2,
        explanation: "Salivary amylase begins the digestion of starch in the mouth."
      },
      {
        topic: "Ecology",
        year: "2012",
        prompt: "The gradual replacement of one plant community by another is known as:",
        options: ["germination", "succession", "transpiration", "pollination"],
        correctOption: 1,
        explanation: "Ecological succession is the gradual change in community composition over time."
      },
      {
        topic: "Genetics",
        year: "2011",
        prompt: "In humans, the chromosome combination XX produces a:",
        options: ["male child", "female child", "clone", "mutant only"],
        correctOption: 1,
        explanation: "In humans, XX is the female sex chromosome combination."
      },
      {
        topic: "Pollution",
        year: "2010",
        prompt: "Oil spillage is most directly harmful because it:",
        options: ["improves soil texture", "reduces water pollution", "damages aquatic habitats", "increases oxygen supply"],
        correctOption: 2,
        explanation: "Oil spillage contaminates water and harms aquatic organisms and habitats."
      }
    ],
    Government: [
      {
        topic: "Pressure groups",
        year: "2014",
        prompt: "Pressure groups differ from political parties because they mainly seek to:",
        options: ["win elections and form government", "influence policy without necessarily taking power", "abolish constitutions", "appoint judges directly"],
        correctOption: 1,
        explanation: "Pressure groups aim to influence government decisions rather than capture political power."
      },
      {
        topic: "Separation of powers",
        year: "2013",
        prompt: "Separation of powers helps to prevent:",
        options: ["citizenship", "concentration of power in one arm", "elections", "representation"],
        correctOption: 1,
        explanation: "Separating powers reduces the risk of excessive power in one institution."
      },
      {
        topic: "Public opinion",
        year: "2012",
        prompt: "One major agent for shaping public opinion is the:",
        options: ["media", "weather", "soil", "currency"],
        correctOption: 0,
        explanation: "The media strongly influences how people receive and interpret public issues."
      },
      {
        topic: "Military rule",
        year: "2011",
        prompt: "One feature commonly associated with military rule is:",
        options: ["party competition", "suspension of some constitutional processes", "regular parliamentary debates", "independent electoral campaigns"],
        correctOption: 1,
        explanation: "Military regimes often suspend parts of the constitution and democratic processes."
      },
      {
        topic: "Legislature",
        year: "2010",
        prompt: "Quorum in a legislative house refers to the minimum number of members required to:",
        options: ["conduct business legally", "form a political party", "declare a state of emergency", "appoint ministers"],
        correctOption: 0,
        explanation: "Quorum is the minimum attendance needed for valid legislative proceedings."
      }
    ],
    Chemistry: [
      {
        topic: "Periodic table",
        year: "2014",
        prompt: "Sodium belongs to group 1 of the periodic table and is classified as a:",
        options: ["halogen", "transition metal", "noble gas", "alkali metal"],
        correctOption: 3,
        explanation: "Group 1 elements like sodium are alkali metals."
      },
      {
        topic: "Indicators",
        year: "2013",
        prompt: "Litmus paper turns red in a:",
        options: ["base", "neutral salt", "acid", "metal oxide"],
        correctOption: 2,
        explanation: "Acids turn blue litmus red."
      },
      {
        topic: "Electrolysis",
        year: "2012",
        prompt: "In electrolysis, reduction takes place at the:",
        options: ["anode", "cathode", "salt bridge", "electrolyte only"],
        correctOption: 1,
        explanation: "Reduction occurs at the cathode during electrolysis."
      },
      {
        topic: "Water",
        year: "2011",
        prompt: "Temporary hardness of water can be removed by:",
        options: ["filtration only", "boiling", "cooling", "adding sand"],
        correctOption: 1,
        explanation: "Boiling removes temporary hardness caused by bicarbonates."
      },
      {
        topic: "Stoichiometry",
        year: "2010",
        prompt: "The law of conservation of mass states that matter can neither be created nor:",
        options: ["heated", "dissolved", "destroyed", "combined"],
        correctOption: 2,
        explanation: "Matter is neither created nor destroyed in a chemical reaction."
      }
    ],
    Economics: [
      {
        topic: "Opportunity cost",
        year: "2014",
        prompt: "Opportunity cost is best described as the:",
        options: ["price paid for all goods", "next best alternative forgone", "cash left after spending", "benefit of government policy"],
        correctOption: 1,
        explanation: "Opportunity cost is the value of the next best option given up."
      },
      {
        topic: "Demand",
        year: "2013",
        prompt: "A demand schedule shows the relationship between quantity demanded and:",
        options: ["temperature", "population only", "price", "advertising style only"],
        correctOption: 2,
        explanation: "A demand schedule records quantities consumers will buy at different prices."
      },
      {
        topic: "Inflation",
        year: "2012",
        prompt: "One effect of inflation is that it may reduce the purchasing power of:",
        options: ["money", "roads", "schools", "markets"],
        correctOption: 0,
        explanation: "When prices rise, each unit of money buys fewer goods and services."
      },
      {
        topic: "Cooperative societies",
        year: "2011",
        prompt: "A cooperative society is formed mainly to:",
        options: ["maximize personal rivalry", "promote the common interest of members", "replace all banks", "collect taxes for government"],
        correctOption: 1,
        explanation: "Cooperative societies are organized to advance the welfare of their members."
      },
      {
        topic: "Money",
        year: "2010",
        prompt: "Which of the following is not a function of money?",
        options: ["store of value", "medium of exchange", "unit of account", "cause of all production"],
        correctOption: 3,
        explanation: "Money performs exchange and measurement functions, but it is not the cause of all production."
      }
    ],
    "Literature in English": [
      {
        topic: "Character",
        year: "2014",
        prompt: "The central character in a literary work is often called the:",
        options: ["narrator", "protagonist", "chorus", "editor"],
        correctOption: 1,
        explanation: "The protagonist is the main character in a story or play."
      },
      {
        topic: "Figures of speech",
        year: "2013",
        prompt: "A play on words for humorous or rhetorical effect is called a:",
        options: ["pun", "stanza", "flashback", "scene"],
        correctOption: 0,
        explanation: "A pun is a humorous or meaningful play on words."
      },
      {
        topic: "Drama",
        year: "2012",
        prompt: "An aside in drama is a speech meant to be heard by:",
        options: ["the audience, not the other characters", "all characters on stage", "the playwright only", "the chorus alone"],
        correctOption: 0,
        explanation: "An aside is directed to the audience while other characters are treated as not hearing it."
      },
      {
        topic: "Theme",
        year: "2011",
        prompt: "The main idea explored in a literary work is its:",
        options: ["theme", "publisher", "preface", "dialogue tag"],
        correctOption: 0,
        explanation: "Theme is the central idea or message in a literary text."
      },
      {
        topic: "Satire",
        year: "2010",
        prompt: "Satire is a literary device used mainly to:",
        options: ["praise blindly", "ridicule vice or folly", "list characters only", "announce a title page"],
        correctOption: 1,
        explanation: "Satire uses humor or ridicule to criticize human weakness or social problems."
      }
    ]
  }
}

module.exports = { expansionPracticeBank }
