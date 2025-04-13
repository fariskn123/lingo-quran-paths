
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import levelsData from '@/data/levelsData';
import { useIsMobile } from '@/hooks/use-mobile';
import confetti from 'canvas-confetti';

interface MatchPair {
  id: string;
  arabic: string;
  english: string;
  matched: boolean;
  selected: boolean;
}

const MatchingChallengePage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, updateUserXP, completeLesson } = useUser();
  const isMobile = useIsMobile();
  
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchPair | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [incorrectPair, setIncorrectPair] = useState<{arabic: string, english: string} | null>(null);
  const [activeMatches, setActiveMatches] = useState<{start: string, end: string}[]>([]);
  
  // Find the current lesson
  const lesson = useMemo(() => {
    const level = levelsData.find(level => 
      level.lessons.some(lesson => lesson.id === lessonId)
    );
    return level?.lessons.find(lesson => lesson.id === lessonId);
  }, [lessonId]);
  
  // Initialize game with lesson words
  useEffect(() => {
    if (lesson && lesson.words.length > 0) {
      const newPairs = lesson.words.map(word => ({
        id: word.id,
        arabic: word.arabic,
        english: word.meaning,
        matched: false,
        selected: false
      }));
      setPairs(newPairs);
    }
  }, [lesson]);
  
  // Check if all pairs are matched
  useEffect(() => {
    if (pairs.length > 0 && pairs.every(pair => pair.matched)) {
      setIsCompleted(true);
      
      // Show success animation
      setTimeout(() => {
        setShowSuccess(true);
        // Trigger confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Add XP and mark lesson as completed
        if (lesson) {
          updateUserXP(lesson.xpReward);
          completeLesson(lessonId || '');
        }
      }, 500);
    }
  }, [pairs, lessonId, lesson, updateUserXP, completeLesson]);
  
  // Handle card selection
  const handleCardSelect = (pair: MatchPair, type: 'arabic' | 'english') => {
    // If already matched, do nothing
    if (pair.matched) return;
    
    // If no card is selected, select this one
    if (!selectedCard) {
      setSelectedCard({...pair, selected: true});
      setPairs(prev => prev.map(p => 
        p.id === pair.id ? {...p, selected: true} : p
      ));
      return;
    }
    
    // If selecting the same card type, deselect previous and select new
    if ((selectedCard.arabic === pair.arabic && type === 'arabic') || 
        (selectedCard.english === pair.english && type === 'english')) {
      setSelectedCard({...pair, selected: true});
      setPairs(prev => prev.map(p => 
        p.id === pair.id ? {...p, selected: true} : 
        p.id === selectedCard.id ? {...p, selected: false} : p
      ));
      return;
    }
    
    // Check if match is correct
    const isCorrectMatch = 
      (type === 'arabic' && selectedCard.english === pair.english) || 
      (type === 'english' && selectedCard.arabic === pair.arabic);
    
    if (isCorrectMatch) {
      // Mark as matched
      setPairs(prev => prev.map(p => 
        (p.id === pair.id || p.id === selectedCard.id) 
          ? {...p, matched: true, selected: false} 
          : p
      ));
      
      // Add to active matches for drawing lines
      setActiveMatches(prev => [
        ...prev, 
        {
          start: type === 'arabic' ? pair.id : selectedCard.id,
          end: type === 'arabic' ? selectedCard.id : pair.id
        }
      ]);
      
      setSelectedCard(null);
    } else {
      // Show incorrect match feedback
      setIncorrectPair({
        arabic: type === 'arabic' ? pair.arabic : selectedCard.arabic,
        english: type === 'english' ? pair.english : selectedCard.english
      });
      
      // Reset selection after a delay
      setTimeout(() => {
        setPairs(prev => prev.map(p => 
          (p.id === pair.id || p.id === selectedCard.id) 
            ? {...p, selected: false} 
            : p
        ));
        setSelectedCard(null);
        setIncorrectPair(null);
      }, 1000);
    }
  };
  
  // Navigate back to lesson path
  const handleContinue = () => {
    // Find the level ID
    const level = levelsData.find(level => 
      level.lessons.some(lesson => lesson.id === lessonId)
    );
    
    if (level) {
      navigate(`/path/${level.id}`);
    } else {
      navigate('/levels');
    }
  };
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/levels')}
          >
            Return to Levels
          </Button>
        </div>
      </div>
    );
  }
  
  // Separate pairs into two columns
  const arabicPairs = pairs.map(pair => ({...pair, type: 'arabic' as const}));
  const englishPairs = pairs.map(pair => ({...pair, type: 'english' as const}));
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-purple-400 font-medium"
            onClick={() => navigate(`/lesson/${lessonId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="py-1 px-3 rounded-full bg-purple-700 text-white text-sm">
            Matching Challenge
          </div>
        </div>
        
        {/* Game area */}
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-6 text-center">Match the Arabic words with their meanings</h1>
          
          <AnimatePresence>
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-800 rounded-xl p-6 text-center mb-8"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Great job!</h2>
                <p className="mb-4">You earned {lesson.xpReward} XP</p>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 w-full py-3"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </motion.div>
            ) : (
              <div className="relative">
                {/* Game columns */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  {/* Arabic column */}
                  <div className="w-full md:w-1/2 space-y-3">
                    {arabicPairs.map((pair) => (
                      <motion.div
                        key={`arabic-${pair.id}`}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          scale: pair.selected ? 1.05 : 1,
                          opacity: pair.matched ? 0.7 : 1,
                          borderColor: pair.selected 
                            ? 'rgb(126, 34, 206)' 
                            : (incorrectPair && incorrectPair.arabic === pair.arabic)
                              ? 'rgb(220, 38, 38)'
                              : 'rgb(55, 65, 81)',
                        }}
                        className={`
                          rounded-lg p-3 border-2 cursor-pointer
                          ${pair.matched ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 hover:bg-gray-700'}
                          ${pair.selected ? 'border-purple-700' : 'border-gray-700'}
                          ${(incorrectPair && incorrectPair.arabic === pair.arabic) ? 'border-red-600' : ''}
                        `}
                        onClick={() => !pair.matched && handleCardSelect(pair, 'arabic')}
                      >
                        <p className="text-center font-arabic text-xl" dir="rtl">{pair.arabic}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* English column */}
                  <div className="w-full md:w-1/2 space-y-3">
                    {englishPairs.map((pair) => (
                      <motion.div
                        key={`english-${pair.id}`}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          scale: pair.selected ? 1.05 : 1,
                          opacity: pair.matched ? 0.7 : 1,
                          borderColor: pair.selected 
                            ? 'rgb(126, 34, 206)' 
                            : (incorrectPair && incorrectPair.english === pair.english)
                              ? 'rgb(220, 38, 38)'
                              : 'rgb(55, 65, 81)',
                        }}
                        className={`
                          rounded-lg p-3 border-2 cursor-pointer
                          ${pair.matched ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 hover:bg-gray-700'}
                          ${pair.selected ? 'border-purple-700' : 'border-gray-700'}
                          ${(incorrectPair && incorrectPair.english === pair.english) ? 'border-red-600' : ''}
                        `}
                        onClick={() => !pair.matched && handleCardSelect(pair, 'english')}
                      >
                        <p className="text-center">{pair.english}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Lines connecting matched pairs */}
                {!isMobile && (
                  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                    {activeMatches.map((match, index) => {
                      const startElement = document.getElementById(`arabic-${match.start}`);
                      const endElement = document.getElementById(`english-${match.end}`);
                      
                      if (!startElement || !endElement) return null;
                      
                      const startRect = startElement.getBoundingClientRect();
                      const endRect = endElement.getBoundingClientRect();
                      
                      // Calculate positions relative to the svg
                      const svgRect = startElement.parentElement?.parentElement?.getBoundingClientRect();
                      if (!svgRect) return null;
                      
                      const x1 = startRect.right - svgRect.left;
                      const y1 = startRect.top + startRect.height/2 - svgRect.top;
                      const x2 = endRect.left - svgRect.left;
                      const y2 = endRect.top + endRect.height/2 - svgRect.top;
                      
                      return (
                        <line
                          key={`line-${index}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="rgba(139, 92, 246, 0.5)"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all"
            style={{ width: `${(pairs.filter(p => p.matched).length / pairs.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Completed status */}
        <div className="text-center text-gray-400 text-sm">
          {pairs.filter(p => p.matched).length} of {pairs.length} matched
        </div>
      </div>
    </div>
  );
};

export default MatchingChallengePage;
