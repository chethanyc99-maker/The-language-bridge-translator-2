import { Story, Phrase, ChallengeTask, LeaderboardUser, ActivityLog, LanguageStatus } from "./types";

export const popularLanguages = [
  { name: "English", count: 24, code: "en", flag: "🇬🇧" },
  { name: "Spanish", count: 18, code: "es", flag: "🇪🇸" },
  { name: "Hindi", count: 16, code: "hi", flag: "🇮🇳" },
  { name: "Kannada", count: 15, code: "kn", flag: "🇮🇳" },
  { name: "French", count: 14, code: "fr", flag: "🇫🇷" },
  { name: "Japanese", count: 12, code: "ja", flag: "🇯🇵" },
];

export const commonPhrases: Phrase[] = [
  { id: "p1", english: "Hello", translation: "नमस्ते (Namaste)", emoji: "👋" },
  { id: "p2", english: "Thank you", translation: "धन्यवाद (Dhanyavaad)", emoji: "🙏" },
  { id: "p3", english: "How are you?", translation: "आप कैसे हैं? (Aap kaise hain?)", emoji: "😊" },
  { id: "p4", english: "Where are you from?", translation: "आप कहाँ से हैं? (Aap kahan se hain?)", emoji: "📍" },
  { id: "p5", english: "I'm hungry", translation: "मुझे भूख लगी है (Mujhe bhookh lagi hai)", emoji: "🍽️" },
  { id: "p6", english: "I want to travel", translation: "मैं यात्रा करना चाहता हूँ (Mein yatra karna chahta hoon)", emoji: "✈️" },
];

// Helper generators for 50 and 100 page scale stories
export function generateKidsAdventure100Story(): Story {
  const spanishNouns = [
    "pequeño explorador", "cachorro alegre", "conejo mágico", "dragón cariñoso", "duendecillo de luz",
    "gato con botas", "ardilla saltarina", "oso de peluche", "hada del bosque", "robot amistoso"
  ];
  const spanishAdjectives = [
    "que ríe", "de golosina", "de colores", "saltarín", "brillante",
    "de chocolate", "de burbujas", "del arcoíris", "de algodón de azúcar", "estrella"
  ];
  const spanishVerbs = [
    "ayuda a", "juega con", "canta con", "abraza a", "regala un dulce a",
    "descubre a", "enseña a saltar a", "viaja con", "sonríe a", "guía a"
  ];
  const spanishOutcomes = [
    "un árbol lleno de manzanas de caramelo.", "un río de chocolate blanco.", "un jardín de piruletas mágicas.", "una montaña de nubes dulces.", "un puente de arcoíris brillante.", "un cofre con juguetes mágicos.", "un tobogán de estrellas de azúcar.", "un lago lleno de burbujas de jabón.", "una alfombra que vuela alto.", "una fiesta de mariposas brillantes."
  ];

  const englishNouns = [
    "little explorer", "happy puppy", "magic bunny", "caring dragon", "bright pixie",
    "kitten with boots", "bouncy squirrel", "teddy bear", "forest fairy", "friendly robot"
  ];
  const englishAdjectives = [
    "laughing", "gummy-candy", "colorful", "jumping", "shining",
    "chocolate", "bubble", "rainbow", "cotton-candy", "starry"
  ];
  const englishVerbs = [
    "helps", "plays with", "sings with", "hugs", "gives a sweet to",
    "discovers", "teaches how to jump to", "travels with", "smiles at", "guides"
  ];
  const englishOutcomes = [
    "a tree full of caramel apples.", "a river of white chocolate.", "a garden of magic lollipops.", "a mountain of sweet marshmallows.", "a bright rainbow bridge.", "a chest with magic toys.", "a slide of sugar stars.", "a lake full of soap bubbles.", "a carpet that flies high.", "a party of glowing butterflies."
  ];

  const chapters = [];
  for (let i = 1; i <= 100; i++) {
    const nounIdx = (i * 3 + 1) % spanishNouns.length;
    const adjIdx = (i * 7 + 2) % spanishAdjectives.length;
    const verbIdx = (i * 9 + 4) % spanishVerbs.length;
    const outIdx = (i * 13 + 3) % spanishOutcomes.length;

    const spNoun = spanishNouns[nounIdx];
    const spAdj = spanishAdjectives[adjIdx];
    const spVerb = spanishVerbs[verbIdx];
    const spOut = spanishOutcomes[outIdx];

    const enNoun = englishNouns[nounIdx];
    const enAdj = englishAdjectives[adjIdx];
    const enVerb = englishVerbs[verbIdx];
    const enOut = englishOutcomes[outIdx];

    let targetText = "";
    let englishText = "";

    if (i === 1) {
      targetText = "¡Bienvenidos al Bosque de Fantasía! Nuestro valiente amiguito inicia una fantástica aventura de cien páginas mágicas, buscando estrellas de la felicidad.";
      englishText = "Welcome to the Fantasy Forest! Our brave little friend begins a fantastic adventure of one hundred magic pages, searching for stars of happiness.";
    } else if (i === 100) {
      targetText = "¡Misión cumplida! Al llegar a la página cien, el bosque entero brilla con canciones, fuegos artificiales y una hermosa fiesta para todos los niños del mundo.";
      englishText = "Mission accomplished! Upon reaching page one hundred, the whole forest shines with songs, fireworks, and a beautiful party for all the children of the world.";
    } else {
      targetText = `En el asombroso paso número ${i} de la aventura, el ${spNoun} ${spAdj} ${spVerb} con alegría a ${spOut} ¡Qué viaje tan divertido y lleno de sonrisas!`;
      englishText = `At the amazing step number ${i} of the adventure, the ${enAdj} ${enNoun} joyfully ${enVerb} ${enOut} What a fun journey full of smiles!`;
    }

    chapters.push({
      chapterNumber: i,
      chapterTitle: `Adventure Page ${i}`,
      textTarget: targetText,
      textEnglish: englishText
    });
  }

  return {
    id: "story-kids-100-es",
    title: "Leo and Pippin's 100 Magical Forest Discoveries",
    titleTranslation: "Las 100 Aventuras de Leo y Pippin en el Bosque Mágico",
    category: "Kids",
    language: "Spanish",
    readTime: "100 min read",
    rating: 4.98,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?auto=format&fit=crop&q=80&w=400",
    description: "Follow Leo the little boy and Pippin his fluffy puppy on an extraordinary 100-page adventure through the candy-filled Fantasy Forest!",
    chapters
  };
}

export function generateKidsSpace100Story(): Story {
  const frenchNouns = [
    "petit astronaute", "chiot de l'espace", "robot rigolo", "singe cosmique", "lapin d'étoile",
    "dragon de lune", "dauphin cosmique", "poney volant", "chat de galaxie", "oiseau chantant"
  ];
  const frenchAdjectives = [
    "déguisé en super-héros", "très doux", "plein de ballons", "qui chante", "extraordinaire",
    "qui danse la salsa", "à paillettes", "en cristal magique", "gourmand de bonbons", "joyeux"
  ];
  const frenchVerbs = [
    "visite", "salue", "aide", "invite à rigoler", "offre une friandise à",
    "dessine une image de", "apprend les couleurs à", "voyage dans les étoiles avec", "fait un grand câlin à", "raconte une histoire à"
  ];
  const frenchOutcomes = [
    "la planète géante faite de tarte aux fraises.", "un volcan magique qui crache du chocolat chaud.", "un carrousel volant au-dessus des nuages.", "un super anneau de Saturne tout en sucre filé.", "une jolie cascade de soda doré.", "les nuages doux goût vanille.", "un orchestre amusant de bébés extraterrestres.", "le toboggan le plus glissant de la galaxie de jouets.", "un château gonflable de l'espace.", "une pluie douce d'oursons en gélatine."
  ];

  const englishNouns = [
    "little astronaut", "space puppy", "funny robot", "cosmic monkey", "starry bunny",
    "moon dragon", "cosmic dolphin", "flying pony", "galaxy kitten", "singing bird"
  ];
  const englishAdjectives = [
    "dressed as a superhero", "very soft", "full of balloons", "singing", "extraordinary",
    "dancing salsa", "glittery", "magic crystal", "fond of candies", "joyful"
  ];
  const englishVerbs = [
    "visits", "greets", "helps", "invites to laugh", "offers a treat to",
    "draws a picture of", "teaches colors to", "travels through the stars with", "gives a huge hug to", "tells a story to"
  ];
  const englishOutcomes = [
    "the giant planet made of strawberry pie.", "a magic volcano that breathes hot chocolate.", "a flying carousel above the clouds.", "a super Saturn ring made of cotton candy.", "a pretty golden soda waterfall.", "soft clouds tasting like vanilla.", "a funny orchestra of baby aliens.", "the slippiest slide in the toy galaxy.", "a bouncing space castle.", "a gentle rain of gummy bears."
  ];

  const chapters = [];
  for (let i = 1; i <= 100; i++) {
    const nounIdx = (i * 2 + 5) % frenchNouns.length;
    const adjIdx = (i * 5 + 3) % frenchAdjectives.length;
    const verbIdx = (i * 7 + 1) % frenchVerbs.length;
    const outIdx = (i * 11 + 4) % frenchOutcomes.length;

    const frNoun = frenchNouns[nounIdx];
    const frAdj = frenchAdjectives[adjIdx];
    const frVerb = frenchVerbs[verbIdx];
    const frOut = frenchOutcomes[outIdx];

    const enNoun = englishNouns[nounIdx];
    const enAdj = englishAdjectives[adjIdx];
    const enVerb = englishVerbs[verbIdx];
    const enOut = englishOutcomes[outIdx];

    let targetText = "";
    let englishText = "";

    if (i === 1) {
      targetText = "Accrochez vos ceintures ! Notre adorable équipage spatial commence un voyage extraordinaire de cent chapitres à travers des nébuleuses pleines de jouets.";
      englishText = "Fasten your seatbelts! Our adorable space crew begins an extraordinary journey of one hundred chapters across nebulas filled with toys.";
    } else if (i === 100) {
      targetText = "Victoire intergalactique ! À la centième planète, nous allumons la grande bougie du bonheur universel. Tous les petits extraterrestres et enfants chantent ensemble !";
      englishText = "Intergalactic victory! At the hundredth planet, we light up the great candle of universal happiness. Every single little alien and children sing together!";
    } else {
      targetText = `À l'escale numéro ${i} de notre voyage cosmique, le ${frNoun} ${frAdj} ${frVerb} avec tendresse ${frOut} Quelle belle et drôle de journée dans l'espace !`;
      englishText = `At cosmic stop number ${i} of our journey, the ${enAdj} ${enNoun} tenderly ${enVerb} ${enOut} What a beautiful and funny day in space!`;
    }

    chapters.push({
      chapterNumber: i,
      chapterTitle: `Cosmic Stop ${i}`,
      textTarget: targetText,
      textEnglish: englishText
    });
  }

  return {
    id: "story-kids-100-fr",
    title: "The Galactic Safari of 100 Space Puppies",
    titleTranslation: "Le Safari Galactique des 100 Chiots de l'Espace",
    category: "Kids",
    language: "French",
    readTime: "100 min read",
    rating: 4.95,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=400",
    description: "Embark on an epic astronaut journey designed for kids! 100 space exploration pages filled with friendly baby aliens, balloon rockets, and strawberry oceans.",
    chapters
  };
}

// Helper generators for 50 and 100 page scale stories
export function generateCosmic100Story(): Story {
  const spanishAdjectives = ["místico", "brillante", "dorado", "plateado", "silencioso", "eterno", "estelar", "cósmico", "espectral", "lejano"];
  const spanishNouns = ["viajero", "portal", "cometa", "satélite", "destello", "sendero", "guía", "secreto", "infinito", "oráculo"];
  const spanishVerbs = ["descubrió", "iluminó", "activó", "encontró", "cruzó", "sintió", "escuchó", "miró", "buscó", "trazó"];
  const spanishOutcomes = ["una nueva esperanza.", "la ruta perdida.", "el destino del bosque.", "la energía cósmica.", "una señal silenciosa.", "la sabiduría estelar.", "el fin del universo.", "la luz de la mañana.", "la verdad secreta.", "una melodía cósmica."];

  const englishAdjectives = ["mystical", "bright", "golden", "silver", "silent", "eternal", "stellar", "cosmic", "spectral", "distant"];
  const englishNouns = ["traveler", "portal", "comet", "satellite", "sparkle", "pathway", "guide", "secret", "infinity", "oracle"];
  const englishVerbs = ["discovered", "illuminated", "activated", "found", "crossed", "felt", "heard", "watched", "searched", "traced"];
  const englishOutcomes = ["a new hope.", "the lost route.", "the destiny of the forest.", "the cosmic energy.", "a silent signal.", "the stellar wisdom.", "the end of the universe.", "the morning light.", "the secret truth.", "a cosmic melody."];

  const chapters = [];
  for (let i = 1; i <= 100; i++) {
    const adjIdx = (i * 3 + 1) % spanishAdjectives.length;
    const nounIdx = (i * 7 + 2) % spanishNouns.length;
    const verbIdx = (i * 9 + 4) % spanishVerbs.length;
    const outIdx = (i * 13 + 3) % spanishOutcomes.length;

    const spanAdj = spanishAdjectives[adjIdx];
    const spanNoun = spanishNouns[nounIdx];
    const spanVerb = spanishVerbs[verbIdx];
    const spanOut = spanishOutcomes[outIdx];

    const engAdj = englishAdjectives[adjIdx];
    const engNoun = englishNouns[nounIdx];
    const engVerb = englishVerbs[verbIdx];
    const engOut = englishOutcomes[outIdx];

    let targetText = "";
    let englishText = "";

    if (i === 1) {
      targetText = "Capítulo uno de la odisea. El explorador estelar con un traje de astros inicia una búsqueda de cien reinos espaciales, buscando la sabiduría perdida.";
      englishText = "Chapter one of the odyssey. The stellar explorer with a star-suit starts a quest of one hundred space realms, searching for the lost wisdom.";
    } else if (i === 100) {
      targetText = "¡Logro desbloqueado! En la constelación centésima, has reconectado el gran puente universal. El cosmos entero ahora brilla en una hermosa armonía eterna.";
      englishText = "Achievement unlocked! At the hundredth constellation, you have reconnected the great universal bridge. The entire cosmos now shines in a beautiful, eternal harmony.";
    } else {
      targetText = `En la página ${i} de nuestra odisea estelar, el ${spanNoun} ${spanAdj} ${spanVerb} con calma ${spanOut} Esta hermosa lección cósmica mejora nuestra mente para siempre.`;
      englishText = `On page ${i} of our stellar odyssey, the ${engAdj} ${engNoun} calmly ${engVerb} ${engOut} This beautiful cosmic lesson improves our mind forever.`;
    }

    chapters.push({
      chapterNumber: i,
      chapterTitle: `The ${i}th Constellation`,
      textTarget: targetText,
      textEnglish: englishText
    });
  }

  return {
    id: "story-epic-100",
    title: "Cosmic Odyssey of 100 Constellations",
    titleTranslation: "Aventura Cósmica de 100 Constelaciones",
    category: "Adventure",
    language: "Spanish",
    readTime: "100 min read",
    rating: 4.95,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=400",
    description: "An epic space saga comprising 100 distinct stargazing chapters. Travel across the cosmos and master 100 astronomical and poetic Spanish terms!",
    chapters
  };
}

export function generateFrench50Story(): Story {
  const frenchSubjects = ["Le randonneur", "Le vent", "L'oiseau", "Le ruisseau", "Le voyageur", "Le soleil", "Le marcheur", "Le loup", "Le renard", "Le cerf"];
  const frenchAdjectives = ["silencieux", "sauvage", "ancien", "calme", "heureux", "mystérieux", "rapide", "solitaire", "perdu", "profond"];
  const frenchVerbs = ["traverse", "observe", "écoute", "trouve", "adore", "admire", "découvre", "illumine", "éveille", "guide"];
  const frenchObjects = ["la magnifique forêt.", "les montagnes froides.", "le lac paisible.", "le vieux sentier.", "un refuge secret.", "la brume matinale.", "les feuilles d'or.", "l'horizon calme.", "les étoiles filantes.", "les fleurs bleues."];

  const englishSubjects = ["The hiker", "The wind", "The bird", "The stream", "The traveler", "The sun", "The walker", "The wolf", "The fox", "The deer"];
  const englishAdjectives = ["silent", "wild", "ancient", "calm", "happy", "mysterious", "swift", "solitary", "lost", "deep"];
  const englishVerbs = ["crosses", "observes", "listens to", "finds", "loves", "admires", "discovers", "illuminates", "awakens", "guides"];
  const englishObjects = ["the magnificent forest.", "the cold mountains.", "the peaceful lake.", "the old pathway.", "a secret shelter.", "the morning mist.", "the golden leaves.", "the calm horizon.", "the shooting stars.", "the blue flowers."];

  const chapters = [];
  for (let i = 1; i <= 50; i++) {
    const subIdx = (i * 2 + 3) % frenchSubjects.length;
    const adjIdx = (i * 5 + 1) % frenchAdjectives.length;
    const verbIdx = (i * 7 + 4) % frenchVerbs.length;
    const objIdx = (i * 11 + 2) % frenchObjects.length;

    const frSub = frenchSubjects[subIdx];
    const frAdj = frenchAdjectives[adjIdx];
    const frVerb = frenchVerbs[verbIdx];
    const frObj = frenchObjects[objIdx];

    const engSub = englishSubjects[subIdx];
    const engAdj = englishAdjectives[adjIdx];
    const engVerb = englishVerbs[verbIdx];
    const engObj = englishObjects[objIdx];

    let targetText = "";
    let englishText = "";

    if (i === 1) {
      targetText = "Chapitre un du voyage silencieux. Le marcheur solitaire d'un esprit tranquille commence ses cinquante pas sacrés à travers des forêts calmes, découvrant la nature.";
      englishText = "Chapter one of the silent journey. The quiet walker with a tranquil spirit begins his fifty sacred steps through calm forests, discovering nature.";
    } else if (i === 50) {
      targetText = "Félicitations pour le cinquantième pas ! Le voyageur atteint le sommet doré au-dessus des nuages magnifiques, trouvant une paix éternelle de l'esprit.";
      englishText = "Congratulations on the fiftieth step! The traveler reaches the golden summit above the magnificent clouds, finding an eternal peace of mind.";
    } else {
      targetText = `À l'étape numéro ${i} de notre méditation, ${frSub} ${frAdj} ${frVerb} doucement ${frObj} Chaque jour nous apporte confiance et joie de vivre.`;
      englishText = `At step number ${i} of our meditation, ${engSub} ${engAdj} ${engVerb} gently ${engObj} Each day brings us confidence and joy of life.`;
    }

    chapters.push({
      chapterNumber: i,
      chapterTitle: `Step ${i} of 50`,
      textTarget: targetText,
      textEnglish: englishText
    });
  }

  return {
    id: "story-epic-50",
    title: "The 50 Steps of the Quiet Wanderer",
    titleTranslation: "Les 50 Étapes du Voyageur Silencieux",
    category: "Life Lessons",
    language: "French",
    readTime: "50 min read",
    rating: 4.9,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=400",
    description: "A deeply calming journey about nature, patience, and meditation. 50 chapters exploring forests, rivers, and high-altitude winds in bilingual French.",
    chapters
  };
}

export function generateRamayanaKannada50Story(): Story {
  const ramayanaChaptersData = [
    {
      title: "The Sacrifice of King Dasharatha",
      target: "ಅಯೋಧ್ಯೆಯ ರಾಜನಾದ ದಶರಥನಿಗೆ ಸಂತಾನವಿಲ್ಲದ ಕಾರಣ ತೀವ್ರ ಚಿಂತಾಕ್ರಾಂತನಾಗಿದ್ದನು. ವಸಿಷ್ಠ ಮಹರ್ಷಿಗಳ ಉಪದೇಶದಂತೆ, ಅವರು ಋಷ್ಯಶೃಂಗ ಮುನಿಗಳ ನೇತೃತ್ವದಲ್ಲಿ ಪುತ್ರಕಾಮೇಷ್ಠಿ ಯಾಗವನ್ನು ಅತ್ಯಂತ ಶ್ರದ್ಧೆಯಿಂದ ಆಚರಿಸಿದರು. ಯಜ್ಞಕುಂಡದಿಂದ ಪ್ರತ್ಯಕ್ಷನಾದ ದೇವದೂತನು ದಶರಥನಿಗೆ ದಿವ್ಯ ಪಾಯಸದ ಪಾತ್ರೆಯನ್ನು ಪ್ರಸಾದವಾಗಿ ನೀಡಿದನು.",
      english: "King Dasharatha of Ayodhya was deeply sorrowful as he had no children to continue his royal lineage. Acting on the wise counsel of Sage Vashishta, he decided to perform the sacred Putrakameshti Yajna under the guidance of Sage Rishyasringa. The sacrificial fire gave a celestial vessel containing divine sweet pudding to be given to his queens."
    },
    {
      title: "The Birth of the Divine Princes",
      target: "ರಾಜ ದಶರಥನ ಪತ್ನಿಯರಾದ ಕೌಸಲ್ಯೆಯು ಶ್ರೀರಾಮನನ್ನು, ಕೈಕೇಯಿಯು ಭರತನನ್ನು ಮತ್ತು ಸುಮಿತ್ರೆಯು ಲಕ್ಷ್ಮಣ-ಶತ್ರುಘ್ನರನ್ನು ಹೆತ್ತರು. ಇಡೀ ಅಯೋಧ್ಯೆ ನಗರವು ದೀಪಾಲಂಕಾರಗಳಿಂದ ಮತ್ತು ಮಂಗಲ ರಾಗಗಳಿಂದ ಕಂಗೊಳಿಸಿತು. ದೇವಲೋಕದಿಂದ ದೇವತೆಗಳು ಹೂಮಳೆಗರೆದು ಈ ದಿವ್ಯ ಶಿಶುಗಳ ಜನನವನ್ನು ಸಂಭ್ರಮಿಸಿದರು.",
      english: "Queen Kausalya gave birth to Rama, Kaikeyi to Bharata, and Sumitra to the twins Lakshmana and Shatrughna. The entire kingdom of Ayodhya erupted in joyous celebrations, with oil lamps glowing and divine music filling the air. The heavens rained fragrant flowers to mark the birth of the divine princes."
    },
    {
      title: "Childhood and Devotion",
      target: "ನಾಲ್ವರು ರಾಜಕುಮಾರರು ಗುರುಕುಲದಲ್ಲಿ ಸಕಲ ಶಾಸ್ತ್ರಗಳು, ವೇದಗಳು ಮತ್ತು ಧನುರ್ವಿದ್ಯೆಯನ್ನು ಅತ್ಯಂತ ಯಶಸ್ವಿಯಾಗಿ ಕಲಿತರು. ಬಾಲ್ಯದಿಂದಲೇ ಲಕ್ಷ್ಮಣನು ಶ್ರೀರಾಮನಿಗೆ ಅಚಲವಾದ ಭಕ್ತಿಯನ್ನು ಹೊಂದಿದ್ದನು ಮತ್ತು ಶತ್ರುಘ್ನನು ಭರತನನ್ನು ಸದಾ ಅನುಸರಿಸುತ್ತಿದ್ದನು. ಇವರ ವಿನಯ ಮತ್ತು ಜ್ಞಾನವು ಇಡೀ ಸಾಮ್ರಾಜ್ಯದ ಪ್ರೀತಿಯನ್ನು ಗಳಿಸಿತು.",
      english: "The four princes grew up under the loving eyes of their teachers, masterfully learning the Vedas, statecraft, and archery. From an early age, Lakshmana showed immense devotion to Rama, while Shatrughna was closely attached to Bharata. They were loved by all citizens for their humility, wisdom, and exemplary character."
    },
    {
      title: "Arrival of Sage Vishwamitra",
      target: "ಅಪ್ರತಿಮ ತೇಜಸ್ವಿಯಾದ ವಿಶ್ವಾಮಿತ್ರ ಮಹರ್ಷಿಗಳು ಒಂದು ದಿನ ದಶರಥನ ರಾಜಸಭೆಗೆ ಆಗಮಿಸಿದರು. ತಮ್ಮ ಪವಿತ್ರ ಯಜ್ಞಗಳನ್ನು ರಾಕ್ಷಸರಿಂದ ರಕ್ಷಿಸಲು ಶ್ರೀರಾಮನನ್ನು ತಮ್ಮೊಂದಿಗೆ ಕಳುಹಿಸಿಕೊಡಬೇಕೆಂದು ಅವರು ವಿನಂತಿಸಿದರು. ದಶರಥನಿಗೆ ಹಿಂಜರಿಕೆಯಿದ್ದರೂ, ವಸಿಷ್ಠರ ಸಲಹೆಯ ಮೇರೆಗೆ ರಾಮನನ್ನು ಕಳುಹಿಸಲು ಒಪ್ಪಿದನು.",
      english: "The legendary Sage Vishwamitra arrived at Dasharatha's court seeking protection for his sacred undertakings. He requested the king to send young Rama to protect his holy sacrifices from the terror of demons like Tataka and Subahu. Dasharatha, though hesitant to send his young son, complied upon Vashishta's advice."
    },
    {
      title: "Departure of Rama and Lakshmana",
      target: "ತಂದೆ ಮತ್ತು ಗುರುಗಳ ಆಶೀರ್ವಾದವನ್ನು ಪಡೆದು, ರಾಮ ಮತ್ತು ಲಕ್ಷ್ಮಣರು ಬಿಲ್ಲು-ಬಾಣಗಳನ್ನು ಹಿಡಿದು ಧೀರತೆಯಿಂದ ಹೊರಟರು. ಅವರು ವಿಶ್ವಾಮಿತ್ರರ ಹಿಂದೆ ಅತ್ಯಂತ ನಿಷ್ಠೆಯಿಂದ ಕಾಡಿನ ಕಠಿಣ ಹಾದಿಯಲ್ಲಿ ಸಾಗಿದರು. ದಾರಿಯುದ್ದಕ್ಕೂ ಅವರು ಪ್ರಕೃತಿಯ ಸೌಂದರ್ಯವನ್ನು ಆನಂದಿಸುತ್ತಾ ಮುನ್ನಡೆದರು.",
      english: "Blessed by their father and Guru Vashishta, Rama and Lakshmana set out with Sage Vishwamitra. They carried their bows and arrows, walking behind the sage with courage and determination. They crossed beautiful rivers and dense forests, getting ready for their divine tasks."
    },
    {
      title: "First Encounter with Tataka",
      target: "ಅವರು ಪ್ರವೇಶಿಸಿದ ತಾಟಕಾವನವು ಅತ್ಯಂತ ಭೀಕರ ಹಾಗೂ भयಾನಕ ವಾತಾವರಣದಿಂದ ಕೂಡಿತ್ತು. ವಿಶ್ವಾಮಿತ್ರರು ಆಕೆಯ ಶಕ್ತಿಯ ಬಗ್ಗೆ ರಾಮನಿಗೆ ಎಚ್ಚರಿಕೆ ನೀಡಿದರು. ಮರುಕ್ಷಣವೇ ಆಕಾಶವನ್ನು ಸೀಳುವಂತೆ ಗರ್ಜಿಸುತ್ತಾ ಪ್ರಚಂಡ ರಾಕ್ಷಸಿ ತಾಟಕೆಯು ಅವರ ಮುಂದೆ ಪ್ರತ್ಯಕ್ಷಳಾದಳು.",
      english: "As they entered the dangerous forest of Tataka, Sage Vishwamitra warned them of her dark powers. The forest was dark and silent, filled with wild beasts and terrifying sounds. Suddenly, Tataka, a colossal demoness with fangs, lunged at them, shaking the earth with her roar."
    },
    {
      title: "Slaying of Tataka",
      target: "ಮೊದಲಿಗೆ ಸ್ತ್ರೀ ಹತ್ಯೆ ಮಾಡಲು ಶ್ರೀರಾಮನು ಹಿಂಜರಿದಾಗ, ಧರ್ಮರಕ್ಷಣೆಗಾಗಿ ಆಕೆಯನ್ನು ಕೊಲ್ಲುವುದು ಅಗತ್ಯವೆಂದು ವಿಶ್ವಾಮಿತ್ರರು ತಿಳಿಸಿದರು. ರಾಮನು ತನ್ನ ಧನುಸ್ಸಿಗೆ ಬಾಣ ಹೂಡಿ ಬಿಟ್ಟಾಗ, ಆ ತೀಕ್ಷ್ಣ ಬಾಣವು ತಾಟಕೆಯ ಎದೆಯನ್ನು ಸೀಳಿ ಆಕೆಯನ್ನು ಧರೆಗುರುಳಿಸಿತು. ಇದರಿಂದ ಕಾಡಿನಲ್ಲಿ ಮತ್ತೆ ಶಾಂತಿ ನೆಲೆಸಿತು.",
      english: "Although Rama hesitated briefly to strike a woman, Vishwamitra reminded him of his duty to protect the righteous. Rama strung his bow and shot a powerful arrow that pierced her heart, defeating her instantly. The forest was freed from her torment, and peace returned once more."
    },
    {
      title: "Bestow of Divine Weapons",
      target: "ಶ್ರೀರಾಮನ ಸಾಹಸ ಮತ್ತು ಕೌಶಲ್ಯಕ್ಕೆ ತೃಪ್ತರಾದ ವಿಶ್ವಾಮಿತ್ರ ಮಹರ್ಷಿಗಳು ಆತನಿಗೆ ದಿವ್ಯ ಜ್ಞಾನವನ್ನು ಬೋಧಿಸಿದರು. ಅವರು ಬ್ರಹ್ಮಾಸ್ತ್ರ ಸೇರಿದಂತೆ ಹಲವಾರು ರಹಸ್ಯ ದೈವಿಕ ಅಸ್ತ್ರಗಳನ್ನು ಮತ್ತು ಅವುಗಳನ್ನು ಆವಾಹಿಸುವ ಮಂತ್ರಗಳನ್ನು ರಾಮ-ಲಕ್ಷ್ಮಣರಿಗೆ ಧಾರೆ ಎರೆದರು. ಇದು ಭವಿಷ್ಯದ ಯುದ್ಧಗಳಿಗೆ ಅವರಿಗೆ ಮಹಾನ್ ಶಕ್ತಿಯನ್ನು ನೀಡಿತು.",
      english: "Overjoyed by Rama's extraordinary courage and archery, Sage Vishwamitra imparted supreme knowledge to the princes. He gave them rare, celestial weapons called Astras, and taught them the secret mantras to invoke them. These divine weapons were highly critical for Rama's battles in the future."
    },
    {
      title: "Defending the Holy Yajna",
      target: "ಅವರು ಸಿದ್ಧಾಶ್ರಮವನ್ನು ತಲುಪಿ ಯಜ್ಞವನ್ನು ಪ್ರಾರಂಭಿಸಿದಾಗ, ರಾಕ್ಷಸರಾದ ಸುಬಾಹು ಮತ್ತು ಮಾರೀಚರು ಆಕಾಶದಿಂದ ರಕ್ತದ ಮಳೆ ಸುರಿಸಿದರು. ಶ್ರೀರಾಮನು ಜಾಗರೂಕನಾಗಿ ಮಾರೀಚನನ್ನು ನೂರು ಯೋಜನ ದೂರದ ಸಮುದ್ರಕ್ಕೆ ಹಾರಿಸುವಂತೆ ಬಾಣ ಪ್ರಯೋಗಿಸಿದನು ಮತ್ತು ಸುಬಾಹುವನ್ನು ಯಜ್ಞಕುಂಡದ ಬಳಿಯೇ ಕೊಂದು ಧರ್ಮ ಯಾಗವನ್ನು ರಕ್ಷಿಸಿದನು.",
      english: "At the hermitage of Siddhashrama, the golden altar was set, and the sages began the holy Yajna. Suddenly, the demons Subahu and Maricha darkened the skies, raining blood and stones upon the altar. Armed with his celestial bow, Rama shot Maricha far into the ocean and slew Subahu, successfully saving the sacred ritual."
    },
    {
      title: "Liberation of Ahalya",
      target: "ಮಿಥಿಲೆಗೆ ಹೋಗುವ ದಾರಿಯಲ್ಲಿ ಅವರು ನಿರ್ಜನ ಆಶ್ರಮದಲ್ಲಿದ್ದ ದೂಳು ತುಂಬಿದ ಕಲ್ಲೊಂದನ್ನು ಕಂಡರು. ಅದು ಮಹರ್ಷಿ ಗೌತಮರ ಶಾಪದಿಂದ ಕಲ್ಲಾಗಿದ್ದ ಅಹಲ್ಯೆ ಎಂದು ವಿಶ್ವಾಮಿತ್ರರು ತಿಳಿಸಿದರು. ಶ್ರೀರಾಮನ ಪಾದಸ್ಪರ್ಶವಾಗುತ್ತಿದ್ದಂತೆಯೇ, ಆ ಕಲ್ಲು ತೇಜಸ್ವಿ ಸ್ತ್ರೀಯಾಗಿ ಮಾರ್ಪಟ್ಟು ರಾಮನನ್ನು ಕೃತಜ್ಞತೆಯಿಂದ ವಂದಿಸಿತು.",
      english: "On their way to Mithila, they passed by a deserted ashram where a stone lay covered in dust. Vishwamitra revealed that this was Ahalya, the wife of Sage Gautama, turned into stone due to a curse. As Rama's sacred feet touched the stone, she was instantly restored to her radiant human form, expressing her deepest gratitude."
    },
    {
      title: "Journey to Mithila",
      target: "ಮಿಥಿಲಾ ನಗರದ ರಾಜನಾದ ಜನಕ ಮಹಾರಾಜನು ಧರ್ಮನಿಷ್ಠ ಹಾಗೂ ಜ್ಞಾನಿಯಾಗಿದ್ದನು. ಆತನ ಆಹ್ವಾನದ ಮೇರೆಗೆ ವಿಶ್ವಾಮಿತ್ರರು ರಾಮ-ಲಕ್ಷ್ಮಣರೊಂದಿಗೆ ಮಿಥಿಲೆಯನ್ನು ತಲುಪಿದರು. ಅಲ್ಲಿಗೆ ಬಂದಿದ್ದ ಅನೇಕ ರಾಜರು ಯುವರಾಜ ರಾಮನ ತೇಜಸ್ಸನ್ನು ನೋಡಿ ಆಶ್ಚರ್ಯಚಕಿತರಾದರು.",
      english: "Vishwamitra accompanied the princes to the glorious kingdom of Mithila, ruled by the noble and saintly King Janaka. The city was beautifully decorated with flowers and banners, preparing for the assembly of great warriors. King Janaka welcomed the divine guests with highest honors, sensing the divinity within Rama."
    },
    {
      title: "The Great Shiva Bow Pinaka",
      target: "ಜನಕ ಮಹಾರಾಜನು ತನ್ನ ಮಗಳು ಸೀತೆಗೆ ಯೋಗ್ಯವರನನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಶಿವಧನುಸ್ಸನ್ನು ಎತ್ತುವ ಪಂದ್ಯವನ್ನು ಏರ್ಪಡಿಸಿದ್ದನು. ಆ ಬೃಹತ್ ಶಿವಧನುಸ್ಸಾದ 'ಪಿನಾಕ'ವನ್ನು ಯಾರೊಬ್ಬರೂ ಅಲುಗಾಡಿಸಲೂ ಸಾಧ್ಯವಾಗದೆ ಸೋತು ತಲೆತಗ್ಗಿಸಿದ್ದರು.",
      english: "King Janaka had declared a challenge: whoever could lift, bend, and string the massive Shiva Bow 'Pinaka' would win the hand of Princess Sita. Many mighty kings and valorous princes had tried and failed, unable to even budge the enormous iron case holding the legendary bow."
    },
    {
      title: "Breaking the Divine Bow",
      target: "ವಿಶ್ವಾಮಿತ್ರ ಮುನಿಗಳ ಅಪ್ಪಣೆಯಂತೆ ಶ್ರೀರಾಮನು ಅತ್ಯಂತ ವಿನಯದಿಂದ ಶಿವಧನುಸ್ಸಿನ ಬಳಿ ನಡೆದನು. ಆತನು ಸುಲಭವಾಗಿ ಆ ಬೃಹತ್ ಧನುಸ್ಸನ್ನು ತನ್ನ ಒಂದೇ ಕೈಯಿಂದ ಎತ್ತಿ ಜ್ಯೆ ಎಳೆದನು. ಆಗ ಇಡೀ ಬ್ರಹ್ಮಾಂಡವೇ ಕಂಪಿಸುವಂತೆ ಪ್ರಚಂಡ ಶಬ್ದದೊಂದಿಗೆ ಆ ದಿವ್ಯ ಧನುಸ್ಸು ಎರಡು ತುಂಡುಗಳಾಯಿತು.",
      english: "Commanded by Sage Vishwamitra, young Rama stepped forward with absolute grace and humility. He easily lifted the colossal bow from its heavy iron case with one hand, to the astonishment of the entire court. As he bent it to tie the string, the bow snapped with a thunderous crack that shook the three worlds."
    },
    {
      title: "Sita's Joy and Garland",
      target: "ಶ್ರೀರಾಮನ ಸಾಹಸವನ್ನು ಕಂಡು ಕನ್ಯೆ ಸೀತೆಯು ಪರಮಾನಂದ ಹೊಂದಿದಳು. ಅವಳು ತನ್ನ ಮಂದಸ್ಮಿತ ಮುಖದೊಂದಿಗೆ ನಡೆದುಬಂದು, ಮಂಗಲಕರವಾದ ಚಿನ್ನದ ಹಾರವನ್ನು ಶ್ರೀರಾಮನ ಕೊರಳಿಗೆ ಅತ್ಯಂತ ಪ್ರೀತಿಯಿಂದ ಅರ್ಪಿಸಿದಳು ಮತ್ತು ಆತನನ್ನು ತನ್ನ ಪತಿಯಾಗಿ ಸ್ವೀಕರಿಸಿದಳು.",
      english: "Seeing the handsome and divine Rama break the bow, Princess Sita felt supreme joy in her heart. Attended by her companions, she walked gracefully toward Rama with a beautiful golden flower garland. She placed the garland around his neck, choosing him as her eternal lord."
    },
    {
      title: "The Auspicious Sita Kalyana",
      target: "ಈ ಶುಭ ಸುದ್ದಿಯನ್ನು ಕೇಳಿ ರಾಜ ದಶರಥನು ಸಕಲ ವೈಭವಗಳೊಂದಿಗೆ ಮಿಥಿಲಾ ನಗರಕ್ಕೆ ಆಗಮಿಸಿದನು. ಅಲ್ಲಿ ಜನಕ ಮಹಾರಾಜನು ರಾಮ-ಸೀತೆಯರ ಹಾಗೂ ಉಳಿದ ಸಹೋದರರ ವಿವಾಹವನ್ನು ಅತ್ಯಂತ ಸಂಭ್ರಮದಿಂದ ಮತ್ತು ಧಾರ್ಮಿಕ ವಿಧಿವಿಧಾನಗಳೊಂದಿಗೆ ನೆರವೇರಿಸಿದನು.",
      english: "Express messengers were sent to Ayodhya to share the joyous news with King Dasharatha. Dasharatha arrived with a grand royal procession including ministers, sages, and soldiers. The divine wedding of Rama and Sita, along with their siblings, was celebrated with unprecedented golden splendour."
    },
    {
      title: "Encounter with Parashurama",
      target: "ಅಯೋಧ್ಯೆಗೆ ಹಿಂದಿರುಗುವ ದಾರಿಯಲ್ಲಿ, ರೌದ್ರಾವತಾರದ ಪರಶುರಾಮರು ಶಿವನ ಧನುಸ್ಸು ಮುರಿದಿದ್ದಕ್ಕೆ ಕೋಪಗೊಂಡು ಎದುರಾದರು. ಅವರು ರಾಮನಿಗೆ ವಿಷ್ಣುವಿನ ಧನುಸ್ಸನ್ನು ಹೆದರಿಸಲು ಸವಾಲು ಹಾಕಿದರು. ಆದರೆ ಶ್ರೀರಾಮನು ಅದನ್ನು ಸುಲಭವಾಗಿ ಹೆದರಿಸಿ ಪರಶುರಾಮರ ಅಹಂಕಾರವನ್ನು ಅಡಗಿಸಿದನು.",
      english: "As the wedding party returned to Ayodhya, they were suddenly blocked by the fiery and angry Sage Parashurama. Angered by the breaking of his preceptor Lord Shiva's bow, he challenged Rama to string his Vishnu Bow. Rama kindly took the bow and strung it, subduing Parashurama's pride."
    },
    {
      title: "Return to Joyous Ayodhya",
      target: "ಅಯೋಧ್ಯೆಯ ನಾಗರಿಕರು ತಮ್ಮ ಪ್ರೀತಿಯ ರಾಜಕುಮಾರರ ಮದುವೆಯ ಸಂಭ್ರಮವನ್ನು ಹಬ್ಬದಂತೆ ಆಚರಿಸಿದರು. ಇಡೀ ಪಟ್ಟಣವು ಹರ್ಷೋದ್ಗಾರದಿಂದ ತುಂಬಿಹೋಯಿತು. ಮೂವರು ತಾಯಂದಿರು ಹೊಸ ಸೊಸೆಯರನ್ನು ಅರಮನೆಗೆ ಪ್ರೀತಿಯಿಂದ ಬರಮಾಡಿಕೊಂಡರು.",
      english: "The royal family and the newlywed couples arrived in Ayodhya to a magnificent welcome from the citizens. The streets were filled with oil lamps, sweet fragrances, and festive dances. Queens Kausalya, Sumitra, and Kaikeyi welcomed their beautiful new daughters with blessings of eternal happiness."
    },
    {
      title: "Plan for Rama's Coronation",
      target: "ಮಹಾರಾಜ ದಶರಥನಿಗೆ ವಯಸ್ಸಾಗುತ್ತಾ ಬಂದಿದ್ದರಿಂದ, ಪ್ರಜಾವತ್ಸಲನಾದ ಶ್ರೀರಾಮನನ್ನು ಯುವರಾಜನನ್ನಾಗಿ ಪಟ್ಟಾಭಿಷೇಕ ಮಾಡಲು ತೀರ್ಮಾನಿಸಿದನು. ಇಡೀ ಅಯೋಧ್ಯೆಯು ಈ ಶುಭ ಕಾರ್ಯಕ್ಕಾಗಿ ಚಿನ್ನದ ತಳಿರು-ತೋರಣಗಳಿಂದ ಅಲಂಕೃತಗೊಂಡು ಸಿದ್ಧವಾಯಿತು.",
      english: "Feeling the burden of old age, King Dasharatha desired to crown Rama as the Yuvaraja of Ayodhya. The council of ministers, sages, and citizens unanimously supported this decision because Rama was loved for his virtue and high justice. The coronation was set for the very next day."
    },
    {
      title: "Manthara's Poisonous Words",
      target: "ರಾಮನ ಪಟ್ಟಾಭಿಷೇಕದ ಸುದ್ದಿ ಕೇಳಿದ ಕುಟಿಲ ದಾಸಿ ಮಂಥರೆಯು ಈರ್ಷೆಯಿಂದ ಬೆಂದಳು. ಅವಳು ಕೈಕೇಯಿಯ ಬಳಿ ಹೋಗಿ, ರಾಮನು ರಾಜನಾದರೆ ಭರತನಿಗೆ ಮತ್ತು ಅವಳಿಗೆ ಅನ್ಯಾಯವಾಗುತ್ತದೆ ಎಂದು ಸುಳ್ಳು ನುಡಿದು ಕೈಕೇಯಿಯ ಮನಸ್ಸನ್ನು ಕೆಡಿಸಿದಳು.",
      english: "The evil-minded maid Manthara was filled with jealousy upon hearing the news of Rama's coronation. She hurried to Queen Kaikeyi and successfully poisoned her mind, falsely claiming that Bharata would be exiled or enslaved once Rama became the supreme king. Kaikeyi, initially loving Rama, fell for the clever trap."
    },
    {
      title: "Two Destructive Boons",
      target: "ಕೈಕೇಯಿಯು ಮಹಾರಾಜ ದಶರಥನು ಹಿಂದೆ ತನಗೆ ನೀಡಿದ್ದ ಎರಡು ವರಗಳನ್ನು ಕೇಳಿದಳು. ಮೊದಲನೆಯದಾಗಿ ಭರತನಿಗೆ ಪಟ್ಟಾಭಿಷೇಕ ಮಾಡಬೇಕು ಮತ್ತು ಎರಡನೆಯದಾಗಿ ಶ್ರೀರಾಮನು ಹದಿನಾಲ್ಕು ವರ್ಷಗಳ ಕಾಲ ಕಾಡಿಗೆ ವನವಾಸ ಹೋಗಬೇಕೆಂದು ಹಠ ಹಿಡಿದಳು.",
      english: "Armed with her poisoned thoughts, Kaikeyi demanded two boons that Dasharatha had promised her long ago during a battle. She demanded that her son Bharata be crowned king, and that Rama be exiled to the harsh Dandakaranya forest for fourteen years. Dasharatha was utterly shattered by her cruel words."
    },
    {
      title: "Rama Accepts Supreme Duty",
      target: "ತನ್ನ ತಂದೆಯ ಮೌನ ಮತ್ತು ಕಣ್ಣೀರಿನ ಕಾರಣವನ್ನು ತಿಳಿದ ಶ್ರೀರಾಮನು ಕೈಕೇಯಿಯ ಇಚ್ಛೆಯನ್ನು ಗೌರವಿಸಿದನು. ಆತನು ಲೇಶವೂ ಬೇಸರ ಮಾಡಿಕೊಳ್ಳದೆ, ತಂದೆಯ ಮಾತನ್ನು ಉಳಿಸಲು ತಕ್ಷಣವೇ ವನವಾಸಕ್ಕೆ ಹೋಗಲು ಸಿದ್ಧನೆಂದು ಅತ್ಯಂತ ಪ್ರಶಾಂತವಾಗಿ ನುಡಿದನು.",
      english: "Finding his father weeping and speechless, Rama learned of Kaikeyi's harsh demands from her directly. He showed no trace of sadness or anger, prioritizing truth and his father's honor above all royal titles. He readily agreed to leave for the forest immediately with a calm, peaceful smile."
    },
    {
      title: "Sita and Lakshmana's Resolve",
      target: "ಸೀತಾದೇವಿಯು ಅರಮನೆಯ ಸುಖವನ್ನು ತ್ಯಜಿಸಿ ಪತಿಯ ಜೊತೆಗಿರಲು ಪಣತೊಟ್ಟಳು. ಲಕ್ಷ್ಮಣನು ಸಹ ತನ್ನ ಅಣ್ಣನ ಸೇವೆ ಮಾಡಲು ಕಾಡಿಗೆ ಬರಲು ಹಠ ಹಿಡಿದರು. ಇವರ ಗಾಢವಾದ ಪ್ರೀತಿ ಮತ್ತು ಭಕ್ತಿಗೆ ಮಣಿದು ಶ್ರೀರಾಮನು ಇಬ್ಬರನ್ನೂ ಜೊತೆಯಲ್ಲಿ ಕರೆದುಕೊಂಡು ಹೋಗಲು ಒಪ್ಪಿದನು.",
      english: "Sita refused to stay back in the luxury of the palace, stating that her place was always by her husband's side, even in the forest. Lakshmana also insisted on going along, promising to serve as Rama's loyal protector and brother. Rama, moved by their supreme devotion, allowed them to accompany him."
    },
    {
      title: "Farewell to Royal Ayodhya",
      target: "ಶ್ರೀರಾಮ, ಸೀತೆ ಮತ್ತು ಲಕ್ಷ್ಮಣರು ತಮ್ಮ ರಾಜವಸ್ತ್ರಗಳನ್ನು ತ್ಯಜಿಸಿ ನಾರುಮಡಿಯುಟ್ಟು ಕಾಡಿನತ್ತ ಹೆಜ್ಜೆ ಇಟ್ಟರು. ಅಯೋಧ್ಯೆಯ ನೂರಾರು ನಾಗರಿಕರು ಕಣ್ಣೀರಿಡುತ್ತಾ ಸುಮಂತ್ರನ ರಥದ ಹಿಂದೆ ಓಡಿದರು. ಇಡೀ ಅಯೋಧ್ಯೆಯೇ ಶೋಕಸಾಗರದಲ್ಲಿ ಮುಳುಗಿತು.",
      english: "Rama, Sita, and Lakshmana discarded their royal garments and wore humble tree-bark clothes. The citizens of Ayodhya wept, running behind their chariot driven by Sumantra. The entire atmosphere was filled with deep, unbearable sorrow as the divine trio crossed the borders of the kingdom."
    },
    {
      title: "The Friendly Boatman Guha",
      target: "ಗಂಗಾನದಿಯ ತೀರದಲ್ಲಿ ಭೇಟಿಯಾದ ಬೇಟೆಗಾರರ ರಾಜ ಗುಹನು ಶ್ರೀರಾಮನಿಗೆ ಹೃತ್ಪೂರ್ವಕ ಸ್ವಾಗತ ಕೋರಿದನು. ಅವನು ಶ್ರದ್ಧೆಯಿಂದ ಕಂದಮೂಲಗಳನ್ನು ಅರ್ಪಿಸಿ, ಗಂಗೆಯನ್ನು ದಾಟಲು ಸುಂದರವಾದ ದೋಣಿಯೊಂದನ್ನು ವ್ಯವಸ್ಥೆ ಮಾಡಿ ಪ್ರೀತಿಯ ಭಕ್ತಿಯನ್ನು ತೋರಿದನು.",
      english: "At the banks of the holy Ganges river, they met Guha, the noble chief of the Nishada hunters. Guha loved Rama deeply and offered them fruits, root vegetables, and a safe place to rest. He then arranged a strong wooden boat to help them cross the deep waters safely."
    },
    {
      title: "Arrival at Chitrakoota",
      target: "ಭರದ್ವಾಜ ಮುನಿಗಳ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಅವರು ರಮಣೀಯವಾದ ಚಿತ್ರಕೂಟ ಪರ್ವತವನ್ನು ತಲುಪಿದರು. ಅಲ್ಲಿ ಲಕ್ಷ್ಮಣನು ಮರ ಹಾಗೂ ಎಲೆಗಳಿಂದ ಸುಂದರವಾದ ಪರ್ಣಕುಟೀರವನ್ನು ಕಟ್ಟಿದನು. ಅವರು ಅಲ್ಲಿ ಪ್ರಕೃತಿಯ ನಡುವೆ ಸಂತೋಷದ ದಿನಗಳನ್ನು ಕಳೆದರು.",
      english: "Following the guidance of Sage Bharadwaja, they reached the beautiful hill of Chitrakoota. Lakshmana built a strong and elegant hermitage using wood, mud, and leaves. They lived there in peace, surrounded by deer, singing birds, and pure streams of water."
    },
    {
      title: "Dasharatha Passes Away",
      target: "ಶ್ರೀರಾಮನ ಅಗಲಿಕೆಯ ಶೋಕವನ್ನು ತಡೆಯಲಾರದೆ ದಶರಥ ಮಹಾರಾಜನು ಹಾಸಿಗೆ ಹಿಡಿದನು. ಹಿಂದೆ ತನಗೆ ಮುರುಡ ದಂಪತಿಗಳು ನೀಡಿದ್ದ ಶಾಪವನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳುತ್ತಾ, 'ಹಾ ರಾಮ, ಹಾ ಸೀತಾ' ಎಂದು ಗೋಳಾಡುತ್ತಾ ಆತನು ತನ್ನ ಪ್ರಾಣವನ್ನು ತ್ಯಜಿಸಿದನು.",
      english: "Depressed by the departure of his beloved son Rama, King Dasharatha lay on his bed filled with intense grief. Remembering a past curse by a blind couple whose son Shravana Kumara he had accidentally killed, he breathed his last crying 'Ha Rama! Ha Sita! Ha Lakshmana!'."
    },
    {
      title: "Bharata's Disgrace and Sorrow",
      target: "ತನ್ನ ತಾಯಿಯ ದುಷ್ಟ ಸಂಚಿನಿಂದ ತಂದೆ ನಿಧನರಾಗಿದ್ದಾರೆ ಮತ್ತು ಅಣ್ಣ ವನವಾಸಕ್ಕೆ ಹೋಗಿದ್ದಾರೆ ಎಂದು ತಿಳಿದು ಭರತನು ಕ್ರೋಧೋದ್ರಿಕ್ತನಾದನು. ಅವನು ಕೈಕೇಯಿಯ ಮುಖವನ್ನೂ ನೋಡದೆ, ಅವಳ ಆ ಕೃತ್ಯವನ್ನು ತಿರಸ್ಕರಿಸಿ ರಾಮನೇ ನಿಜವಾದ ರಾಜನೆಂದು ಘೋಷಿಸಿದನು.",
      english: "Returning to Ayodhya, Bharata strongly condemned his mother Kaikeyi's actions when he learned of her evil plotting. He refused to accept the stolen crown, declaring that only Rama was the rightful king of Ayodhya."
    },
    {
      title: "Seeking Rama in the Wilds",
      target: "ಶ್ರೀರಾಮನನ್ನು ಮರಳಿ ಕರೆತರಲು ಭರತನು ಅಯೋಧ್ಯೆಯ ಪ್ರಮುಖರೊಂದಿಗೆ ಚಿತ್ರಕೂಟಕ್ಕೆ ಧಾವಿಸಿದನು. ರಾಮನನ್ನು ಕಂಡು ಆತನ ಪಾದಗಳಿಗೆ ಬಿದ್ದು ಮುಕ್ಕಾಲು ಲೋಕ ಆಳುವ ಸಿಂಹಾಸನವನ್ನು ಮರಳಿ ಸ್ವೀಕರಿಸಬೇಕೆಂದು ಕಣ್ಣೀರಿಡುತ್ತಾ ಬೇಡಿದನು.",
      english: "Determined to bring Rama back and crown him king, Bharata set out to the forest with the entire royal entourage. He walked on foot as a mark of deep penance and respect. When he found Rama in Chitrakoota, he fell at his feet, weeping and begging him to return."
    },
    {
      title: "The Sacred Padukas Placed",
      target: "ಧರ್ಮದ ಹಾದಿಯಲ್ಲಿ ರಾಮನು ವನವಾಸ ಮುಂದುವರಿಸಲು ನಿರ್ಧರಿಸಿದಾಗ, ಭರತನು ಆತನ ಪಾದರಕ್ಷೆಗಳನ್ನು (ಪಾದುಕೆಗಳನ್ನು) ಕೇಳಿ ಪಡೆದನು. ಆ ಪಾದುಕೆಗಳನ್ನೇ ಸಿಂಹಾಸನದ ಮೇಲಿಟ್ಟು, ತಾನು ನಂದಿಗ್ರಾಮದಲ್ಲಿ ತಪಸ್ವಿಯಂತೆ ಬಾಳುತ್ತಾ ರಾಮನ ದಾರಿ ಕಾಯಲು ನಿರ್ಧರಿಸಿದನು.",
      english: "Rama refused to break his father's promise, insisting that truth was his highest religion. Understanding Rama's firm resolve, Bharata begged for Rama's wooden sandals to place on the throne. Bharata promised to live as an ascetic outside Ayodhya, waiting for Rama's return."
    },
    {
      title: "Entering Dandakaranya Forest",
      target: "ಚಿತ್ರಕೂಟವನ್ನು ಬಿಟ್ಟು ಶ್ರೀರಾಮನು ಘೋರವಾದ ದಂಡಕಾರಣ್ಯಕ್ಕೆ ಪ್ರಯಾಣ ಬೆಳೆಸಿದನು. ಅಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದ ಸನ್ಯಾಸಿಗಳು ರಾಕ್ಷಸರ ಹಿಂಸೆಯಿಂದ ತತ್ತರಿಸುತ್ತಿದ್ದರು. ಶ್ರೀರಾಮನು ಆ ಮುನಿಗಳಿಗೆ ಭಯಪಡಬೇಡಿರಿ ಎಂದು ಅಭಯ ನೀಡಿ ಧರ್ಮರಕ್ಷಣೆಯ ಶಪಥ ಮಾಡಿದನು.",
      english: "To prevent more visitors from Ayodhya, Rama decided to move deeper into the dense Dandakaranya forest. The forest was inhabited by many holy sages who were constantly terrorized by cannibalistic demons. Rama promised the sages that he would destroy the demons and protect their penance."
    },
    {
      title: "Meeting Sage Agastya",
      target: "ದಂಡಕಾರಣ್ಯದಲ್ಲಿ ಅವರು ಅಗಸ್ತ್ಯ ಮಹರ್ಷಿಗಳನ್ನು ಸಂದರ್ಶಿಸಿ ಅವರ ಆಶೀರ್ವಾದ ಪಡೆದರು. ಅಗಸ್ತ್ಯರು ಶ್ರೀರಾಮನಿಗೆ ದೇವಲೋಕದ ಮಹಾಬಿಲ್ಲು, ಎಂದೂ ಮುಗಿಯದ ಬತ್ತಳಿಕೆ ಹಾಗೂ ಒಂದು ದಿವ್ಯ ಖಡ್ಗವನ್ನು ನೀಡಿ ಭವಿಷ್ಯದ ಮಹಾ ಸಂಗ್ರಾಮಕ್ಕೆ ಸಿದ್ಧಗೊಳಿಸಿದರು.",
      english: "The trio visited the ashram of the legendary Sage Agastya, who welcomed them with supreme love and spiritual insight. Knowing the challenges ahead, Agastya gifted Rama a glorious golden bow created by Vishwakarma, an inexhaustible quiver of celestial arrows, and a shining sword."
    },
    {
      title: "Panchavati Hermitage",
      target: "ಅಗಸ್ತ್ಯರ ಆಜ್ಞೆಯಂತೆ ಅವರು ಗೋದಾವರಿ ನದಿ ತೀರದ ಪಂಚವಟಿ ಎಂಬ ರಮಣೀಯ ಜಾಗದಲ್ಲಿ ನೆಲೆಸಿದರು. ಲಕ್ಷ್ಮಣನು ಅಲ್ಲಿ ಅತ್ಯಂತ ಭದ್ರವಾದ ಮತ್ತು ಸುಂದರವಾದ ಪರ್ಣಕುಟೀರವನ್ನು ರಚಿಸಿದನು. ಅಲ್ಲಿನ ಪ್ರಕೃತಿಯು ಅವರ ಮನಸ್ಸಿಗೆ ಹರ್ಷವನ್ನು ತಂದಿತು.",
      english: "On Agastya's advice, they chose Panchavati on the banks of the sacred Godavari river as their new home. Lakshmana built a beautiful cottage framed by towering trees, flowering creepers, and wild deer. They spent several peaceful, happy years in this serene natural paradise."
    },
    {
      title: "The Scheming Shurpanakha",
      target: "ಲಂಕಾಧಿಪತಿ ರಾವಣನ ತಂಗಿಯಾದ ರಾಕ್ಷಸಿ ಶೂರ್ಪನಖಿಯು ಪಂಚವಟಿಗೆ ಬಂದು ರಾಮನ ಅಪೂರ್ವ ಸೌಂದರ್ಯಕ್ಕೆ ಮಾರುಹೋದಳು. ಅವಳು ಮಾಯಾವಿ ಸುಂದರಿಯ ರೂಪದಲ್ಲಿ ಬಂದು ರಾಮನನ್ನು ಲಗ್ನವಾಗಲು ಪ್ರೇರೇಪಿಸಿದಳು. ಆದರೆ ರಾಮನು ಆಕೆಯನ್ನು ಉಪೇಕ್ಷಿಸಿದನು.",
      english: "Shurpanakha, a demoness and sister of the demon king Ravana, was wandering in the forest and saw the breathtakingly handsome Rama. Infatuated by his beauty, she transformed into a beautiful lady and proposed marriage to Rama. When rejected, she approached Lakshmana, who also turned her down."
    },
    {
      title: "The Warning Punishment",
      target: "ಕೋಪಗೊಂಡ ಶೂರ್ಪನಖಿಯು ಸೀತಾದೇವಿಯ ಮೇಲೆ ದಾಳಿ ಮಾಡಲು ಹೋದಾಗ, ಲಕ್ಷ್ಮಣನು ಆಕೆಯನ್ನು ರಕ್ಷಿಸಲು ಮುಂದಾದನು. ಅವನು ತನ್ನ ತೀಕ್ಷ್ಣ ಖಡ್ಗದಿಂದ ಆಕೆಯ ಮೂಗು ಮತ್ತು ಕಿವಿಗಳನ್ನು ಕತ್ತರಿಸಿ ಆಕೆಗೆ ತಕ್ಕ ಬುದ್ಧಿ ಕಲಿಸಿ ಅಲ್ಲಿಂದ ಓಡಿಸಿದನು.",
      english: "Enraged by the rejection, Shurpanakha attacked Princess Sita, trying to swallow her alive. Lakshmana quickly stepped into action, drawing his sharp sword to defend Sita. He cut off Shurpanakha's nose and ears as a strict warning, running her screaming back to her brothers."
    },
    {
      title: "Ravana's Vengeance Begins",
      target: "ಅಪಮಾನಿತಳಾದ ಶೂರ್ಪನಖಿಯು ಲಂಕಾಕ್ಕೆ ಹಿಂತಿರುಗಿ ರಾವಣನಿಗೆ ತನ್ನ ಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ, ಸೀತೆಯ ದಿವ್ಯ ಸೌಂದರ್ಯದ ಬಗ್ಗೆ ಬಣ್ಣಿಸಿದಳು. ಅವಳು ಸೀತೆಯನ್ನು ಅಪಹರಿಸಿ ರಾಮನಿಗೆ ಪಾಠ ಕಲಿಸಬೇಕೆಂದು ರಾವಣನ ಮನಸ್ಸಿನಲ್ಲಿ ಕ್ರೂರ ಸೇಡಿನ ಬೀಜವನ್ನು ಬಿತ್ತಿದಳು.",
      english: "Bleeding and humiliated, Shurpanakha fled to Lanka and described Sita's breathtaking beauty to her brother Ravana. She urged him to abduct Sita and make her his queen. Enticed by the descriptions and wanting to avenge his sister, Ravana devised a cunning plan to capture Sita."
    },
    {
      title: "The Illusion Golden Deer",
      target: "ರಾವಣನು ತನ್ನ ಸೋದರಮಾವ ಮಾರೀಚನನ್ನು ಸಹಾಯಕ್ಕಾಗಿ ಕರೆದನು. ಮಾರೀಚನು ಅಪೂರ್ವವಾದ ಬಂಗಾರದ ಜಿಂಕೆಯ ರೂಪವನ್ನು ಧರಿಸಿ ಪಂಚವಟಿಯ ಪರ್ಣಕುಟೀರದ ಮುಂದೆ ಕುಣಿದಾಡುತ್ತಾ ಸೀತೆಯ ಗಮನವನ್ನು ಸೆಳೆದನು.",
      english: "Ravana enlisted the help of his uncle Maricha, a demon with shape-shifting magic. Maricha assumed the form of a dazzling golden deer with spots of silver and sapphire. He wandered near Rama's cottage, catching the eye of Princess Sita, who was deeply enchanted by its beauty."
    },
    {
      title: "Rama Chases the Deer",
      target: "ಸೀತಾದೇವಿಯು ಆ ರಮಣೀಯ ಬಂಗಾರದ ಜಿಂಕೆಯನ್ನು ತಂದುಕೊಡುವಂತೆ ಪತಿಯಲ್ಲಿ ವಿನಂತಿಸಿದಳು. ಲಕ್ಷ್ಮಣನು ಇದು ರಾಕ್ಷಸರ ಮಾಯಾಜಾಲವಿರಬಹುದೆಂದು ಎಚ್ಚರಿಸಿದರೂ, ಸೀತೆಯ ಸಂತೋಷಕ್ಕಾಗಿ ಶ್ರೀರಾಮನು ಜಿಂಕೆಯನ್ನು ಹಿಡಿಯಲು ಕಾಡಿನೊಳಗೆ ಹೊರಟನು.",
      english: "Sita begged Rama to catch the golden deer for her, either alive or as a beautiful skin. Sensing danger, Lakshmana warned that it might be a demon in disguise. Rama, wanting to please Sita, instructed Lakshmana to guard Sita closely while he chased after the elusive deer."
    },
    {
      title: "The Cry of Counterfeit",
      target: "ರಾಮನು ಕಾಡಿನಲ್ಲಿ ಜಿಂಕೆಗೆ ಬಾಣ ಹೊಡೆದಾಗ, ಮಾರೀಚನು ಸಾಯುವ ಮುನ್ನ ರಾಮನ ಧ್ವನಿಯಲ್ಲಿ 'ಹಾ ಸೀತಾ, ಹಾ ಲಕ್ಷ್ಮಣ, ರಕ್ಷಿಸಿ' ಎಂದು ಜ್ಯೋರಾಗಿ ಕಿರುಚಿದನು. ಈ ಶಬ್ದವನ್ನು ಕೇಳಿ ಪಂಚವಟಿಯಲ್ಲಿದ್ದ ಸೀತೆಯು ತೀವ್ರ ಆತಂಕಕ್ಕೆ ಒಳಗಾದಳು.",
      english: "Rama chased the deer deep into the forest and finally shot it with a magical arrow. As Maricha lay dying, he shed his golden deer form and cried out loudly in Rama's exact voice: 'Oh Sita! Oh Lakshmana! Help me!', mimicking a cry of extreme agony that echoed back to the cottage."
    },
    {
      title: "Lakshmana Rekha Protection Circle",
      target: "ಸೀತೆಯ ಒತ್ತಾಯ ಮತ್ತು ಕಟು ನುಡಿಗಳಿಗೆ ಮಣಿದ ಲಕ್ಷ್ಮಣನು ಶ್ರೀರಾಮನ ಸಹಾಯಕ್ಕೆ ಧಾವಿಸಲು ಒಪ್ಪಿದನು. ಆದರೆ ಹೋಗುವ ಮುನ್ನ ಸುರಕ್ಷತೆಗಾಗಿ ಆಶ್ರಮದ ಸುತ್ತಲೂ ಒಂದು ಮಂತ್ರಶಕ್ತಿಯ ಗೆರೆಯನ್ನು (ಲಕ್ಷ್ಮಣ ರೇಖೆ) ಎಳೆದು, ಇದನ್ನು ದಾಟಬೇಡಿ ಎಂದು ಬೇಡಿಕೊಂಡನು.",
      english: "Terrified by the cry, Sita begged Lakshmana to go help her husband. Knowing Rama's unmatched power, Lakshmana hesitated, but when Sita accused him of bad intentions, he complied. Before departing, he drew a magical protection circle (Lakshmana Rekha) around the cottage, warning Sita not to cross it."
    },
    {
      title: "Abduction of Goddess Sita",
      target: "ಲಕ್ಷ್ಮಣನು ಹೋದ ಕೂಡಲೇ ರಾವಣನು ಸನ್ಯಾಸಿಯ ವೇಷ ಧರಿಸಿ ಭಿಕ್ಷೆಗಾಗಿ ಪರ್ಣಕುಟೀರದ ಮುಂದೆ ಬಂದನು. ಸೀತೆಯು ಆತನಿಗೆ ಆಹಾರ ನೀಡಲು ಲಕ್ಷ್ಮಣ ರೇಖೆಯನ್ನು ದಾಟಿದ ತಕ್ಷಣ, ರಾವಣನು ಅವಳನ್ನು ಬಲವಂತವಾಗಿ ತನ್ನ ಪುಷ್ಪಕ ವಿಮಾನದಲ್ಲಿ ಅಪಹರಿಸಿದನು.",
      english: "The moment Lakshmana left, Ravana approached the cottage disguised as a holy, thirsty Brahmin ascetic. He politely requested Sita for alms. Fearing to displease a holy guest, Sita stepped over the magical line to hand him food. Instantly, Ravana revealed his ten-headed monstrous form and flew away with her."
    },
    {
      title: "The Valiant Fight of Jatayu",
      target: "ಸೀತೆಯ ಆಕ್ರಂದನವನ್ನು ಕೇಳಿದ ಶೂರ ಜಟಾಯು ಹಕ್ಕಿಯು ರಾವಣನೊಡನೆ ಆಕಾಶದಲ್ಲಿ ಭೀಕರವಾಗಿ ಹೋರಾಡಿತು. ಅದು ರಾವಣನ ರಥವನ್ನು ಧ್ವಂಸಗೊಳಿಸಿತು. ಆದರೆ ರಾವಣನು ತನ್ನ ಖಡ್ಗದಿಂದ ಜಟಾಯುವಿನ ರೆಕ್ಕೆಗಳನ್ನು ಕತ್ತರಿಸಿ ಕೆಳಗೆ ಕೆಡವಿದನು.",
      english: "The old vulture king Jatayu heard Sita's cries for help and flew high into the sky to fight the demon king. Despite his advanced age, he fought fiercely, breaking Ravana's chariot and weapons. However, Ravana drew his sword and cut off Jatayu's wings, leaving him dying on the ground."
    },
    {
      title: "Grief of the Bereaved Rama",
      target: "ಪರ್ಣಕುಟೀರಕ್ಕೆ ಮರಳಿದ ರಾಮಲಕ್ಷ್ಮಣರು ಸೀತೆ ಇಲ್ಲದಿರುವುದನ್ನು ಕಂಡು ಆಘಾತಕ್ಕೊಳಗಾದರು. ಕಾಡಿನ ಗಿಡಮರಗಳನ್ನು ಪ್ರಶ್ನಿಸುತ್ತಾ ಸಾಗಿದ ಅವರಿಗೆ ರೆಕ್ಕೆ ಕತ್ತರಿಸಿದ್ದ ಜಟಾಯು ಸಿಕ್ಕಿ, ರಾವಣನು ದಕ್ಷಿಣದ ಕಡೆಗೆ ಸೀತೆಯನ್ನು ಒಯ್ದಿದ್ದಾನೆ ಎಂಬ ಮಾಹಿತಿ ನೀಡಿ ಪ್ರಾಣಬಿಟ್ಟಿತು.",
      english: "Rama and Lakshmana returned to find the cottage empty. Rama fell into deep grief, crying and asking the deer, trees, and rivers where his beloved Sita was. In their search, they found the dying Jatayu, who told them that Ravana had carried Sita south before breathing his last."
    },
    {
      title: "Meeting Sugriva and Hanuman",
      target: "ಅವರು ಸೀತೆಯನ್ನು ಹುಡುಕುತ್ತಾ ಹನುಮಂತನನ್ನು ಭೇಟಿಯಾದರು. ಹನುಮಂತನು ರಾಮನನ್ನು ತೇಜಸ್ವಿಯಾದ ಸುಗ್ರೀವನಿಗೆ ಪರಿಚಯಿಸಿದನು. ರಾಮ ಮತ್ತು ಸುಗ್ರೀವರು ಅಗ್ನಿಸಾಕ್ಷಿಯಾಗಿ ಸ್ನೇಹದ ಒಪ್ಪಂದವನ್ನು ಮಾಡಿಕೊಂಡು ಪರಸ್ಪರ ಸಹಾಯ ಮಾಡಲು ಶಪಥ ಮಾಡಿದರು.",
      english: "Searching southwards, they reached the Rishyamukha hills where they were met by Hanuman, the wise minister of the exiled monkey king Sugriva. Seeing Rama's divinity, Hanuman pledged his eternal devotion and introduced him to Sugriva. Rama and Sugriva made a holy fire alliance to help each other."
    },
    {
      title: "Slaying of Mighty Vali",
      target: "ಸುಗ್ರೀವನ ಬದ್ಧವೈರಿಯಾದ ವಾಲಿಯನ್ನು ಶ್ರೀರಾಮನು ಮರದ ಮರೆಯಿಂದ ಬಾಣ ಹೊಡೆದು ಸಂಹರಿಸಿದನು. ಬಳಿಕ ಸುಗ್ರೀವನಿಗೆ ಕಿಷ್ಕಿಂಧೆಯ ಪಟ್ಟಾಭಿಷೇಕ ಮಾಡಲಾಯಿತು. ಸುಗ್ರೀವನು ಸೀತೆಯ ಶೋಧಕ್ಕಾಗಿ ತನ್ನ ಅಪಾರ ವಾನರ ಸೈನ್ಯವನ್ನು ನಿಯೋಜಿಸಿದನು.",
      english: "Sugriva's brother Vali had usurped his kingdom and wife. To honor his promise, Rama stood behind a tree and shot a powerful arrow that defeated the invincible Vali in battle. Rama then crowned Sugriva as the king of Kishkindha, who promised his entire monkey army to find Sita."
    },
    {
      title: "Great Search for Sita",
      target: "ವಾನರ ಸೈನ್ಯವು ನಾಲ್ಕು ದಿಕ್ಕುಗಳಿಗೂ ಸೀತೆಯ ಶೋಧಕ್ಕೆ ಹೊರಟಿತು. ಅಂಗದ ಮತ್ತು ಹನುಮಂತನಿದ್ದ ದಕ್ಷಿಣ ತಂಡಕ್ಕೆ ಸಂಪಾತಿಯು ಸೀತೆಯು ನೂರು ಯೋಜನ ದೂರವಿರುವ ಲಂಕಾದಲ್ಲಿದ್ದಾಳೆ ಎಂದು ದೃಢಪಡಿಸಿದನು. ಆದರೆ ನೂರಾರು ಮೈಲು ಸಮುದ್ರ ದಾಟುವುದು ದೊಡ್ಡ ಸವಾಲಾಯಿತು.",
      english: "Sugriva dispatched massive search parties in all four directions. The southern search party, led by Prince Angada and including Hanuman and Jambavan, reached the vast ocean shore. There, they learned from Sampati, Jatayu's brother, that Sita was imprisoned in Lanka across the sea."
    },
    {
      title: "Hanuman's Mighty Ocean Leap",
      target: "ಜಾಂಬವಂತನು ಹನುಮಂತನಿಗೆ ಆತನ ದಿವ್ಯ ಶಕ್ತಿಗಳನ್ನು ನೆನಪಿಸಿದನು. ಹನುಮಂತನು ತನ್ನ ದೇಹವನ್ನು ಪರ್ವತದಂತೆ ದೊಡ್ಡದಾಗಿ ಬೆಳೆಸಿಕೊಂಡು, ಜೈ ಶ್ರೀರಾಮ್ ಎಂದು ಘರ್ಜಿಸುತ್ತಾ ವಿಶಾಲ ಸಾಗರವನ್ನು ಒಂದೇ ಜಿಗಿತದಲ್ಲಿ ದಾಟಿ ಲಂಕೆ ತಲುಪಿದನು.",
      english: "Knowing only Hanuman had the strength to cross the vast sea, Jambavan reminded him of his divine origin and powers. Hanuman expanded his size and leaped across the ocean with a loud roar, overcoming sea monsters like Surasa and Simhika to land on the golden shores of Lanka."
    },
    {
      title: "The Meeting in Ashoka Vatika",
      target: "ಹನುಮಂತನು ಸಣ್ಣ ರೂಪ ತಾಳಿ ಅಶೋಕವನದಲ್ಲಿ ದುಃಖಿಸುತ್ತಿದ್ದ ಸೀತಾದೇವಿಯನ್ನು ಪತ್ತೆಹಚ್ಚಿದನು. ಅವನು ರಾಮನ ಮಂಗಲಕರವಾದ ಉಂಗುರವನ್ನು ನೀಡಿ ಆಕೆಯ ನಂಬಿಕೆಯನ್ನು ಗಳಿಸಿದನು ಮತ್ತು ರಾಮನು ಶೀಘ್ರದಲ್ಲೇ ಬಂದು ಆಕೆಯನ್ನು ರಕ್ಷಿಸುತ್ತಾನೆ ಎಂದು ಸಾಂತ್ವನ ಹೇಳಿದನು.",
      english: "Spying undetected, Hanuman found Sita sitting under an Ashoka tree, guarded by terrifying demonesses. He waited until she was alone, then sang praises of Rama and softly threw Rama's signet ring to earn her trust. Tears of joy ran down Sita's face, knowing help was coming."
    },
    {
      title: "Burning of Golden Lanka",
      target: "ರಾವಣನ ಸಭೆಯಲ್ಲಿ ಹನುಮಂತನ ಬಾಲಕ್ಕೆ ಬೆಂಕಿ ಹಚ್ಚಲು ಆಜ್ಞಾಪಿಸಲಾಯಿತು. ಹನುಮಂತನು ತನ್ನ ಬಾಲದ ಬೆಂಕಿಯಿಂದ ಲಂಕೆಯ ಪ್ರತಿ ಅರಮನೆ ಹಾಗೂ ಗೋಪುರಗಳನ್ನು ಸುಟ್ಟು ಧ್ವಂಸಗೊಳಿಸಿದನು. ನಂತರ ಅವನು ಸಾಗರವನ್ನು ಮರಳಿ ದಾಟಿ ರಾಮನಿಗೆ ಶುಭ ಸುದ್ದಿ ತಿಳಿಸಿದನು.",
      english: "Captured by Ravana's soldiers, Hanuman was brought to the court where Ravana ordered his tail to be wrapped in cloth and set on fire. Hanuman used his flaming tail to leap from roof to roof, setting the entire golden city of Lanka ablaze in a terrifying inferno, before returning to Rama."
    },
    {
      title: "The Construction of Rama Setu",
      target: "ಲಂಕೆಯನ್ನು ತಲುಪಲು ವಾನರ ವೀರರಾದ ನಳ ಮತ್ತು ನೀಲರು ಸಮುದ್ರದ ಮೇಲೆ 'ರಾಮ ಸೇತು' ಸೇತುವೆಯನ್ನು ನಿರ್ಮಿಸಿದರು. ಪ್ರತಿಯೊಂದು ಕಲ್ಲಿನ ಮೇಲೆ ರಾಮನ ನಾಮವನ್ನು ಬರೆದಾಗ ಅವು ತೇಲತೊಡಗಿದವು. ಇಡೀ ವಾನರ ಸೇನೆ ಈ ಸೇತುವೆಯ ಮೂಲಕ ಯಶಸ್ವಿಯಾಗಿ ಲಂಕಾ ತಲುಪಿತು.",
      english: "Rama and the Vanara army marched to the ocean shore. To cross the deep waters, the architects Nala and Nila led the construction of a floating stone bridge, writing 'Rama' on the rocks, which miraculously floated. The army crossed the bridge to Lanka, prepared for the final battle."
    },
    {
      title: "The Victory and Coronation",
      target: "ಲಂಕೆಯಲ್ಲಿ ಭೀಕರ ಯುದ್ಧ ನಡೆದು, ಶ್ರೀರಾಮನು ವಿದ್ವಂಸಕ ಬ್ರಹ್ಮಾಸ್ತ್ರದಿಂದ ದಶಕಂಠ ರಾವಣನನ್ನು ಸಂಹರಿಸಿದನು. ಧರ್ಮಕ್ಕೆ ವಿಜಯ ಲಭಿಸಿತು. ಸೀತೆಯನ್ನು ರಕ್ಷಿಸಿ, ಪುಷ್ಪಕ ವಿಮಾನದಲ್ಲಿ ಅಯೋಧ್ಯೆಗೆ ಮರಳಿ ಶ್ರೀರಾಮನ ಭವ್ಯ ಪಟ್ಟಾಭಿಷೇಕ ನೆರವೇರಿ ಪ್ರಖ್ಯಾತ ರಾಮರಾಜ್ಯ ಸ್ಥಾಪನೆಯಾಯಿತು.",
      english: "A colossal battle ensued in Lanka. Guided by the Aditya Hridaya mantra, Rama shot a divine Brahmastra that destroyed the ten-headed demon Ravana. Rama rescued Sita, returned to Ayodhya in the flying Pushpaka Vimana, and was crowned king, ushering in the glorious era of Ramarajya."
    }
  ];

  const chapters = ramayanaChaptersData.map((chap, idx) => ({
    chapterNumber: idx + 1,
    chapterTitle: chap.title,
    textTarget: chap.target,
    textEnglish: chap.english
  }));

  return {
    id: "story-ramayana-50",
    title: "Ramayana: The Epic of Dharma",
    titleTranslation: "ರಾಮಾಯಣ: ಧರ್ಮದ ಮಹಾಕಾವ್ಯ",
    category: "History",
    language: "Kannada",
    readTime: "50 min read",
    rating: 4.98,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1608976472093-ae99975b9ca4?auto=format&fit=crop&q=80&w=400",
    description: "The timeless saga of Sri Rama, Sita, and Hanuman. This epic features 50 beautiful Kannada chapters tracking the legendary path of righteousness (Dharma).",
    chapters
  };
}

export const defaultStories: Story[] = [
  {
    id: "story-heritage-1-es",
    title: "Abuela's Mango Tree",
    titleTranslation: "El Árbol de Mango de la Abuela",
    category: "Heritage Tales",
    language: "Spanish",
    readTime: "5 min read",
    rating: 4.98,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=400",
    description: "Connect with ancestral roots through Abuela's magical mango tree in her backyard. Features line-by-line toggle translation and audio clips recorded by passionate student volunteers.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Golden Seed • La Semilla de Oro",
        textTarget: "Cuando la abuela cruzó la frontera hace muchos años, trajo una sola pequeña semilla de mango en su bolsillo.",
        textEnglish: "When Abuela crossed the border many years ago, she brought a single tiny mango seed in her pocket.",
        sentences: [
          {
            textTarget: "Cuando la abuela cruzó la frontera hace muchos años, trajo una sola pequeña semilla de mango en su bolsillo.",
            textEnglish: "When Abuela crossed the border many years ago, she brought a single tiny mango seed in her pocket.",
            audioId: "vol-es-01",
            volunteerName: "Elena Flores",
            volunteerRole: "Student Volunteer, UC Berkeley (Chicano Studies)",
            volunteerAvatar: "👧"
          },
          {
            textTarget: "A Leo le encantaba tocar su corteza rugosa, que le recordaba a la abuela su hogar de la infancia en Michoacán.",
            textEnglish: "Leo loved to touch its rough bark, which reminded Abuela of her childhood home in Michoacán.",
            audioId: "vol-es-02",
            volunteerName: "Elena Flores",
            volunteerRole: "Student Volunteer, UC Berkeley (Chicano Studies)",
            volunteerAvatar: "👧"
          },
          {
            textTarget: "En el cálido verano, su aroma dulce llenaba el patio de recuerdos dorados.",
            textEnglish: "In the warm summer, its sweet scent filled the backyard with golden memories.",
            audioId: "vol-es-03",
            volunteerName: "Mateo Ruiz",
            volunteerRole: "Student Volunteer, Stanford University",
            volunteerAvatar: "👦"
          }
        ]
      },
      {
        chapterNumber: 2,
        chapterTitle: "The Bridge of Words • El Puente de Palabras",
        textTarget: "Leo tenía problemas para hablar español en la escuela, pero la abuela le decía: 'Tus palabras del idioma natal son como ramas'.",
        textEnglish: "Leo had trouble speaking Spanish at school, but Abuela told him: 'Your mother tongue words are like branches.'",
        sentences: [
          {
            textTarget: "Leo tenía problemas para hablar español en la escuela, pero la abuela le decía: 'Tus palabras del idioma natal son como ramas'.",
            textEnglish: "Leo had trouble speaking Spanish at school, but Abuela told him: 'Your mother tongue words are like branches.'",
            audioId: "vol-es-04",
            volunteerName: "Sofia Martinez",
            volunteerRole: "Student Volunteer, UCLA Freshman",
            volunteerAvatar: "👩"
          },
          {
            textTarget: "'Cada palabra familiar que hablas te conecta con la tierra fértil de tus hermosos antepasados'.",
            textEnglish: "'Each family word you speak connects you to the fertile soil of your beautiful ancestors.'",
            audioId: "vol-es-05",
            volunteerName: "Sofia Martinez",
            volunteerRole: "Student Volunteer, UCLA Freshman",
            volunteerAvatar: "👩"
          },
          {
            textTarget: "'Nunca pierdas tu idioma de herencia, mi niño; es el puente eterno de tu corazón'.",
            textEnglish: "'Never lose your heritage language, my child; it is the eternal bridge of your heart.'",
            audioId: "vol-es-06",
            volunteerName: "Mateo Ruiz",
            volunteerRole: "Student Volunteer, Stanford University",
            volunteerAvatar: "👦"
          }
        ]
      }
    ]
  },
  {
    id: "story-heritage-2-kn",
    title: "Amma's Rangoli Colors",
    titleTranslation: "ಅಮ್ಮನ ರಂಗೋಲಿ ಬಣ್ಣಗಳು",
    category: "Heritage Tales",
    language: "Kannada",
    readTime: "5 min read",
    rating: 4.96,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1562153760-18e67f05f6c4?auto=format&fit=crop&q=80&w=400",
    description: "Follow young Diya as she discovers the beautiful stories hidden behind her mother's geometric sand Rangolis, preserving Karnataka heritage.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "Morning Sand Art • ಮುಂಜಾನೆಯ ಕಲೆ",
        textTarget: "ಪ್ರತಿ ದಿನ ಮುಂಜಾನೆ, ಅಮ್ಮ ಬಿಳಿ ಪುಡಿಯಿಂದ ಹೊಸ ಚಿತ್ತಾರಗಳನ್ನು ಆಕರ್ಷಕವಾಗಿ ಬಿಡಿಸುತ್ತಿದ್ದರು.",
        textEnglish: "Every morning, mother drew beautiful new patterns gracefully with white powder.",
        sentences: [
          {
            textTarget: "ಪ್ರತಿ ದಿನ ಮುಂಜಾನೆ, ಅಮ್ಮ ಬಿಳಿ ಪುಡಿಯಿಂದ ಹೊಸ ಚಿತ್ತಾರಗಳನ್ನು ಆಕರ್ಷಕವಾಗಿ ಬಿಡಿಸುತ್ತಿದ್ದರು.",
            textEnglish: "Every morning, mother drew beautiful new patterns gracefully with white powder.",
            audioId: "vol-kn-01",
          },
          {
            textTarget: "ದಿಯಾ ಅಮ್ಮನನ್ನು ಪ್ರೀತಿಯಿಂದ ಕೇಳಿದಳು: 'ಈ ರಂಗೋಲಿಯ ರಹಸ್ಯವೇನು?'",
            textEnglish: "Diya lovingly asked mother: 'What is the secret of this Rangoli?'",
            audioId: "vol-kn-02",
          },
          {
            textTarget: "ಅಮ್ಮ ನಗುತ್ತಾ ಹೇಳಿದರು: 'ಇದು ಕೇವಲ ಕಲೆಯಲ್ಲ, ನಮ್ಮ ಹಳೆಯ ನೆನಪುಗಳ ಕನ್ನಡಿ.'",
            textEnglish: "Mother smiled and said: 'This is not just art, it is the mirror of our ancient memories.'",
            audioId: "vol-kn-03",
          }
        ]
      }
    ]
  },
  generateKidsAdventure100Story(),
  generateKidsSpace100Story(),
  generateCosmic100Story(),
  generateFrench50Story(),
  generateRamayanaKannada50Story(),
  {
    id: "story-1",
    title: "The Lost Kingdom",
    titleTranslation: "El Reino Perdido",
    category: "Adventure",
    language: "English",
    readTime: "15 min read",
    rating: 4.8,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=400",
    description: "A young boy begins a journey to find the lost kingdom of his ancestors.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Hidden Map",
        textTarget: "Leo encontró un mapa antiguo en el ático de su abuelo.",
        textEnglish: "Leo found an old map in his grandfather's attic."
      },
      {
        chapterNumber: 2,
        chapterTitle: "The Whispering Trees",
        textTarget: "Los árboles del bosque parecían susurrar secretos de reyes antiguos.",
        textEnglish: "The trees of the forest seemed to whisper secrets of ancient kings."
      },
      {
        chapterNumber: 3,
        chapterTitle: "The Hidden Path",
        textTarget: "Siguiendo la misteriosa luz azul, descubrió el sendero de piedra oculto que ascendía hacia las ruinas flotantes.",
        textEnglish: "Following the mysterious blue light, he discovered the hidden stone path ascending towards the floating ruins."
      }
    ]
  },
  {
    id: "story-2",
    title: "The Wise Teacher",
    titleTranslation: "El Maestro Sabio",
    category: "Life Lessons",
    language: "English",
    readTime: "8 min read",
    rating: 4.7,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    description: "A short story about patience, kindness and the power of words.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Lesson begins",
        textTarget: "El anciano maestro de la colina enseñaba no con gritos, sino con el silencio de un lago calmo.",
        textEnglish: "The old teacher on the hill taught not with shouting, but with the silence of a calm lake."
      }
    ]
  },
  {
    id: "story-3",
    title: "The Clever Fox and the Crow",
    titleTranslation: "El Zorro Astuto y el Cuervo",
    category: "Folktales",
    language: "English",
    readTime: "6 min read",
    rating: 4.6,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=400",
    description: "A classic fable of wit, sweet words, and cautious trust.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "Flattery on high",
        textTarget: "Un cuervo negro sostenía un delicioso trozo de queso en lo alto de una rama fuerte.",
        textEnglish: "A black crow held a delicious piece of cheese high up on a strong branch."
      }
    ]
  },
  {
    id: "story-4",
    title: "The Magical Tree",
    titleTranslation: "El Árbol Mágico",
    category: "Fantasy",
    language: "English",
    readTime: "10 min read",
    rating: 4.9,
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=400",
    description: "A magical tree that grants wishes but with a twist.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "First Wish",
        textTarget: "El gran sauce de hojas de plata susurró: 'Pide solo lo que tu alma pueda compartir'.",
        textEnglish: "The great silver-leafed willow whispered: 'Ask only for what your soul can share.'"
      }
    ]
  },
  {
    id: "story-5",
    title: "The Little Prince",
    titleTranslation: "Le Petit Prince",
    category: "Fantasy",
    language: "French",
    readTime: "12 min read",
    rating: 4.9,
    coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400",
    description: "A timeless tale about love, friendship, and seeing with the heart.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Sahara Desert",
        textTarget: "J'ai ainsi vécu seul, sans personne avec qui parler véritablement.",
        textEnglish: "I lived like this searching alone, with no one to truly talk to."
      }
    ]
  },
  {
    id: "story-6",
    title: "The Fisherman and the Sea",
    titleTranslation: "El Pescador y el Mar",
    category: "Life Lessons",
    language: "English",
    readTime: "9 min read",
    rating: 4.6,
    coverUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=400",
    description: "A fisherman learns a valuable lesson from the vast and endless sea.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Great Tide",
        textTarget: "El viejo pescador confiaba en que cada tormenta guardaba un corazón de calma.",
        textEnglish: "The old fisherman trusted that every storm held a heart of calm."
      }
    ]
  },
  {
    id: "story-7",
    title: "The Secret of the Pyramids",
    titleTranslation: "El Secreto de las Pirámides",
    category: "Adventure",
    language: "English",
    readTime: "14 min read",
    rating: 4.7,
    coverUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=400",
    description: "An adventure that reveals the ancient secrets of Egypt.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Golden sands",
        textTarget: "Las arenas doradas custodiaban misterios que ni el tiempo pudo borrar.",
        textEnglish: "The golden sands guarded mysteries that not even time could erase."
      }
    ]
  },
  {
    id: "story-8",
    title: "The Invention of Edison",
    titleTranslation: "El Invento de Edison",
    category: "History",
    language: "English",
    readTime: "11 min read",
    rating: 4.8,
    coverUrl: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=400",
    description: "The inspiring story of how Edison never gave up on lighting the world.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "Unlocking Light",
        textTarget: "Cada intento fallido era un paso más cerca de encender la bombilla eterna.",
        textEnglish: "Each failed attempt was one step closer to turning on the eternal bulb."
      }
    ]
  },
  {
    id: "story-ger-1",
    title: "The Forest Guardian",
    titleTranslation: "Der Hüter des Waldes",
    category: "Fantasy",
    language: "German",
    readTime: "5 min read",
    rating: 4.85,
    coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400",
    description: "An enchanting tale about a forest spirit protecting the ancient Black Forest.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Ancient Oak",
        textTarget: "Der Hüter des Waldes wohnt in einer uralten Eiche tief im Schwarzwald.",
        textEnglish: "The guardian of the forest lives in an ancient oak tree deep in the Black Forest."
      },
      {
        chapterNumber: 2,
        chapterTitle: "A Soft Melody",
        textTarget: "Wenn der Wind durch die Blätter singt, lauschen alle Tiere seiner sanften Melodie.",
        textEnglish: "When the wind sings through the leaves, all animals listen to its gentle melody."
      }
    ]
  },
  {
    id: "story-jp-1",
    title: "The Moon Princess",
    titleTranslation: "竹取物語 (Kaguya-hime)",
    category: "Folktales",
    language: "Japanese",
    readTime: "7 min read",
    rating: 4.9,
    coverUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=400",
    description: "A traditional Japanese fable about Kaguya-hime, the mysterious girl born from bamboo.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Bamboo Cutter",
        textTarget: "ある日、おじいさんは竹林の中で光り輝く竹を見つけました。",
        textEnglish: "One day, an old man found a shining bamboo inside the bamboo grove."
      },
      {
        chapterNumber: 2,
        chapterTitle: "A Tiny Child",
        textTarget: "竹を切ると、中から小さくて愛らしい女の子が現れました。",
        textEnglish: "When he cut the bamboo, a tiny and lovely girl appeared from inside."
      }
    ]
  },
  {
    id: "story-kan-1",
    title: "The Golden Bird of Mysore",
    titleTranslation: "ಮೈಸೂರಿನ ಚಿನ್ನದ ಹಕ್ಕಿ",
    category: "Folktales",
    language: "Kannada",
    readTime: "6 min read",
    rating: 4.8,
    coverUrl: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=400",
    description: "A heartwarming regional folk legend about a golden bird that spread joy across Karnataka.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "The Royal Gardens",
        textTarget: "ಒಂದಾನೊಂದು ಕಾಲದಲ್ಲಿ, ಮೈಸೂರಿನ ಅರಮನೆಯಲ್ಲಿ ಒಂದು ಸುಂದರವಾದ ಚಿನ್ನದ ಹಕ್ಕಿ ವಾಸಿಸುತ್ತಿತ್ತು.",
        textEnglish: "Once upon a time, a beautiful golden bird lived in the palace of Mysore."
      },
      {
        chapterNumber: 2,
        chapterTitle: "Songs of Wisdom",
        textTarget: "ಅದರ ಮಧುರವಾದ ಹಾಡು ಕೇಳಲು ಇಡೀ ನಾಡಿನ ಜನರು ಉತ್ಸುಕರಾಗಿ ಬರುತ್ತಿದ್ದರು.",
        textEnglish: "People from all over the land eagerly came to listen to its sweet song."
      }
    ]
  },
  {
    id: "story-por-1",
    title: "The Golden Shore of Lisbon",
    titleTranslation: "A Costa de Ouro de Lisboa",
    category: "Adventure",
    language: "Portuguese",
    readTime: "8 min read",
    rating: 4.75,
    coverUrl: "https://images.unsplash.com/photo-1509840141072-04e127300def?auto=format&fit=crop&q=80&w=400",
    description: "Sail across the beautiful Atlantic waters and discover the secrets of the maritime explorers.",
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: "Sailing into the Sunset",
        textTarget: "O jovem marinheiro olhou para o vasto oceano Atlântico com sonhos de aventura.",
        textEnglish: "The young sailor looked at the vast Atlantic ocean with dreams of adventure."
      },
      {
        chapterNumber: 2,
        chapterTitle: "The Lighthouse of Hope",
        textTarget: "O farol na costa brilhava como uma estrela guia guiando os navios para a segurança.",
        textEnglish: "The lighthouse on the coast shone like a guiding star, steering ships to safety."
      }
    ]
  }
];

export const defaultTasks: ChallengeTask[] = [
  {
    id: "task-1",
    title: "Translate 10 Sentences",
    description: "Translate sentences from English to Spanish in the live translator.",
    xpReward: 50,
    progress: 7,
    total: 10,
    type: "translation",
  },
  {
    id: "task-2",
    title: "Chat for 5 Minutes",
    description: "Practice your conversation skills with the AI Language Partner.",
    xpReward: 40,
    progress: 3,
    total: 5,
    type: "chat",
  },
  {
    id: "task-3",
    title: "Learn 5 New Words",
    description: "Add and review new vocabulary items into your dictionary card index.",
    xpReward: 30,
    progress: 2,
    total: 5,
    type: "words",
  }
];

export const leaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Aarav", country: "India", xp: 2450, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" },
  { rank: 2, name: "Sophia", country: "Spain", xp: 2100, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
  { rank: 3, name: "Liam", country: "USA", xp: 1850, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
  { rank: 12, name: "You (Yash)", country: "India", xp: 720, isSelf: true, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" },
];

export const recentActivities: ActivityLog[] = [
  { id: "act-1", type: "story", title: "Read a story", detail: "Laid eyes on Chapter 3 of 'The Lost Kingdom'", timeAgo: "2h ago", xpGained: 20 },
  { id: "act-2", type: "challenge", title: "Completed challenge", detail: "Translated 10 sentences successfully", timeAgo: "1d ago", xpGained: 50 },
  { id: "act-3", type: "chat", title: "Chat conversation", detail: "Practiced Spanish triggers for 20 minutes with LingoBot", timeAgo: "2d ago", xpGained: 40 },
  { id: "act-4", type: "streak", title: "Day 12 streak", detail: "Maintained your perfect streak! You're on fire!", timeAgo: "2d ago", xpGained: 30 },
];

export const userLanguages: LanguageStatus[] = [
  { name: "English", level: "Native", percent: 100 },
  { name: "Spanish", level: "Intermediate", percent: 68 },
  { name: "French", level: "Beginner", percent: 35 },
  { name: "German", level: "Beginner", percent: 20 },
  { name: "Japanese", level: "Beginner", percent: 10 },
];

export const achievements = [
  { id: "ach-1", title: "First Steps", desc: "Read 1 story completely", count: "1 story", icon: "⭐" },
  { id: "ach-2", title: "Word Collector", desc: "Master 100 unique words", count: "100 words", icon: "📚" },
  { id: "ach-3", title: "Translator Pro", desc: "Successfully translate 100 entries", count: "50 translated", icon: "🌐" },
  { id: "ach-4", title: "Chat Master", desc: "Send 100 active messages", count: "100 sent", icon: "💬" },
  { id: "ach-5", title: "Streak Star", desc: "Maintain 10 days of continuous learning", count: "12 day streak", icon: "🔥" },
];
