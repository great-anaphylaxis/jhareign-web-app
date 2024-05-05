import { loadProject, listProgrammingLanguage, loadSceneModel, loadRocketModel, msg } from "/src/js/home.js";


msg("Loading heavy resources...");

loadSceneModel()
loadRocketModel()

// games
loadProject("games",
"chess",
"Chess by Jhareign Solidum",
"Yeah, chess made by me! Play with yourself (or someone), or a grandmaster at chess, or I guess view chess games. Grandmaster you may ask? nah don't trust me:)",
"default"
);

loadProject("games",
"kynigito",
"Kynigito",
"Chase coins (and gems) before your time runs out. Acquire better characters for higher grace and luck.",
"https://great-anaphylaxis.itch.io/kynigito"
);

loadProject("games",
"cliff-jump-pou",
"Cliff Jump Pou Remake",
"A remake from the minigame Cliff Jump in the game Pou",
"https://great-anaphylaxis.itch.io/cliff-jump-pou"
);

loadProject("games",
"skodati",
"Skodati",
"A 2D horror game made in Unity.",
"https://great-anaphylaxis.itch.io/skodati"
);

loadProject("games",
"the-raid",
"The Raid",
"A game made during the Ludum Dare 50 Game Jam.",
"https://great-anaphylaxis.itch.io/the-raid"
);

loadProject("games",
"wordle",
"Wordle",
"A game where you guess a five letter word. Made in HTML, CSS and Javascript",
"default"
);

loadProject("games",
"overwhelm",
"Overwhelm",
"A game made in a day using the Unity Game Engine. It is game very similar to a space shooter game. All arts and music made by me.",
"https://great-anaphylaxis.itch.io/overwhelm"
);

loadProject("games",
"the-maze",
"The Maze of the Periodic Scale",
"A game made during the Global Game Jam 2021. Also my first game jam. The game is highly unpolished.",
"https://great-anaphylaxis.itch.io/the-maze-of-the-periodic-scale"
);

loadProject("games",
"annoying-brick-breaker-game",
"Annoying Brick Breaker Game",
"A game made in a day using the Unity Game Engine.",
"https://great-anaphylaxis.itch.io/annoying-brick-breaker-game"
);



// websites
loadProject("websites",
"coffee-cup-coding",
"Coffee Cup Coding",
"Coffee Cup Coding is part of the Great Anaphylaxis Imaginary Corporation™. Coffee Cup Coding is a coffee designed for programmers. Here is the website.",
"default"
);

loadProject("websites",
"anagram",
"Anagram",
"Anagram is part of the Great Anaphylaxis Imaginary Corporation™. Anagram is a prototype front-end social media-like project created by Jhareign Solidum. The design is very basic",
"default"
);

loadProject("websites",
"chat-yourself",
"Chat Yourself",
"You can chat with yourself here. I mean, why wouldn't you?",
"default"
);



// other projects
loadProject("other-projects",
"os",
"An unnamed operating system",
"My attempt at creating my own operating system. It is a 32 bit operating system with it's own bootloader. Note: It has not been tested on real hardware so it MIGHT NOT WORK ON REAL HARDWARE. But, it works on QEMU (a virtual machine).",
"default"
);




// meter bars for programming languages
// learner, competent (30+), proficient (50+), advanced (75+), expert, master
// main
listProgrammingLanguage("HTML", "95", "Expert", "main")
listProgrammingLanguage("CSS", "95", "Expert", "main")
listProgrammingLanguage("Javascript", "90", "Expert", "main")

// experience
listProgrammingLanguage("Python", "65", "Proficient", "experience")
listProgrammingLanguage("GDScript", "60", "Proficient", "experience")
listProgrammingLanguage("Batch Script", "60", "Proficient", "experience")
listProgrammingLanguage("C#", "40", "Competent", "experience")
listProgrammingLanguage("Java", "35", "Competent", "experience")
listProgrammingLanguage("Kotlin", "30", "Competent", "experience")
listProgrammingLanguage("SQL", "28", "Competent", "experience")
listProgrammingLanguage("C++", "25", "Learner", "experience")
listProgrammingLanguage("C", "25", "Learner", "experience")
listProgrammingLanguage("Assembly", "20", "Learner", "experience")