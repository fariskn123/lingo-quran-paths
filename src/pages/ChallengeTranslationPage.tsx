
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Volume } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import levelsData from '@/data/levelsData';

const ChallengeTranslationPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, addXP, completeLesson } = useUser();
  const { toast } = useToast();
  
  // Find the lesson data
  const level = levelsData.find(level => 
    level.lessons.some(lesson => lesson.id === lessonId)
  );
  
  const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
  
  if (!lesson || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button 
            className="bg-quran-green text-white"
            onClick={() => navigate('/levels')}
          >
            Return to Levels
          </Button>
        </div>
      </div>
    );
  }
  
  // Filter for sentence translation challenges
  const challenges = lesson.challenges.filter(c => c.type === 'sentence-translation');
  
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  
  // Get current challenge
  const currentChallenge = challenges[currentChallengeIndex];
  const progress = ((currentChallengeIndex + 1) / challenges.length) * 100;
  
  // Initialize available words
  useEffect(() => {
    if (currentChallenge && currentChallenge.sentence) {
      const words = [...currentChallenge.sentence.words];
      // Shuffle words
      setAvailableWords(words.sort(() => 0.5 - Math.random()));
      setSelectedWords([]);
      setIsCorrect(null);
    }
  }, [currentChallengeIndex, currentChallenge]);
  
  // Check if there are any sentence translation challenges
  if (challenges.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">No Translation Challenges</h1>
          <p className="mb-6">This lesson doesn't have any translation challenges yet.</p>
          <Button 
            className="bg-quran-green text-white"
            onClick={() => {
              // Even with no challenges, mark as complete
              completeLesson(lessonId);
              addXP(lesson.xpReward);
              navigate(`/victory/${lessonId}`);
            }}
          >
            Complete Lesson
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSelectWord = (word: string, index: number) => {
    if (isCorrect !== null) return; // Don't allow changes after submission
    
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter((_, i) => i !== index));
  };
  
  const handleRemoveWord = (index: number) => {
    if (isCorrect !== null) return; // Don't allow changes after submission
    
    const word = selectedWords[index];
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
    setAvailableWords([...availableWords, word]);
  };
  
  const handleSubmit = () => {
    if (!currentChallenge || !currentChallenge.sentence) return;
    
    const userTranslation = selectedWords.join(' ');
    const isUserCorrect = userTranslation.toLowerCase() === currentChallenge.sentence.translation.toLowerCase();
    
    setIsCorrect(isUserCorrect);
    
    // Auto-advance after delay
    setTimeout(() => {
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex(currentChallengeIndex + 1);
      } else {
        setCompleted(true);
        // Mark lesson as complete and award XP
        completeLesson(lessonId);
        addXP(lesson.xpReward);
        
        toast({
          title: "Lesson Completed!",
          description: `You earned ${lesson.xpReward} XP!`,
        });
      }
    }, 2000);
  };
  
  const handleSkip = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    } else {
      setCompleted(true);
      // Mark lesson as complete but award less XP
      completeLesson(lessonId);
      const reducedXP = Math.floor(lesson.xpReward * 0.7);
      addXP(reducedXP);
      
      toast({
        title: "Lesson Completed!",
        description: `You earned ${reducedXP} XP!`,
      });
    }
  };
  
  if (completed) {
    navigate(`/victory/${lessonId}`);
    return null;
  }
  
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate(`/lesson/${lessonId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="text-sm font-medium">
            {currentChallengeIndex + 1}/{challenges.length}
          </div>
        </div>
        
        <div className="mb-6">
          <h1 className="text-xl font-bold">Translation Challenge</h1>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-quran-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {currentChallenge && currentChallenge.sentence && (
          <>
            <div className="card mb-6">
              <h2 className="text-lg mb-2">Translate this phrase:</h2>
              <div className="flex items-center mb-2">
                <div className="arabic-text text-2xl font-bold">
                  {currentChallenge.sentence.arabic}
                </div>
                <button 
                  className="ml-2 p-2 rounded-full hover:bg-gray-100"
                  aria-label="Play pronunciation"
                >
                  <Volume className="w-5 h-5 text-quran-green" />
                </button>
              </div>
            </div>
            
            {/* Selected words area */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-20 mb-6 flex flex-wrap gap-2">
              {selectedWords.length === 0 ? (
                <div className="w-full text-center text-gray-400">
                  Select words to build your translation
                </div>
              ) : (
                selectedWords.map((word, index) => (
                  <motion.button
                    key={index}
                    className="bg-quran-green text-white py-1 px-3 rounded-full"
                    onClick={() => handleRemoveWord(index)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {word}
                  </motion.button>
                ))
              )}
            </div>
            
            {/* Available words */}
            <div className="flex flex-wrap gap-2 mb-8">
              {availableWords.map((word, index) => (
                <motion.button
                  key={index}
                  className="bg-gray-100 py-1 px-3 rounded-full"
                  onClick={() => handleSelectWord(word, index)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {word}
                </motion.button>
              ))}
            </div>
            
            {isCorrect !== null && (
              <motion.div 
                className={`p-3 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isCorrect 
                  ? <div className="flex items-center"><Check className="w-5 h-5 mr-2" /> Correct! Well done.</div>
                  : (
                    <div>
                      <div className="flex items-center"><X className="w-5 h-5 mr-2" /> Not quite right.</div>
                      <div className="mt-2">Correct translation: "{currentChallenge.sentence.translation}"</div>
                    </div>
                  )
                }
              </motion.div>
            )}
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleSkip}
              >
                Skip
              </Button>
              
              <Button
                className="bg-quran-green text-white"
                onClick={handleSubmit}
                disabled={selectedWords.length === 0 || isCorrect !== null}
              >
                Check
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengeTranslationPage;
