import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import levelsData from '@/data/levelsData';
import confetti from 'canvas-confetti';

interface MatchPair {
  id: string;
  arabic: string;
  english: string;
  isMatched: boolean;
}

const MatchingChallengePage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, addXP, completeLesson } = useUser();
  const { toast } = useToast();
  
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [shuffledArabic, setShuffledArabic] = useState<(MatchPair & { selected: boolean })[]>([]);
  const [shuffledEnglish, setShuffledEnglish] = useState<(MatchPair & { selected: boolean })[]>([]);
  const [selectedArabic, setSelectedArabic] = useState<MatchPair | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<MatchPair | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  
  const lesson = levelsData.flatMap(level => level.lessons).find(lesson => lesson.id === lessonId);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!lesson) {
      navigate('/');
      return;
    }
    
    const matchPairs = lesson.words.map(word => ({
      id: word.id,
      arabic: word.arabic,
      english: word.meaning,
      isMatched: false
    }));
    
    setPairs(matchPairs);
    setTotalPairs(matchPairs.length);
    
    const arabicItems = [...matchPairs].map(pair => ({ ...pair, selected: false }));
    const englishItems = [...matchPairs].map(pair => ({ ...pair, selected: false }));
    
    setShuffledArabic(shuffleArray(arabicItems));
    setShuffledEnglish(shuffleArray(englishItems));
  }, [lesson, navigate]);
  
  const shuffleArray = <T extends unknown>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const handleSelectArabic = (item: MatchPair & { selected: boolean }) => {
    if (item.isMatched || isCompleted) return;
    
    setSelectedArabic(item);
    setShuffledArabic(prev => 
      prev.map(p => p.id === item.id ? { ...p, selected: true } : { ...p, selected: false })
    );
    
    if (selectedEnglish) {
      checkForMatch(item, selectedEnglish);
    }
  };
  
  const handleSelectEnglish = (item: MatchPair & { selected: boolean }) => {
    if (item.isMatched || isCompleted) return;
    
    setSelectedEnglish(item);
    setShuffledEnglish(prev => 
      prev.map(p => p.id === item.id ? { ...p, selected: true } : { ...p, selected: false })
    );
    
    if (selectedArabic) {
      checkForMatch(selectedArabic, item);
    }
  };
  
  const checkForMatch = (arabic: MatchPair, english: MatchPair) => {
    const isMatch = arabic.id === english.id;
    
    if (isMatch) {
      setPairs(prev => 
        prev.map(p => p.id === arabic.id ? { ...p, isMatched: true } : p)
      );
      
      setShuffledArabic(prev => 
        prev.map(p => p.id === arabic.id ? { ...p, isMatched: true, selected: false } : { ...p, selected: false })
      );
      
      setShuffledEnglish(prev => 
        prev.map(p => p.id === english.id ? { ...p, isMatched: true, selected: false } : { ...p, selected: false })
      );
      
      setScore(prev => prev + 1);
      
      toast({
        title: "Correct!",
        description: `${arabic.arabic} = ${english.english}`,
        variant: "default",
      });
    } else {
      setTimeout(() => {
        setShuffledArabic(prev => prev.map(p => ({ ...p, selected: false })));
        setShuffledEnglish(prev => prev.map(p => ({ ...p, selected: false })));
      }, 1000);
      
      toast({
        title: "Try again",
        description: "These words don't match",
        variant: "destructive",
      });
    }
    
    setSelectedArabic(null);
    setSelectedEnglish(null);
    
    setTimeout(() => {
      const allMatched = pairs.every(p => p.isMatched) || score + 1 === totalPairs;
      if (allMatched && totalPairs > 0) {
        handleCompletion(isMatch);
      }
    }, 300);
  };
  
  const handleCompletion = (finalMatchCorrect: boolean) => {
    setIsCompleted(true);
    setIsCorrect(score === totalPairs);
    
    const xpEarned = lesson?.xpReward || 10;
    addXP(xpEarned);
    if (!userState.completedLessons.includes(lessonId || '')) {
      completeLesson(lessonId || '');
    }
    
    setShowXpAnimation(true);
    
    if (finalMatchCorrect) {
      setTimeout(() => {
        if (canvasRef.current) {
          const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true,
          });
          
          myConfetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 300);
    }
  };
  
  const handleContinue = () => {
    navigate(`/victory/${lessonId}`);
  };
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-4">Lesson not found</h1>
        <Button onClick={() => navigate('/levels')}>Back to Levels</Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#131F2B] text-white pb-20">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
      
      <div className="sticky top-0 bg-[#1C2A3B] p-4 flex justify-between items-center z-10">
        <button 
          onClick={() => navigate(-1)}
          className="text-white/70 hover:text-white"
        >
          Cancel
        </button>
        <div className="font-bold">Matching Challenge</div>
        <div className="w-16 text-right">
          {score}/{totalPairs}
        </div>
      </div>
      
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Match the pairs</h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 space-y-3">
            {shuffledArabic.map((item) => (
              <motion.div
                key={`arabic-${item.id}`}
                onClick={() => handleSelectArabic(item)}
                className={`p-4 rounded-xl text-center font-arabic text-xl 
                  ${item.isMatched ? 'bg-green-500/20 opacity-60' : 'bg-[#2D4153] cursor-pointer'}
                  ${item.selected ? 'ring-2 ring-[#58CC02]' : ''}
                  transform transition-all duration-200
                `}
                whileHover={!item.isMatched ? { scale: 1.02 } : {}}
                whileTap={!item.isMatched ? { scale: 0.98 } : {}}
                animate={{
                  opacity: item.isMatched ? 0.6 : 1,
                  scale: item.selected ? 1.05 : 1
                }}
              >
                {item.arabic}
              </motion.div>
            ))}
          </div>
          
          <div className="flex-1 space-y-3">
            {shuffledEnglish.map((item) => (
              <motion.div
                key={`english-${item.id}`}
                onClick={() => handleSelectEnglish(item)}
                className={`p-4 rounded-xl text-center 
                  ${item.isMatched ? 'bg-green-500/20 opacity-60' : 'bg-[#2D4153] cursor-pointer'}
                  ${item.selected ? 'ring-2 ring-[#58CC02]' : ''}
                  transform transition-all duration-200
                `}
                whileHover={!item.isMatched ? { scale: 1.02 } : {}}
                whileTap={!item.isMatched ? { scale: 0.98 } : {}}
                animate={{
                  opacity: item.isMatched ? 0.6 : 1,
                  scale: item.selected ? 1.05 : 1
                }}
              >
                {item.english}
              </motion.div>
            ))}
          </div>
        </div>
        
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-x-0 bottom-0 p-4 bg-[#1C2A3B] z-20"
            >
              <div className="flex flex-col items-center max-w-md mx-auto">
                <div className="mb-4 text-center">
                  {isCorrect ? (
                    <div className="flex items-center text-green-500 text-xl font-bold">
                      <Check className="w-6 h-6 mr-2" />
                      Great job!
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500 text-xl font-bold">
                      <X className="w-6 h-6 mr-2" />
                      Keep practicing!
                    </div>
                  )}
                  <p className="text-white/70 mt-1">
                    {score} out of {totalPairs} matches correct
                  </p>
                </div>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full py-3 bg-[#58CC02] hover:bg-[#73E533] text-[#181602] font-bold rounded-xl"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showXpAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="fixed inset-0 flex items-center justify-center z-40"
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="bg-[#58CC02] text-white font-bold text-2xl px-6 py-3 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: -100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                +{lesson.xpReward} XP
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MatchingChallengePage;
