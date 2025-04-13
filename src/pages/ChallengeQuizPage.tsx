
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Trophy, ZapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import levelsData from '@/data/levelsData';
import XPBar from '@/components/XPBar';
import StreakCounter from '@/components/StreakCounter';

interface Challenge {
  question: string;
  options: string[];
  correctOption: string;
  arabic: string[];
}

const ChallengeQuizPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, addXP } = useUser();
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
            onClick={() => navigate('/')}
          >
            Return to Path
          </Button>
        </div>
      </div>
    );
  }

  // Generate challenges from the lesson words
  const generateChallenges = (): Challenge[] => {
    return lesson.words.map(word => {
      // Get 3 incorrect options (other Arabic words)
      const incorrectOptions = lesson.words
        .filter(w => w.id !== word.id)
        .map(w => w.arabic)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      // Combine correct and incorrect options and shuffle
      const options = [word.arabic, ...incorrectOptions]
        .sort(() => 0.5 - Math.random());
      
      return {
        question: `What is the Arabic word for "${word.meaning}"?`,
        options,
        correctOption: word.arabic,
        arabic: options
      };
    });
  };
  
  const [challenges] = useState(generateChallenges);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const currentChallenge = challenges[currentIndex];
  const progress = ((currentIndex + 1) / challenges.length) * 100;
  
  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent multiple selections
    
    setSelectedOption(option);
    const correct = option === currentChallenge.correctOption;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      // Show XP animation for correct answers
      const pointsEarned = Math.floor(lesson.xpReward / challenges.length);
      setXpEarned(pointsEarned);
      setShowXpAnimation(true);
      
      // Hide XP animation after delay
      setTimeout(() => {
        setShowXpAnimation(false);
      }, 1500);
      
      addXP(pointsEarned);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      const totalXP = Math.round((score / challenges.length) * lesson.xpReward);
      
      toast({
        title: "Challenge Completed!",
        description: `Great job! You earned ${totalXP} XP!`,
      });
    }
  };
  
  // Auto-advance to next question after a delay when user selects an option
  useEffect(() => {
    if (selectedOption) {
      const timer = setTimeout(() => {
        handleNext();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedOption]);
  
  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-quran-background">
        <motion.div 
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="w-16 h-16 mx-auto text-quran-gold mb-4" />
          <h1 className="text-2xl font-bold mb-4">Challenge Complete!</h1>
          <p className="mb-2 text-lg">You scored {score} out of {challenges.length}</p>
          <p className="mb-6 text-quran-green font-bold text-xl">+{Math.round((score / challenges.length) * lesson.xpReward)} XP</p>
          
          <Button 
            className="w-full mb-3 bg-quran-green text-white"
            onClick={() => navigate(`/path/${level.id}`)}
          >
            Continue Learning
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => {
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsCorrect(null);
              setScore(0);
              setQuizCompleted(false);
            }}
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-6 px-4 bg-quran-background">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate(`/path/${level.id}/lesson/${lessonId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <StreakCounter className="flex items-center gap-1" />
        </div>
        
        <XPBar className="mb-6" />
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-xl font-bold">{lesson.title} Challenge</h1>
            <div className="text-sm font-medium">
              {currentIndex + 1}/{challenges.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-quran-green h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl mb-2">{currentChallenge.question}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentChallenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`relative p-4 rounded-xl text-center font-arabic text-xl transition-all ${
                    selectedOption === option 
                      ? isCorrect 
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-red-100 border-2 border-red-500'
                      : 'bg-white border-2 border-gray-200 hover:border-quran-green'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="block mb-1 text-2xl">{option}</span>
                  
                  {selectedOption === option && (
                    <motion.div
                      className="absolute -top-2 -right-2 p-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {isCorrect 
                        ? <Check className="text-green-500 w-6 h-6" /> 
                        : <X className="text-red-500 w-6 h-6" />
                      }
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={`p-3 rounded-lg mb-4 text-center ${
                  isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {isCorrect 
                  ? 'Correct! Great job!' 
                  : `Incorrect. The correct answer is "${currentChallenge.correctOption}".`
                }
              </motion.div>
            )}
            
            {selectedOption && (
              <div className="flex justify-center">
                <Button
                  className="bg-quran-green text-white px-8"
                  onClick={handleNext}
                >
                  {currentIndex === challenges.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* XP Animation */}
        <AnimatePresence>
          {showXpAnimation && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex items-center gap-1 bg-quran-gold text-white px-4 py-2 rounded-full shadow-lg"
                initial={{ y: 100, scale: 0.8 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25 
                }}
              >
                <ZapIcon className="w-5 h-5" />
                <span className="font-bold">+{xpEarned} XP</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChallengeQuizPage;
