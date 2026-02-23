const questions = [
  {
    id: 1,
    emojis: "🌊🚶‍♂️✝️",
    options: ["Peter", "Moses", "Paul", "Noah"],
    correctAnswerIndex: 0
  },
  {
    id: 2,
    emojis: "🐳🙏🌊",
    options: ["David", "Jonah", "Job", "Elijah"],
    correctAnswerIndex: 1
  },
  {
    id: 3,
    emojis: "🪨📜🔥",
    options: ["Moses", "Isaiah", "Abraham", "Samuel"],
    correctAnswerIndex: 0
  },
  {
    id: 4,
    emojis: "👑🎵🪨",
    options: ["Solomon", "Saul", "David", "Joseph"],
    correctAnswerIndex: 2
  },
  {
    id: 5,
    emojis: "🐍🍎🌳",
    options: ["Adam", "Eve", "Cain", "Satan"],
    correctAnswerIndex: 1
  },
  {
    id: 6,
    emojis: "🦁🕳️🙏",
    options: ["Samson", "Daniel", "David", "Joshua"],
    correctAnswerIndex: 1
  },
  {
    id: 7,
    emojis: "🌈🚢🌧️",
    options: ["Moses", "Noah", "Abraham", "Lot"],
    correctAnswerIndex: 1
  },
  {
    id: 8,
    emojis: "🔥🌳👂",
    options: ["Elijah", "Moses", "Isaiah", "Jeremiah"],
    correctAnswerIndex: 1
  },
  {
    id: 9,
    emojis: "💪🦁🏛️",
    options: ["David", "Samson", "Gideon", "Saul"],
    correctAnswerIndex: 1
  },
  {
    id: 10,
    emojis: "👶🌊👑",
    options: ["Samuel", "Moses", "David", "Joseph"],
    correctAnswerIndex: 1
  },
  {
    id: 11,
    emojis: "👑💰🧠",
    options: ["Solomon", "Saul", "David", "Hezekiah"],
    correctAnswerIndex: 0
  },
  {
    id: 12,
    emojis: "🌾⭐👴",
    options: ["Isaac", "Abraham", "Jacob", "Job"],
    correctAnswerIndex: 1
  },
  {
    id: 13,
    emojis: "👨‍👦🐏⛰️",
    options: ["Jacob", "Abraham", "Isaac", "Aaron"],
    correctAnswerIndex: 1
  },
  {
    id: 14,
    emojis: "👕🩸🐐",
    options: ["Joseph", "David", "Samuel", "Reuben"],
    correctAnswerIndex: 0
  },
  {
    id: 15,
    emojis: "👑👶⭐",
    options: ["Jesus", "David", "Solomon", "John"],
    correctAnswerIndex: 0
  },
  {
    id: 16,
    emojis: "✝️🌅🪨",
    options: ["Peter", "Paul", "Jesus", "Thomas"],
    correctAnswerIndex: 2
  },
  {
    id: 17,
    emojis: "💰✝️📜",
    options: ["Matthew", "Mark", "Luke", "John"],
    correctAnswerIndex: 0
  },
  {
    id: 18,
    emojis: "🕊️🌊👂",
    options: ["John the Baptist", "Peter", "Paul", "Philip"],
    correctAnswerIndex: 0
  },
  {
    id: 19,
    emojis: "👑🗡️🏃",
    options: ["Saul", "David", "Solomon", "Absalom"],
    correctAnswerIndex: 1
  },
  {
    id: 20,
    emojis: "🌊🪵🚶",
    options: ["Joshua", "Peter", "Moses", "Elijah"],
    correctAnswerIndex: 2
  },
  {
    id: 21,
    emojis: "🧂👀🏃",
    options: ["Ruth", "Lot's Wife", "Esther", "Miriam"],
    correctAnswerIndex: 1
  },
  {
    id: 22,
    emojis: "👑👸📜",
    options: ["Esther", "Ruth", "Mary", "Deborah"],
    correctAnswerIndex: 0
  },
  {
    id: 23,
    emojis: "🌾💍👩",
    options: ["Ruth", "Naomi", "Sarah", "Rebecca"],
    correctAnswerIndex: 0
  },
  {
    id: 24,
    emojis: "📯🧱🏰",
    options: ["David", "Joshua", "Solomon", "Nehemiah"],
    correctAnswerIndex: 1
  },
  {
    id: 25,
    emojis: "🐑🎵👑",
    options: ["David", "Solomon", "Saul", "Samuel"],
    correctAnswerIndex: 0
  },
  {
    id: 26,
    emojis: "⚓🌊📖",
    options: ["Paul", "Peter", "Jonah", "Mark"],
    correctAnswerIndex: 0
  },
  {
    id: 27,
    emojis: "🐴💡📖",
    options: ["Paul", "Peter", "Stephen", "Timothy"],
    correctAnswerIndex: 0
  },
  {
    id: 28,
    emojis: "🪓🌲📜",
    options: ["Elisha", "Elijah", "Isaiah", "Jeremiah"],
    correctAnswerIndex: 0
  },
  {
    id: 29,
    emojis: "💀🦴🌬️",
    options: ["Isaiah", "Ezekiel", "Jeremiah", "Daniel"],
    correctAnswerIndex: 1
  },
  {
    id: 30,
    emojis: "👑🔥🛐",
    options: ["Nebuchadnezzar", "Saul", "Herod", "Pilate"],
    correctAnswerIndex: 0
  },
  {
    id: 31,
    emojis: "🧑‍🍼🌟🎶",
    options: ["Mary", "Martha", "Elizabeth", "Anna"],
    correctAnswerIndex: 0
  },
  {
    id: 32,
    emojis: "✝️🪙💔",
    options: ["Peter", "Judas", "Thomas", "James"],
    correctAnswerIndex: 1
  },
  {
    id: 33,
    emojis: "🧔🪓🌊",
    options: ["John the Baptist", "Peter", "Paul", "Andrew"],
    correctAnswerIndex: 0
  },
  {
    id: 34,
    emojis: "👑🏗️🏛️",
    options: ["Solomon", "David", "Herod", "Nehemiah"],
    correctAnswerIndex: 0
  },
  {
    id: 35,
    emojis: "🧑‍🌾🔥📜",
    options: ["Jeremiah", "Isaiah", "Amos", "Hosea"],
    correctAnswerIndex: 2
  },
  {
    id: 36,
    emojis: "🛡️🗡️🧒",
    options: ["David", "Joshua", "Samuel", "Gideon"],
    correctAnswerIndex: 0
  },
  {
    id: 37,
    emojis: "📖🌊🏝️",
    options: ["John", "Paul", "Peter", "Mark"],
    correctAnswerIndex: 0
  },
  {
    id: 38,
    emojis: "👑🐫🌊",
    options: ["Pharaoh", "Saul", "Herod", "Pilate"],
    correctAnswerIndex: 0
  },
  {
    id: 39,
    emojis: "🍞🐟👥",
    options: ["Jesus", "Peter", "John", "Andrew"],
    correctAnswerIndex: 0
  },
  {
    id: 40,
    emojis: "👑🛏️⚔️",
    options: ["Saul", "David", "Solomon", "Ahab"],
    correctAnswerIndex: 1
  },
  {
    id: 41,
    emojis: "👶🙏🎁",
    options: ["Samuel", "Isaac", "John", "Joseph"],
    correctAnswerIndex: 0
  },
  {
    id: 42,
    emojis: "👑👩⚖️",
    options: ["Deborah", "Esther", "Ruth", "Miriam"],
    correctAnswerIndex: 0
  },
  {
    id: 43,
    emojis: "🐫⭐👑",
    options: ["Wise Men", "Shepherds", "Disciples", "Prophets"],
    correctAnswerIndex: 0
  },
  {
    id: 44,
    emojis: "✝️🪦🌅",
    options: ["Jesus", "Peter", "Paul", "Thomas"],
    correctAnswerIndex: 0
  },
  {
    id: 45,
    emojis: "🧔📜👀",
    options: ["Isaiah", "Ezekiel", "Jeremiah", "Hosea"],
    correctAnswerIndex: 0
  },
  {
    id: 46,
    emojis: "👑👶⚔️",
    options: ["Herod", "Saul", "Pharaoh", "Ahab"],
    correctAnswerIndex: 0
  },
  {
    id: 47,
    emojis: "🌊🐴🔥",
    options: ["Elijah", "Elisha", "Moses", "Joshua"],
    correctAnswerIndex: 0
  },
  {
    id: 48,
    emojis: "💰🧾✝️",
    options: ["Matthew", "Zacchaeus", "Luke", "Mark"],
    correctAnswerIndex: 1
  },
  {
    id: 49,
    emojis: "🌊🏺🍷",
    options: ["Jesus", "Peter", "Paul", "John"],
    correctAnswerIndex: 0
  },
  {
    id: 50,
    emojis: "🕊️🔥👥",
    options: ["Peter", "Paul", "Pentecost", "John"],
    correctAnswerIndex: 2
  }
];

module.exports = questions;