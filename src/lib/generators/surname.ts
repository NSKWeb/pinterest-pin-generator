export function generateSurnames(category: string): string[] {
  const lowerCategory = category.toLowerCase();

  const surnameDatabases: { [key: string]: string[] } = {
    english: [
      "Anderson", "Bailey", "Baker", "Bennett", "Brooks", "Brown", "Butler", "Campbell",
      "Carter", "Clark", "Coleman", "Collins", "Cook", "Cooper", "Cox", "Davis",
      "Edwards", "Ellis", "Evans", "Fisher", "Foster", "Garcia", "Gibson", "Gray",
      "Green", "Hall", "Hamilton", "Harris", "Harrison", "Hayes", "Hill", "Holmes",
      "Howard", "Hughes", "Hunt", "Jackson", "James", "Jenkins", "Johnson", "Jones",
      "Kelly", "Kennedy", "King", "Knight", "Lee", "Lewis", "Long", "Martin",
      "Mason", "Matthews", "Miller", "Mitchell", "Moore", "Morgan", "Morris", "Murphy",
      "Nelson", "Parker", "Patterson", "Perry", "Phillips", "Powell", "Price", "Reed",
      "Reynolds", "Richardson", "Roberts", "Robinson", "Rogers", "Ross", "Russell", "Sanders",
      "Scott", "Shaw", "Simmons", "Smith", "Spencer", "Stevens", "Stewart", "Taylor",
      "Thomas", "Thompson", "Turner", "Walker", "Wallace", "Ward", "Warren", "Watson",
      "White", "Williams", "Wilson", "Wood", "Wright", "Young"
    ],
    fantasy: [
      "Ashford", "Blackwood", "Brightwater", "Coldwell", "Dragonheart", "Elmsworth",
      "Fairchild", "Goldmantle", "Hollowbrook", "Ironforge", "Jadefire", "Knightfall",
      "Leafwhisper", "Moonshadow", "Nightbane", "Oakshield", "Phoenixborn", "Quicksilver",
      "Ravenwood", "Shadowmere", "Thornwood", "Underhill", "Valdris", "Winterborne",
      "Aldor", "Bronzewood", "Crystalborn", "Darkstar", "Everbright", "Firebrand",
      "Grimward", "Hearthstone", "Illumin", "Jadeblood", "Keepfall", "Lightbringer",
      "Mistral", "Nighthaven", "Oakenshield", "Pyreheart", "Quarrystone", "Runeblade",
      "Stargazer", "Thunderstrike", "Undervale", "Verdant", "Windrunner", "Xanthis",
      "Yonderbrook", "Zenith", "Aurelius", "Blackthorn", "Crowsworn", "Dawnstrike"
    ],
    japanese: [
      "Tanaka", "Suzuki", "Takahashi", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi",
      "Sato", "Kimura", "Hayashi", "Shimizu", "Yamaguchi", "Saito", "Mori", "Fujita",
      "Sakamoto", "Kato", "Miyamoto", "Inoue", "Matsumoto", "Kudo", "Hattori", "Fukuda",
      "Ishikawa", "Okada", "Nakajima", "Maeda", "Fujii", "Ogawa", "Abe", "Goto",
      "Hasegawa", "Murakami", "Kondo", "Ishii", "Sasaki", "Yamada", "Yoshida", "Yamashita",
      "Endo", "Fukushima", "Ota", "Miura", "Otsuka", "Sakurai", "Nakano", "Harada",
      "Ono", "Tamura", "Mochizuki", "Nakagawa", "Aoki", "Chiba", "Kubota", "Arai"
    ],
    scandinavian: [
      "Andersen", "Berg", "Bjorn", "Dahl", "Erikson", "Gustafsson", "Hansen", "Johansson",
      "Knudsen", "Larsen", "Magnusson", "Nielsen", "Olsen", "Peterson", "Quist", "Rasmussen",
      "Sorenson", "Thorsen", "Ulf", "Vestergaard", "Wikstrom", "Axelsson", "Bengtsson",
      "Christensen", "Dyrstad", "Falk", "Gronberg", "Haugen", "Isaksson", "Jensen",
      "Kjellberg", "Lindberg", "Madsen", "Nordberg", "Olofsson", "Persson", "Quarnstrom",
      "Roth", "Strand", "Thorvald", "Ullman", "Voss", "Wahlenberg", "Yngvar", "Zetterberg"
    ],
    celtic: [
      "Brennan", "Callahan", "Doyle", "Fitzgerald", "Gallagher", "Harrigan", "Killian", "Lennon",
      "MacCarthy", "Neill", "O'Brien", "Quinn", "Reilly", "Sullivan", "Tanner", "Ulster",
      "Brady", "Collins", "Donovan", "Finnegan", "Griffin", "Hogan", "Kearney", "McGovern",
      "Nolan", "Powers", "Reagan", "Shea", "Troy", "Vaughn", "Weldon", "Yates",
      "Brogan", "Cunniff", "Devlin", "Egan", "Fay", "Gleason", "Hennessy", "Kinsella",
      "MacBride", "Nugent", "O'Connor", "Prendergast", "Rourke", "Sweeney", "Tiernan", "Walsh"
    ]
  };

  const surnames = surnameDatabases[lowerCategory] || surnameDatabases.english;

  // Shuffle and return 10 random surnames
  const shuffled = [...surnames].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}
