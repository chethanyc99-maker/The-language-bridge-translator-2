import React, { useState } from "react";
import { Search, Star, Bookmark, Play, ArrowLeft, Volume2, Sparkles, Languages, RefreshCw, List, BookOpen, Compass, ChevronDown, Check, Plus, Columns, Trash2, Heart, Gift, BookMarked, HelpCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { defaultStories } from "../data";
import { Story } from "../types";

interface StoriesViewProps {
  onAddXP: (xpGained: number) => void;
  accentClass: string;
  onCompleteStory?: () => void;
  onProgressUpdate?: (percentage: number) => void;
}

export default function StoriesView({ onAddXP, accentClass, onCompleteStory, onProgressUpdate }: StoriesViewProps) {
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["story-1", "story-5"]);
  
  // Custom generated or custom modified stories list
  const [storiesList, setStoriesList] = useState<Story[]>(defaultStories);
  
  // Reading state
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showTranslations, setShowTranslations] = useState<{ [key: number]: boolean }>({});

  // Line-by-line bilingual digital storybook states
  const [readMode, setReadMode] = useState<"paragraph" | "lineByLine">("lineByLine");
  const [revealedSentences, setRevealedSentences] = useState<{ [key: string]: boolean }>({});
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [playingParagraph, setPlayingParagraph] = useState<boolean>(false);

  // --- NEW HERITAGE LEARNER SUITE STATES ---
  const [wordVaultOpen, setWordVaultOpen] = useState(false);
  const [wordCollectToast, setWordCollectToast] = useState<string | null>(null);
  const [collectedWords, setCollectedWords] = useState<{ target: string; english: string; language: string; emoji: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem("lb_word_vault");
      return saved ? JSON.parse(saved) : [
        { target: "Abuela", english: "Grandmother", language: "Spanish", emoji: "👵", date: "2026-05-22" },
        { target: "La semilla", english: "The seed", language: "Spanish", emoji: "🌱", date: "2026-05-22" },
        { target: "ರಂಗೋಲಿ (Rangoli)", english: "Sand art design", language: "Kannada", emoji: "🎨", date: "2026-05-22" }
      ];
    } catch (e) {
      return [];
    }
  });

  // Smart vocabulary matcher for pages
  const getSentenceKeywords = (textTarget: string, textEnglish: string, language: string) => {
    const textLow = textTarget.toLowerCase();
    const langLow = language.toLowerCase();
    const matches: { target: string; english: string; emoji: string }[] = [];
    
    if (langLow === "spanish") {
      if (textLow.includes("abuela")) matches.push({ target: "Abuela", english: "Grandmother", emoji: "👵" });
      if (textLow.includes("semill") || textLow.includes("semilla")) matches.push({ target: "La semilla", english: "The seed", emoji: "🌱" });
      if (textLow.includes("mango")) matches.push({ target: "El mango", english: "The mango", emoji: "🥭" });
      if (textLow.includes("bolsillo")) matches.push({ target: "El bolsillo", english: "The pocket", emoji: "👖" });
      if (textLow.includes("cortex") || textLow.includes("corteza")) matches.push({ target: "La corteza", english: "The bark", emoji: "🪵" });
      if (textLow.includes("palabra")) matches.push({ target: "La palabra", english: "The word", emoji: "🗣️" });
      if (textLow.includes("rama")) matches.push({ target: "La rama", english: "The branch", emoji: "🌿" });
      if (textLow.includes("puente")) matches.push({ target: "El puente", english: "The bridge", emoji: "🌉" });
      if (textLow.includes("corazón") || textLow.includes("corazon")) matches.push({ target: "El corazón", english: "The heart", emoji: "❤️" });
      if (textLow.includes("niño") || textLow.includes("niña") || textLow.includes("niños")) matches.push({ target: "Niño", english: "Child", emoji: "👦" });
      if (textLow.includes("frontera")) matches.push({ target: "La frontera", english: "The border", emoji: "🚧" });
      if (textLow.includes("casa") || textLow.includes("hogar")) matches.push({ target: "El hogar", english: "The home", emoji: "🏠" });
    } else if (langLow === "kannada") {
      if (textLow.includes("ಅಮ್ಮ") || textLow.includes("ಅಮ್ಮನ")) matches.push({ target: "Amma (ಅಮ್ಮ)", english: "Mother", emoji: "👩" });
      if (textLow.includes("ರಂಗೋಲಿ")) matches.push({ target: "Rangoli (ರಂಗೋಲಿ)", english: "Sand art design", emoji: "🎨" });
      if (textLow.includes("ಬಣ್ಣಗಳು")) matches.push({ target: "Bannagalu (ಬಣ್ಣಗಳು)", english: "Colors", emoji: "🎨" });
      if (textLow.includes("ಕಲೆ")) matches.push({ target: "Kale (ಕಲೆ)", english: "Art", emoji: "✨" });
      if (textLow.includes("ನೆನಪುಗಳು")) matches.push({ target: "Nenapugalu (ನೆನಪುಗಳು)", english: "Memories", emoji: "📸" });
      if (textLow.includes("ಕನ್ನಡಿ")) matches.push({ target: "Kannadi (ಕನ್ನಡಿ)", english: "Mirror", emoji: "🪞" });
      if (textLow.includes("ಮುಂಜಾನೆ")) matches.push({ target: "Munjane (ಮುಂಜಾನೆ)", english: "Early Morning", emoji: "🌅" });
    }

    if (matches.length === 0) {
      const tWords = textTarget.split(/\s+/).filter(w => w.length > 4);
      const eWords = textEnglish.split(/\s+/).filter(w => w.length > 4);
      if (tWords.length > 0 && eWords.length > 0) {
        matches.push({
          target: tWords[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""),
          english: eWords[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""),
          emoji: "✨"
        });
      }
    }
    return matches;
  };

  const handleCollectWord = (word: { target: string; english: string; emoji: string }, lang: string) => {
    const alreadyExists = collectedWords.some(w => w.target.toLowerCase() === word.target.toLowerCase() && w.language.toLowerCase() === lang.toLowerCase());
    if (alreadyExists) {
      alert(`"${word.target}" is already in your Heritage Notebook!`);
      return;
    }
    const newWord = {
      target: word.target,
      english: word.english,
      language: lang,
      emoji: word.emoji,
      date: new Date().toLocaleDateString()
    };
    const updated = [newWord, ...collectedWords];
    setCollectedWords(updated);
    localStorage.setItem("lb_word_vault", JSON.stringify(updated));
    onAddXP(15);
    setWordCollectToast(`Added "${word.target}" to your Heritage Word Vault! ✨ (+15 XP)`);
    setTimeout(() => setWordCollectToast(null), 3500);
  };

  const handleDeleteCollectedWord = (target: string, lang: string) => {
    const updated = collectedWords.filter(w => !(w.target.toLowerCase() === target.toLowerCase() && w.language.toLowerCase() === lang.toLowerCase()));
    setCollectedWords(updated);
    localStorage.setItem("lb_word_vault", JSON.stringify(updated));
  };

  // --- VOLUNTEER THANK YOU CARD STATE & FUNCTIONS ---
  const [volunteerThanksMap, setVolunteerThanksMap] = useState<{ [key: string]: number }>(() => {
    try {
      const saved = localStorage.getItem("lb_volunteer_thanks");
      return saved ? JSON.parse(saved) : { "Lucia Sanchez": 42, "Aarav Sharma": 18, "Yuki Tanaka": 29, "Lucas Dubois": 14 };
    } catch (e) {
      return {};
    }
  });

  const [thankYouRecipient, setThankYouRecipient] = useState<{ name: string; role: string; avatar: string } | null>(null);
  const [selectedSticker, setSelectedSticker] = useState("🧸");
  const [appreciateMessage, setAppreciateMessage] = useState("Your pronunciation was so comforting and clear!");
  const [appreciationSent, setAppreciationSent] = useState(false);

  const handleSendAppreciation = () => {
    if (!thankYouRecipient) return;
    const count = volunteerThanksMap[thankYouRecipient.name] || 0;
    const updatedThanks = { ...volunteerThanksMap, [thankYouRecipient.name]: count + 1 };
    setVolunteerThanksMap(updatedThanks);
    localStorage.setItem("lb_volunteer_thanks", JSON.stringify(updatedThanks));
    
    setAppreciationSent(true);
    onAddXP(20); // reward kind kids for thanking volunteer!
    
    setTimeout(() => {
      setThankYouRecipient(null);
      setAppreciationSent(false);
    }, 2500);
  };

  // --- VOCABULARY MATCH MATCH GAME STATE IN DRAWER ---
  const [gameActive, setGameActive] = useState(false);
  const [gameQuestion, setGameQuestion] = useState<{ q: string; correct: string; options: string[]; emoji: string } | null>(null);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  const handleStartVocabGame = () => {
    if (collectedWords.length < 3) {
      alert("You need at least 3 collected words in your vault to play the matching mini-game!");
      return;
    }
    const idx = Math.floor(Math.random() * collectedWords.length);
    const correctWord = collectedWords[idx];
    
    const otherWords = collectedWords.filter((_, i) => i !== idx);
    const wrongs = otherWords.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const options = [correctWord.english, ...wrongs.map(w => w.english)].sort(() => 0.5 - Math.random());
    setGameQuestion({
      q: correctWord.target,
      correct: correctWord.english,
      options,
      emoji: correctWord.emoji
    });
    setGameFeedback(null);
    setGameActive(true);
  };

  const handleAnswerGame = (answer: string) => {
    if (!gameQuestion) return;
    if (answer === gameQuestion.correct) {
      setGameFeedback("Correct! 🎉 +10 XP!");
      onAddXP(10);
    } else {
      setGameFeedback(`Oops! "${gameQuestion.q}" actually means "${gameQuestion.correct}". Try another one! 🌟`);
    }
  };
  // --- END NEW HERITAGE LEARNER SUITE INTEGRATION ---

  const getChapterSentences = (chapter: any) => {
    if (chapter.sentences && chapter.sentences.length > 0) {
      return chapter.sentences;
    }
    // Auto splits sentences for general default and AI books so any story is an interactive bilingual book
    const targets = chapter.textTarget.split(/(?<=[.!?])\s+/).filter(Boolean);
    const englishes = chapter.textEnglish.split(/(?<=[.!?])\s+/).filter(Boolean);
    
    const randomVolunteers = [
      { name: "Lucia Sanchez", role: "Student Volunteer, UT Austin (Chicano Studies)", avatar: "👩‍🎓" },
      { name: "Aarav Sharma", role: "Student Volunteer, Delhi University", avatar: "👨‍🎓" },
      { name: "Yuki Tanaka", role: "Student Volunteer, Waseda University", avatar: "👩‍💻" },
      { name: "Lucas Dubois", role: "Student Volunteer, Sorbonne", avatar: "👨‍🏫" }
    ];

    return targets.map((target: string, index: number) => {
      const vol = randomVolunteers[(index + chapter.chapterNumber) % randomVolunteers.length];
      return {
        textTarget: target,
        textEnglish: englishes[index] || chapter.textEnglish,
        audioId: `auto-${chapter.chapterNumber}-${index}`,
        volunteerName: vol.name,
        volunteerRole: vol.role,
        volunteerAvatar: vol.avatar
      };
    });
  };

  const handlePlaySentenceAudio = (sentenceText: string, langName: string, audioId: string) => {
    if (!window.speechSynthesis) {
      alert("Audio narration playback is not supported on this browser.");
      return;
    }
    
    window.speechSynthesis.cancel();
    
    if (playingSentenceId === audioId) {
      setPlayingSentenceId(null);
      return;
    }

    setPlayingSentenceId(audioId);
    
    const utterance = new SpeechSynthesisUtterance(sentenceText);
    const langLow = langName.toLowerCase();
    if (langLow === "spanish") utterance.lang = "es-ES";
    else if (langLow === "french") utterance.lang = "fr-FR";
    else if (langLow === "kannada") utterance.lang = "kn-IN";
    else if (langLow === "hindi") utterance.lang = "hi-IN";
    else if (langLow === "japanese") utterance.lang = "ja-JP";
    else if (langLow === "german") utterance.lang = "de-DE";
    else if (langLow === "portuguese") utterance.lang = "pt-PT";
    else utterance.lang = "en-US";

    utterance.rate = playbackSpeed;
    utterance.pitch = 1.1; // comforting child/student pitch

    utterance.onend = () => {
      setPlayingSentenceId(null);
      onAddXP(2); // Reward children for active listening

      if (autoAdvance) {
        const sentences = getChapterSentences(activeStory?.chapters[activeChapterIndex]);
        const lastSentence = sentences[sentences.length - 1];
        if (lastSentence && lastSentence.audioId === audioId) {
          // This is the last sentence of this page! Automatically transition to next page
          if (activeStory && activeChapterIndex < activeStory.chapters.length - 1) {
            // Give a 1.5s reading pause so it's not jarring
            setTimeout(() => {
              const nextIndex = activeChapterIndex + 1;
              handlePageChange(nextIndex);
              onAddXP(10); // Page complete award
              if (onProgressUpdate) {
                const percentage = Math.round((nextIndex / activeStory.chapters.length) * 100);
                onProgressUpdate(percentage);
              }
            }, 1500);
          } else if (activeStory) {
            // Completed last page of story!
            setTimeout(() => {
              alert(`🎉 Congratulations! You have successfully completed reading the epic tale '${activeStory.title}'! Earn +100 XP bonus!`);
              if (onCompleteStory) {
                onCompleteStory();
              } else {
                onAddXP(100);
              }
              setActiveStory(null);
            }, 1500);
          }
        }
      }
    };

    utterance.onerror = () => {
      setPlayingSentenceId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Long book UI states
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [tocGroupTab, setTocGroupTab] = useState(0); // 0 => 1-20, 1 => 21-40 ...
  const [resumeNotification, setResumeNotification] = useState<string | null>(null);

  // AI Story Generator panel states
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenre, setAiGenre] = useState("Adventure");
  const [aiTargetLanguage, setAiTargetLanguage] = useState("Spanish");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  // Default fallback genres list
  const categories = ["All Genres", "Kids", "Adventure", "Fantasy", "Folktales", "Life Lessons", "Science", "History"];

  const handleOpenStory = (story: Story) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingSentenceId(null);
    setPlayingParagraph(false);
    setRevealedSentences({});
    setActiveStory(story);
    setShowTranslations({});
    setShowTableOfContents(false);
    setTocGroupTab(0);

    const savedIndex = localStorage.getItem(`story-progress-${story.id}`);
    if (savedIndex) {
      const idx = parseInt(savedIndex, 10);
      if (idx > 0 && idx < story.chapters.length) {
        setActiveChapterIndex(idx);
        // Show a brief resume notification 
        setResumeNotification(`Resumed reading where you left off (Page ${idx + 1})`);
        setTimeout(() => setResumeNotification(null), 4000);
        return;
      }
    }
    setActiveChapterIndex(0);
    setResumeNotification(null);
  };

  const handlePageChange = (index: number) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingSentenceId(null);
    setPlayingParagraph(false);
    if (activeStory && index >= 0 && index < activeStory.chapters.length) {
      setActiveChapterIndex(index);
      localStorage.setItem(`story-progress-${activeStory.id}`, index.toString());
    }
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(x => x !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleDeleteStory = (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStoriesList(storiesList.filter(s => s.id !== storyId));
    if (activeStory && activeStory.id === storyId) {
      setActiveStory(null);
    }
  };

  const handleSpeakText = (text: string, langCode: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    
    if (playingParagraph) {
      window.speechSynthesis.cancel();
      setPlayingParagraph(false);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingParagraph(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    
    // Choose voice matching langCode
    if (langCode === "es") utterance.lang = "es-ES";
    else if (langCode === "hi") utterance.lang = "hi-IN";
    else if (langCode === "kn") utterance.lang = "kn-IN";
    else if (langCode === "fr") utterance.lang = "fr-FR";
    else if (langCode === "ja") utterance.lang = "ja-JP";
    else if (langCode === "de") utterance.lang = "de-DE";
    else if (langCode === "pt") utterance.lang = "pt-PT";
    else utterance.lang = "en-US";

    utterance.onend = () => {
      setPlayingParagraph(false);
      onAddXP(5); // Reward for reading whole page

      if (autoAdvance) {
        if (activeStory && activeChapterIndex < activeStory.chapters.length - 1) {
          setTimeout(() => {
            const nextIndex = activeChapterIndex + 1;
            handlePageChange(nextIndex);
            onAddXP(10);
            if (onProgressUpdate) {
              const percentage = Math.round((nextIndex / activeStory.chapters.length) * 100);
              onProgressUpdate(percentage);
            }
          }, 1500);
        } else if (activeStory) {
          setTimeout(() => {
            alert(`🎉 Congratulations! You have successfully completed reading the epic tale '${activeStory.title}'! Earn +100 XP bonus!`);
            if (onCompleteStory) {
              onCompleteStory();
            } else {
              onAddXP(100);
            }
            setActiveStory(null);
          }, 1500);
        }
      }
    };

    utterance.onerror = () => {
      setPlayingParagraph(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // call back for generating custom stories via Express API route proxies server-side Gemini!
  const handleGenerateAIStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      setGenerationError("Please describe a topic or prompt for the story.");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          genre: aiGenre,
          targetLanguage: aiTargetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story from server.");
      }

      const generatedData = await response.json();
      
      const newStory: Story = {
        id: `custom-${Date.now()}`,
        title: generatedData.title || "Custom AI Story",
        titleTranslation: generatedData.titleTranslation || "Historia Personalizada",
        category: aiGenre,
        language: aiTargetLanguage,
        readTime: "5 min read",
        rating: 5.0,
        featured: true,
        coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=350",
        description: `An original AI-generated tale in English and ${aiTargetLanguage}.`,
        chapters: generatedData.chapters || [],
        isFallback: !!generatedData.isFallback,
        isQuotaExceeded: !!generatedData.isQuotaExceeded
      };

      setStoriesList([newStory, ...storiesList]);
      // Immediately open reading room
      setActiveStory(newStory);
      setActiveChapterIndex(0);
      setShowTranslations({});
      setShowAIGenerator(false);
      setAiTopic("");
      onAddXP(50); // reward user for generating custom learning content!
    } catch (err: any) {
      console.error(err);
      setGenerationError("Error accessing the Gemini Storyteller service. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Dynamically extract unique genres and target languages from live list
  const availableGenres = ["All Genres", ...Array.from(new Set(storiesList.map(s => s.category).filter(Boolean)))];
  const availableLanguages = ["All Languages", ...Array.from(new Set(storiesList.map(s => s.language).filter(Boolean)))];

  // Filter logic
  const filteredStories = storiesList.filter(s => {
    const matchesGenre = selectedGenre === "All Genres" || s.category === selectedGenre;
    const matchesLanguage = selectedLanguage === "All Languages" || s.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchesSearch = s.title.toLowerCase().includes(searchPhrase.toLowerCase()) || 
                          (s.titleTranslation && s.titleTranslation.toLowerCase().includes(searchPhrase.toLowerCase())) ||
                          s.description?.toLowerCase().includes(searchPhrase.toLowerCase());
    return matchesGenre && matchesLanguage && matchesSearch;
  });

  const featuredStories = filteredStories.filter(s => s.featured);

  return (
    <div className="space-y-6 text-white font-sans text-left selection:bg-purple-600">
      
      {/* FULL STORY READER VIEWER ROOM */}
      {activeStory ? (
        <div className="bg-[#0b0c24] border border-white/15 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative max-w-4xl mx-auto">
          
          {/* Header controls inside reading room */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4 gap-2">
            <button
              onClick={() => setActiveStory(null)}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-[#121435] border border-white/5 rounded-xl px-3 py-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Library</span>
            </button>
            <div className="text-center flex-1 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                {activeStory.category} • Practicing {activeStory.language}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-300 line-clamp-1">{activeStory.title}</h3>
            </div>
            
            <button
              onClick={() => setShowTableOfContents(!showTableOfContents)}
              className={`text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold border transition-colors cursor-pointer ${
                showTableOfContents 
                  ? "bg-purple-600 border-purple-500 text-white" 
                  : "bg-[#121435] border-white/5 text-slate-300 hover:border-white/10"
              }`}
              title="Table of Contents"
            >
              <List className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Chapters</span>
              <span className="inline sm:hidden">Index</span>
            </button>
          </div>

          {/* Quick reading spot resume banner */}
          {resumeNotification && (
            <div className="bg-purple-600/15 border border-purple-500/25 px-4 py-2.5 rounded-xl text-xs text-purple-300 flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 animate-pulse text-purple-400" />
                <span>{resumeNotification}</span>
              </span>
              <button onClick={() => setResumeNotification(null)} className="text-[10px] text-slate-400 hover:text-white font-bold px-1 py-0.5">✕</button>
            </div>
          )}

          {/* Table of Contents / Quick Chapters Navigator Drawer */}
          {showTableOfContents && (
            <div className="bg-[#11122a] border border-white/10 rounded-2xl p-4 md:p-5 space-y-4 animate-slideDown">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-white/5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <List className="w-4 h-4 text-purple-400" />
                  <span>Interactive Chapter Navigator</span>
                </h4>
                <div className="text-[10px] text-cyan-400 font-mono">
                  Book Progress: {Math.round(((activeChapterIndex + 1) / activeStory.chapters.length) * 100)}% ({activeChapterIndex + 1} / {activeStory.chapters.length} Pages)
                </div>
              </div>

              {/* Tab navigation for multi-chapter long books like 50 or 100 pages */}
              {activeStory.chapters.length > 20 && (
                <div className="space-y-1.5">
                  <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Jump to section:</div>
                  <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin">
                    {Array.from({ length: Math.ceil(activeStory.chapters.length / 20) }).map((_, idx) => {
                      const start = idx * 20 + 1;
                      const end = Math.min((idx + 1) * 20, activeStory.chapters.length);
                      const isActive = tocGroupTab === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTocGroupTab(idx)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                            isActive 
                              ? "bg-purple-605 text-white font-extrabold shadow-md bg-purple-600" 
                              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                          }`}
                        >
                          Pages {start}-{end}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grid of Chapter selections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {activeStory.chapters
                  .map((ch, idx) => ({ ...ch, idx }))
                  .filter(({ idx }) => {
                    if (activeStory.chapters.length <= 20) return true;
                    const minRange = tocGroupTab * 20;
                    const maxRange = (tocGroupTab + 1) * 20;
                    return idx >= minRange && idx < maxRange;
                  })
                  .map(({ chapterTitle, chapterNumber, textEnglish, idx }) => {
                    const isCurrent = activeChapterIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          handlePageChange(idx);
                          setShowTableOfContents(false);
                          onAddXP(5);
                        }}
                        className={`p-2.5 text-left rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                          isCurrent 
                            ? "bg-purple-600/20 border-purple-500 text-white shadow-sm shadow-purple-500/10" 
                            : "bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10 text-slate-300"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${isCurrent ? "bg-purple-600 text-white" : "bg-white/5 text-slate-400"}`}>
                          {idx + 1}
                        </span>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold truncate text-white block leading-tight">{chapterTitle || `Page ${idx + 1}`}</p>
                          <p className="text-[9px] text-slate-400 truncate mt-1 italic">{textEnglish}</p>
                        </div>
                      </button>
                    );
                  })}
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setShowTableOfContents(false)}
                  className="text-[10px] font-bold bg-[#1b1c3c] hover:bg-[#252755] border border-white/10 px-4 py-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                >
                  Close Document Outline
                </button>
              </div>
            </div>
          )}

          {/* Reading Screen Book Content */}
          <div className="space-y-6 py-2">
            
            {/* Realtime progress micro bars */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>PROGRESS OVERVIEW</span>
                <span>PAGE {activeChapterIndex + 1} OF {activeStory.chapters.length} ({Math.round(((activeChapterIndex + 1) / activeStory.chapters.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-800/60 rounded-full h-2 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${((activeChapterIndex + 1) / activeStory.chapters.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {activeStory.title}
              </h1>
              {activeStory.titleTranslation && (
                <p className="text-base sm:text-lg italic text-indigo-400 font-medium leading-relaxed">
                  {activeStory.titleTranslation}
                </p>
              )}
              {activeStory.isQuotaExceeded ? (
                <div className="max-w-md mx-auto p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px]  flex gap-1.5 items-center justify-center mt-2 animate-pulse">
                  <span>⚡</span>
                  <span>AI Quota Cooldown: A simulated fallback story has been generated seamlessly.</span>
                </div>
              ) : activeStory.isFallback ? (
                <div className="max-w-md mx-auto p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-[11px] flex gap-1.5 items-center justify-center mt-2">
                  <span>💡</span>
                  <span>Loaded High-Fidelity Simulated story smoothly.</span>
                </div>
              ) : null}
            </div>

            {/* Showcase Page Image */}
            <div className="w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden relative shadow-lg">
              <img
                src={activeStory.coverUrl}
                alt="Story segment illustration"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              {/* Bottom badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 tracking-wider">
                    CHAPITRE • CHAPTER {activeChapterIndex + 1} OF {activeStory.chapters.length}
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5">
                    {activeStory.chapters[activeChapterIndex]?.chapterTitle || `Page ${activeChapterIndex + 1}`}
                  </p>
                </div>
                <div className="bg-black/60 px-2 rounded-lg py-1 border border-white/5 text-[9px] font-mono text-cyan-400">
                  {activeStory.language} Practice
                </div>
              </div>
            </div>

            {/* Page Dragger Slider Scrub Bar (Highly useful for 50 or 100 pages!) */}
            {activeStory.chapters.length > 5 && (
              <div className="bg-[#11122a] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Reader Slider</span>
                  </span>
                  <span className="font-mono text-cyan-400">Select Page: {activeChapterIndex + 1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">Pg 1</span>
                  <input
                    type="range"
                    min="0"
                    max={activeStory.chapters.length - 1}
                    value={activeChapterIndex}
                    onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
                    className="flex-1 accent-purple-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">Pg {activeStory.chapters.length}</span>
                </div>
              </div>
            )}

            {/* Reading Mode Selector & Active Tools Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-900/60 rounded-2xl border border-white/5 gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Storybook reading mode:</span>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setReadMode("lineByLine")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    readMode === "lineByLine"
                      ? "bg-purple-650 text-white shadow-md font-extrabold bg-purple-600"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-purple-300" />
                  <span>Line-by-Line</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReadMode("paragraph")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    readMode === "paragraph"
                      ? "bg-purple-650 text-white shadow-md font-extrabold bg-purple-600"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5 text-purple-300" />
                  <span>Full Paragraph</span>
                </button>
              </div>
            </div>

            {/* Autoplay & Audio Settings Panel - Works in both Reading Modes! */}
            <div className="bg-[#121334]/95 border border-white/10 p-4 rounded-2xl flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 text-cyan-400 ${playingSentenceId || playingParagraph ? "animate-spin" : ""}`} />
                  <span className="text-[11px] font-bold text-slate-350 uppercase tracking-widest">Storyteller Audio Assistant</span>
                </div>
                
                {/* Auto turn toggle control */}
                <button
                  type="button"
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    autoAdvance
                      ? "bg-[#1f1e4d] border-cyan-500/40 text-cyan-400"
                      : "bg-[#181930] border-white/5 text-slate-450"
                  }`}
                  title="Automatically changes page when narrative audio finishes"
                >
                  <span className="relative flex h-2 w-2">
                    {autoAdvance && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${autoAdvance ? "bg-cyan-400" : "bg-slate-500"}`}></span>
                  </span>
                  <span>Auto-Advance Pages: {autoAdvance ? "ON (Hands-Free) 🚀" : "OFF (Manual) ⏸️"}</span>
                </button>
              </div>

              {/* Slider for Speed Control & Helper Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-grow">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                    ⏱️ Narration Speed:
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.05"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="accent-cyan-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer flex-grow"
                  />
                  <span className="text-xs font-mono text-cyan-300 font-bold shrink-0">{playbackSpeed.toFixed(2)}x</span>
                  <span className="text-[10px] bg-cyan-900/40 text-cyan-400 px-1.5 py-0.5 rounded font-bold">
                    {playbackSpeed <= 0.85 ? "Kids Friendly 🐢" : "Normal ⚡"}
                  </span>
                </div>

                {/* Quick actions line translations */}
                {readMode === "lineByLine" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const allSents = getChapterSentences(activeStory.chapters[activeChapterIndex]);
                        const newRevealed: { [key: string]: boolean } = {};
                        allSents.forEach((s: any) => {
                          newRevealed[s.audioId] = true;
                        });
                        setRevealedSentences(newRevealed);
                        onAddXP(5);
                      }}
                      className="text-[10px] font-bold bg-[#1d1e4e] hover:bg-[#252762] text-purple-300 px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer"
                    >
                      📖 Show All English
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevealedSentences({})}
                      className="text-[10px] font-bold bg-[#1d1e4e] hover:bg-[#252762] text-slate-300 px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer"
                    >
                      🙈 Hide All Translations
                    </button>
                  </div>
                )}
              </div>
            </div>

            {readMode === "lineByLine" ? (
              <div className="space-y-4">
                
                {/* Special Immigrant Heritage Badge notification */}
                {activeStory.id.includes("heritage") && (
                  <div className="bg-[#121c42] border border-cyan-500/20 p-3 rounded-xl flex items-start gap-2.5">
                    <span className="text-lg">❤️</span>
                    <div className="text-left">
                      <h5 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Student Volunteer Collaboration</h5>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        To protect heritage languages in immigrant families, these stories are recorded line-by-line by student volunteers. Click on any line below to listen!
                      </p>
                    </div>
                  </div>
                )}

                {/* Render sentences list */}
                <div className="space-y-3.5">
                  {getChapterSentences(activeStory.chapters[activeChapterIndex]).map((sentence: any, sIdx: number) => {
                    const isRevealed = revealedSentences[sentence.audioId] || false;
                    const isPlaying = playingSentenceId === sentence.audioId;

                    return (
                      <div 
                        key={sIdx} 
                        className={`p-4 rounded-xl border transition-all text-left space-y-3 ${
                          isPlaying 
                            ? "bg-purple-950/20 border-purple-500 shadow-md shadow-purple-500/10" 
                            : "bg-[#11122a] border-white/5 hover:border-slate-800"
                        }`}
                      >
                        {/* Audio / Volunteer row */}
                        <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base shrink-0">{sentence.volunteerAvatar || "👤"}</span>
                            <div className="text-left font-mono">
                              <p className="text-[11px] font-bold text-slate-200 leading-none">
                                {sentence.volunteerName || "Student Volunteer"}
                              </p>
                              <p className="text-[9px] text-slate-400 mt-1 leading-none">
                                {sentence.volunteerRole || "Language Ambassador"}
                              </p>
                            </div>
                          </div>

                          {/* Controls buttons */}
                          <div className="flex items-center gap-1.5">
                            {isPlaying && (
                              <div className="flex items-center gap-0.5 px-2 bg-purple-900/30 text-purple-400 rounded-md py-0.5 font-mono text-[9px] font-bold">
                                <span className="w-1 h-1 rounded-full bg-purple-400 animate-ping mr-1"></span>
                                PLAYING
                              </div>
                            )}

                            {/* Send Thank-You Card */}
                            {sentence.volunteerName && (
                              <button
                                type="button"
                                onClick={() => setThankYouRecipient({
                                  name: sentence.volunteerName,
                                  role: sentence.volunteerRole || "Language Ambassador",
                                  avatar: sentence.volunteerAvatar || "👩‍🎓"
                                })}
                                className="p-1.5 rounded-lg border border-pink-500/15 text-pink-400 bg-pink-950/25 hover:bg-pink-900/30 hover:border-pink-500/30 text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer"
                                title={`Send custom thank-you card to ${sentence.volunteerName}`}
                              >
                                <Heart className="w-3 h-3 text-pink-400 fill-pink-400 font-bold" />
                                <span className="hidden md:inline text-[9px]">
                                  Thank ({volunteerThanksMap[sentence.volunteerName] || 0})
                                </span>
                              </button>
                            )}

                            {/* Listen Button */}
                            <button
                              type="button"
                              onClick={() => handlePlaySentenceAudio(sentence.textTarget, activeStory.language, sentence.audioId)}
                              className={`p-1.5 rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                isPlaying
                                  ? "bg-purple-600 border-purple-500 text-white"
                                  : "bg-white/5 border-white/5 text-cyan-400 hover:bg-cyan-950/20 hover:border-cyan-500/20"
                              }`}
                              title={isPlaying ? "Stop audio" : "Play sentence recording"}
                            >
                              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? "animate-bounce text-white" : "text-cyan-400"}`} />
                              <span className="text-[10px] font-bold hidden sm:inline text-cyan-300">
                                {isPlaying ? "Stop" : "Listen"}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Text display */}
                        <div className="space-y-2">
                          {/* Heritage Language / Target Language */}
                          <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed font-sans">
                            {sentence.textTarget}
                          </p>

                          {/* Toggle / Reveal translation */}
                          <div className="pt-2 border-t border-dashed border-white/5 text-left">
                            {isRevealed ? (
                              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 flex items-start gap-2 relative">
                                <span className="text-[9px] bg-purple-900/40 text-purple-300 font-mono font-bold px-1 py-0.5 rounded uppercase shrink-0 mt-0.5">Translation</span>
                                <p className="text-xs sm:text-sm text-slate-300 italic flex-1 pl-1">
                                  {sentence.textEnglish}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setRevealedSentences(prev => ({...prev, [sentence.audioId]: false}))}
                                  className="text-[10px] text-slate-500 hover:text-slate-300 ml-1 font-bold bg-white/5 hover:bg-white/15 rounded-md w-4 h-4 flex items-center justify-center cursor-pointer"
                                  title="Hide translation"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setRevealedSentences(prev => ({...prev, [sentence.audioId]: true}))}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                              >
                                🔍 Learn meaning (Reveal English Translation)
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Word Collector Tokens */}
                        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1 select-none">
                            <BookMarked className="w-3 h-3 text-cyan-300 shrink-0" /> Word Collector:
                          </span>
                          {getSentenceKeywords(sentence.textTarget, sentence.textEnglish, activeStory.language).map((word, wIdx) => {
                            const isSaved = collectedWords.some(
                              (w) => w.target.toLowerCase() === word.target.toLowerCase() && w.language.toLowerCase() === activeStory.language.toLowerCase()
                            );
                            return (
                              <button
                                key={wIdx}
                                type="button"
                                onClick={() => handleCollectWord(word, activeStory.language)}
                                className={`px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                  isSaved
                                    ? "bg-cyan-950/20 border-cyan-500/35 text-cyan-400"
                                    : "bg-[#161730] border-white/5 text-slate-300 hover:border-cyan-500/20 hover:text-cyan-400"
                                }`}
                              >
                                <span>{word.emoji}</span>
                                <span>{word.target}</span>
                                <span className="text-slate-500 font-normal">({word.english})</span>
                                {isSaved ? (
                                  <Check className="w-2.5 h-2.5 text-cyan-400" />
                                ) : (
                                  <Plus className="w-2.5 h-2.5 text-cyan-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              /* CLASSIC FULL PARAGRAPH MODE */
              <div className="space-y-6 bg-[#11122a] border border-white/5 p-5 md:p-6 rounded-2xl hover:border-indigo-400/20 transition-all">
                
                {/* Section 1: Target Language Paragraph */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Learning Language</span>
                    </span>
                    
                    {/* Speech button client native synthesis */}
                    <button
                      onClick={() => {
                        const languageLow = activeStory.language.toLowerCase();
                        const code = languageLow === "french" ? "fr" 
                          : languageLow === "hindi" ? "hi" 
                          : languageLow === "kannada" ? "kn" 
                          : languageLow === "german" ? "de" 
                          : languageLow === "japanese" ? "ja" 
                          : languageLow === "portuguese" ? "pt" 
                          : "es";
                        handleSpeakText(activeStory.chapters[activeChapterIndex]?.textTarget || "", code);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
                      title="Listen pronunciation"
                    >
                      <Volume2 className="w-4 h-4 text-cyan-300" />
                    </button>
                  </div>

                  <p className="text-lg sm:text-xl leading-relaxed text-slate-100 font-medium font-sans antialiased text-left selection:bg-purple-650">
                    {activeStory.chapters[activeChapterIndex]?.textTarget}
                  </p>
                </div>

                {/* Dynamic translator reveal trigger */}
                <div className="border-t border-white/5 pt-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setShowTranslations(prev => ({...prev, [activeChapterIndex]: !prev[activeChapterIndex]}))}
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
                    >
                      <span>{showTranslations[activeChapterIndex] ? "Hide English Translation" : "Show English Translation"}</span>
                      <span>{showTranslations[activeChapterIndex] ? "▲" : "▼"}</span>
                    </button>

                    {/* English Speak narration */}
                    {showTranslations[activeChapterIndex] && (
                      <button
                        onClick={() => handleSpeakText(activeStory.chapters[activeChapterIndex]?.textEnglish || "", "en")}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
                        title="Listen English translation"
                      >
                        <Volume2 className="w-4 h-4 text-purple-300" />
                      </button>
                    )}
                  </div>

                  {showTranslations[activeChapterIndex] && (
                    <p className="text-sm sm:text-base text-slate-300 border-l-2 border-indigo-500 pl-4 py-1 italic hover:text-white transition-colors">
                      {activeStory.chapters[activeChapterIndex]?.textEnglish}
                    </p>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Reader Chapter Progress navigation footer bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-5 gap-3">
            <button
              disabled={activeChapterIndex === 0}
              onClick={() => {
                handlePageChange(activeChapterIndex - 1);
                onAddXP(5);
              }}
              className="text-xs bg-[#121435] border border-white/5 hover:bg-white/5 rounded-xl px-4 py-2 w-full sm:w-auto text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              ← Previous Chapter
            </button>

            <span className="text-xs font-mono text-slate-400">
              Page {activeChapterIndex + 1} / {activeStory.chapters.length}
            </span>

            {activeChapterIndex < activeStory.chapters.length - 1 ? (
              <button
                onClick={() => {
                  const nextIndex = activeChapterIndex + 1;
                  handlePageChange(nextIndex);
                  onAddXP(10); // Reward active page flipped
                  if (onProgressUpdate) {
                    const percentage = Math.round((nextIndex / activeStory.chapters.length) * 100);
                    onProgressUpdate(percentage);
                  }
                }}
                className={`text-xs ${accentClass} rounded-xl px-4 py-2 w-full sm:w-auto font-bold cursor-pointer h-full`}
              >
                Next Chapter →
              </button>
            ) : (
              <button
                onClick={() => {
                  alert(`🎉 Congratulations! You have successfully completed reading the long epic '${activeStory.title}'! Earn +100 XP bonus!`);
                  if (onCompleteStory) {
                    onCompleteStory();
                  } else {
                    onAddXP(100);
                  }
                  setActiveStory(null);
                }}
                className="text-xs bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl px-5 py-2 w-full sm:w-auto font-bold cursor-pointer shadow-lg hover:from-green-500 hover:to-emerald-500"
              >
                Complete Saga & Claim 100 XP! 🌟
              </button>
            )}
          </div>

          {/* Quick exit Back to Library button at bottom */}
          <div className="flex justify-center border-t border-white/5 pt-4">
            <button
              onClick={() => setActiveStory(null)}
              className="text-[#bfc1e4] hover:text-white flex items-center justify-center gap-1.5 bg-[#121435] border border-white/5 hover:border-white/10 rounded-xl px-5 py-2.5 cursor-pointer transition-all font-semibold text-xs shadow-sm w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span>Back to Library</span>
            </button>
          </div>

        </div>
      ) : (
        <>
          {/* Main List Layout Screen */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Discover Stories</h2>
              <p className="text-xs text-slate-400 mb-2">Browse hand-crafted stories or generate original ones with AI.</p>
            </div>

            {/* AI Generator Toggle Button widget */}
            <button
              onClick={() => setShowAIGenerator(!showAIGenerator)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 hover:shadow-purple-500/40 transition-all pointer-events-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>AI Story Builder</span>
            </button>
          </div>

          {/* Collapsible server-side AI Story Maker parameters panel */}
          {showAIGenerator && (
            <form onSubmit={handleGenerateAIStory} className="bg-[#0b0c24] border border-purple-500/30 rounded-2xl p-5 md:p-6 space-y-4 max-w-2xl shadow-xl relative animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Create a Custom AI Learning Story</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAIGenerator(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Describe any scenario or topic you want to learn vocabulary for. Gemini will craft a gorgeous short story with parallel translations in real-time!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Topic parameter */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Story Concept / Prompt</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g., A stray kitten who learns to count star fruit in space..."
                    className="w-full bg-[#121435] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Genre Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Genre Style</label>
                  <select
                    value={aiGenre}
                    onChange={(e) => setAiGenre(e.target.value)}
                    className="w-full bg-[#121435] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option>Kids</option>
                    <option>Adventure</option>
                    <option>Fantasy</option>
                    <option>Folktales</option>
                    <option>Life Lessons</option>
                    <option>Science</option>
                    <option>History</option>
                  </select>
                </div>

                {/* Target Language Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Target Language</label>
                  <select
                    value={aiTargetLanguage}
                    onChange={(e) => setAiTargetLanguage(e.target.value)}
                    className="w-full bg-[#121435] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option>Spanish</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                    <option>French</option>
                    <option>Japanese</option>
                    <option>German</option>
                    <option>Portuguese</option>
                  </select>
                </div>

              </div>

              {/* Error indicator */}
              {generationError && (
                <p className="text-xs text-red-400 bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-900/30">
                  {generationError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAIGenerator(false)}
                  className="px-4 py-2 bg-[#121435] hover:bg-white/5 border border-white/5 rounded-xl text-xs text-slate-300 pointer-events-auto cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 pointer-events-auto cursor-pointer shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini is generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Story</span>
                      <span>✨</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Search bar + filter rows (Page 3) */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-4 md:p-5 space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Search & Filter Library</span>
              </h3>
              {(selectedGenre !== "All Genres" || selectedLanguage !== "All Languages" || searchPhrase) && (
                <button
                  onClick={() => {
                    setSelectedGenre("All Genres");
                    setSelectedLanguage("All Languages");
                    setSearchPhrase("");
                  }}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Keyword Search */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search titles, translations..."
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value)}
                  className="w-full bg-[#11122a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Genre Filter */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400">
                  <List className="w-4 h-4" />
                </span>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-[#11122a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                >
                  {availableGenres.map((genre, idx) => (
                    <option key={idx} value={genre} className="bg-[#11122a]">
                      {genre}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>

              {/* Language Filter */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400">
                  <Languages className="w-4 h-4" />
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-[#11122a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                >
                  {availableLanguages.map((lang, idx) => (
                    <option key={idx} value={lang} className="bg-[#11122a]">
                      {lang}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>

            </div>

            {/* Current Active Badges for quick feedback */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="font-medium">Active Criteria:</span>
              <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-purple-300 font-mono">
                Genre: {selectedGenre}
              </span>
              <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-cyan-300 font-mono">
                Language: {selectedLanguage}
              </span>
              {searchPhrase && (
                <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-indigo-300 font-mono truncate max-w-[150px]">
                  Keyword: "{searchPhrase}"
                </span>
              )}
            </div>
          </div>

          {/* SECTION : FEATURED STORIES CAROUSEL GRIDS (Page 3 row) */}
          {featuredStories.length > 0 && selectedGenre === "All Genres" && selectedLanguage === "All Languages" && !searchPhrase && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Featured Stories</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredStories.slice(0, 4).map((story, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOpenStory(story)}
                    className="bg-[#0b0c24] border border-white/5 rounded-2xl p-3 text-left group hover:bg-[#12143b] hover:border-indigo-500/20 transition-all cursor-pointer shadow-lg relative flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-36 rounded-xl overflow-hidden relative">
                        <img
                          src={story.coverUrl}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-0.5 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{story.rating}</span>
                        </div>
                        
                        {/* Category Badge Tag overlay */}
                        <span className="absolute bottom-2 left-2 text-[8px] uppercase tracking-wider font-bold text-white bg-indigo-600/80 px-2 py-0.5 rounded">
                          {story.category}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                        {story.language} • {story.readTime}
                      </h4>
                      <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                        {activeStory ? story.title : story.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {story.description || "Embark on this beautiful interactive dual-language narration for language learners."}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs text-sky-400 font-semibold italic">
                        {story.titleTranslation || "Story Available"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleToggleBookmark(story.id, e)}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Bookmark story"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(story.id) ? "text-purple-400 fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL STORIES LIST (Page 3 bottom section) */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Library Items</h3>
              <p className="text-xs text-slate-500 font-mono">{filteredStories.length} interactive items found</p>
            </div>

            <div className="space-y-2">
              {filteredStories.map((story, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenStory(story)}
                  className="bg-[#0b0c24] border border-white/5 hover:bg-[#12143b] rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-all cursor-pointer group hover:border-purple-500/20"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={story.coverUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {story.title}
                        </h4>
                        {story.titleTranslation && (
                          <span className="text-xs text-indigo-400 italic">
                            ({story.titleTranslation})
                          </span>
                        )}
                        <span className="text-[9px] bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded">
                          {story.category}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                        {story.description || "Perfect reading tool with sentence-level pronunciations."}
                      </p>
                      
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono uppercase">
                        <span className="flex items-center gap-1">
                          ⏱️ {story.readTime}
                        </span>
                        <span>• Lang: {story.language}</span>
                        <span className="text-amber-400">★ {story.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={(e) => handleToggleBookmark(story.id, e)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                      title="Bookmark story"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(story.id) ? "fill-purple-500 text-purple-400" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleOpenStory(story)}
                      className="p-2 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                      title="Read story"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating Family Word Chest trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setWordVaultOpen(true)}
          className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-xl hover:from-cyan-400 hover:to-indigo-500 transition-all font-semibold cursor-pointer border border-white/10 flex items-center gap-2 group"
          title="Open Family Word Chest"
        >
          <BookMarked className="w-5 h-5 animate-pulse text-cyan-300" />
          <span className="text-xs font-bold font-sans tracking-wide max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Word Chest ({collectedWords.length})
          </span>
        </button>
      </div>

      {/* Word Collect Toast Notification */}
      <AnimatePresence>
        {wordCollectToast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 right-6 z-55 bg-[#090b24]/95 border border-cyan-500/50 px-4 py-3 rounded-2xl shadow-xl shadow-cyan-500/10 text-xs text-cyan-300 font-bold flex items-center gap-2"
          >
            <BookMarked className="w-4 h-4 text-cyan-400" />
            <span>{wordCollectToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heritage Vocabulary Notebook & Word Chest Sidebar/Drawer */}
      <AnimatePresence>
        {wordVaultOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setWordVaultOpen(false);
                setGameActive(false);
              }}
              className="absolute inset-0 bg-black/80 cursor-pointer"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
              className="relative w-full max-w-md bg-[#090a21] border-l border-white/10 h-full shadow-2xl flex flex-col justify-between"
            >
              <div className="p-5 border-b border-white/5 bg-[#12143d] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Family Word Chest</h4>
                    <p className="text-[10px] text-slate-400">Heritage Language Word Vault</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setWordVaultOpen(false);
                    setGameActive(false);
                  }}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg border border-white/5 transition-all w-8 h-8 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
                {gameActive ? (
                  <div className="space-y-4 bg-purple-950/20 border border-purple-500/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 animate-pulse">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-[11px] font-mono tracking-wider font-extrabold text-amber-300 uppercase">Match Game</span>
                      </div>
                      <button
                        onClick={() => setGameActive(false)}
                        className="text-slate-400 hover:text-white text-[10px] font-bold"
                      >
                        Quit Quiz
                      </button>
                    </div>
                    
                    {gameQuestion ? (
                      <div className="space-y-4 text-center">
                        <span className="text-3xl inline-block">{gameQuestion.emoji}</span>
                        <p className="text-xs text-slate-400 font-medium">What is the English meaning of:</p>
                        <h3 className="text-lg font-bold text-white font-sans bg-[#13143b] px-4 py-2 rounded-lg border border-white/5 inline-block">
                          {gameQuestion.q}
                        </h3>
                        
                        {gameFeedback ? (
                          <div className="space-y-3 pt-2">
                            <p className="text-xs font-bold text-cyan-300 px-3 py-2 bg-cyan-950/40 rounded-lg border border-cyan-500/10">
                              {gameFeedback}
                            </p>
                            <button
                              type="button"
                              onClick={handleStartVocabGame}
                              className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all w-full animate-bounce"
                            >
                              Next Question →
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 pt-2">
                            {gameQuestion.options.map((option, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleAnswerGame(option)}
                                className="bg-[#121435] hover:bg-[#1a1c4e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 hover:border-purple-500/40 transition-all font-bold cursor-pointer"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Loading trivia cards...</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-400">Review collected terms with your family or abuelita.</p>
                      <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/20 px-2 py-0.5 rounded font-extrabold animate-pulse">
                        {collectedWords.length} Words Saving
                      </span>
                    </div>
                    
                    {collectedWords.length === 0 ? (
                      <div className="text-center py-12 space-y-2 border border-dashed border-white/5 rounded-xl">
                        <span className="text-3xl">📔</span>
                        <p className="text-xs text-slate-350 font-medium font-bold">Your Word notebook is empty!</p>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                          Click on those cute bilingual cards under sentences inside the Story Reader to collect terms & learn heritage idioms together.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {collectedWords.map((word, idx) => (
                          <div
                            key={idx}
                            className="bg-[#12143d] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2.5 hover:border-cyan-500/25 transition-all text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl shrink-0">{word.emoji || "✨"}</span>
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                                  <span>{word.target}</span>
                                  <span className="text-[8px] bg-[#1a1c48] text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                    {word.language}
                                  </span>
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-1.5 leading-none">{word.english}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!window.speechSynthesis) return;
                                  window.speechSynthesis.cancel();
                                  const utterance = new SpeechSynthesisUtterance(word.target);
                                  const langLow = word.language.toLowerCase();
                                  if (langLow === "spanish") utterance.lang = "es-ES";
                                  else if (langLow === "kannada") utterance.lang = "kn-IN";
                                  else utterance.lang = "en-US";
                                  utterance.rate = 0.8;
                                  window.speechSynthesis.speak(utterance);
                                }}
                                className="p-1 text-cyan-400 hover:bg-cyan-950/40 rounded-lg transition-all cursor-pointer"
                                title="Hear voice pronounciation"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => handleDeleteCollectedWord(word.target, word.language)}
                                className="p-1 text-slate-500 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                                title="Remove word"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-[#11122a] border-t border-white/5 shrink-0 space-y-2">
                <button
                  type="button"
                  disabled={collectedWords.length < 3}
                  onClick={handleStartVocabGame}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md shadow-purple-650/15 cursor-pointer transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>Interactive Matching Game (+10 XP)</span>
                </button>
                {collectedWords.length < 3 && (
                  <p className="text-[10px] text-slate-500 text-center font-medium">
                    💡 Collect {3 - collectedWords.length} more words to unlock matching quizzes!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Volunteer Appreciation Card Creator */}
      <AnimatePresence>
        {thankYouRecipient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setThankYouRecipient(null)}
              className="absolute inset-0 bg-black/80 cursor-pointer"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#090b23] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{thankYouRecipient.avatar}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>Appreciate {thankYouRecipient.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">{thankYouRecipient.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setThankYouRecipient(null)}
                  className="text-xs text-slate-500 hover:text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/5"
                >
                  ✕
                </button>
              </div>
              
              {appreciationSent ? (
                <div className="text-center py-6 space-y-3">
                  <span className="text-5xl inline-block animate-bounce">{selectedSticker}</span>
                  <h4 className="text-base font-bold text-cyan-400">Appreciation Card Dispatched! 🎉</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    "Awesome job! Elena and other student volunteers receive children's thank you feedback cards directly at unified coordinator bureaus!"
                  </p>
                  <p className="text-[11px] inline-block bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full font-bold font-mono">
                    +20 Kind-Learner XP Added! 🌟
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Show heartwarming gratitude to student tutors! Let them know they make a wonderful difference preserving cultural roots.
                  </p>
                  
                  {/* Select card style / sticker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select sticker accent:</label>
                    <div className="flex gap-2 justify-around">
                      {["🧸", "🍎", "🌟", "🏆", "🍪", "🎈"].map((sticker) => (
                        <button
                          key={sticker}
                          type="button"
                          onClick={() => setSelectedSticker(sticker)}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all cursor-pointer ${
                            selectedSticker === sticker
                              ? "bg-purple-950/40 border-purple-500 scale-110 shadow-lg shadow-purple-500/20"
                              : "bg-[#121435] border-white/5 hover:bg-white/10"
                          }`}
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Preset message notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Choose dynamic note:</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        "Your pronunciation was so comforting and clear!",
                        "Thank you for helping me learn our family's language!",
                        "I loved your warm accent and reading speed!",
                        "This made studying heritage tales absolute fun!"
                      ].map((msg) => (
                        <button
                          key={msg}
                          type="button"
                          onClick={() => setAppreciateMessage(msg)}
                          className={`px-3 py-1.5 bg-[#121435] text-left rounded-xl text-xs border truncate transition-all text-slate-300 hover:text-white hover:border-purple-500/30 ${
                            appreciateMessage === msg
                              ? "bg-purple-900/20 border-purple-500 text-purple-350 font-bold"
                              : "border-white/5"
                          }`}
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleSendAppreciation}
                    className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg shadow-pink-650/15 cursor-pointer transition-all"
                  >
                    <Heart className="w-4 h-4 text-white fill-current animate-pulse" />
                    <span>Deliver Card to Student Portal (+20 XP)</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
