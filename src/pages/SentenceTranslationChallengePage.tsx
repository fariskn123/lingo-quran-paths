import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, MessageSquare, Volume } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import levelsData from '@/data/levelsData';

const SentenceTranslationChallengePage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, addXP, completeLesson } = useUser();
  const { toast } = useToast();
  
  const level = levelsData.find(level => 
    level.lessons.some(lesson => lesson.id === lessonId)
  );
  
  const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
  
  if (!lesson || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button 
            className="bg-[#9b87f5] hover:bg-[#8a76e5] text-white"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  const challenges = lesson.challenges.filter(c => c.type === 'sentence-translation');
  
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  
  const currentChallenge = challenges[currentChallengeIndex];
  const progress = ((currentChallengeIndex + 1) / challenges.length) * 100;
  
  useEffect(() => {
    if (currentChallenge && currentChallenge.sentence) {
      const correctWords = [...currentChallenge.sentence.words];
      
      const otherLessons = levelsData.flatMap(level => level.lessons)
        .filter(l => l.id !== lessonId);
      
      const extraWords: string[] = [];
      while (extraWords.length < 5 && otherLessons.length > 0) {
        const randomLesson = otherLessons[Math.floor(Math.random() * otherLessons.length)];
        if (randomLesson.challenges.length > 0) {
          const randomChallenge = randomLesson.challenges.find(c => c.type === 'sentence-translation');
          if (randomChallenge && randomChallenge.sentence) {
            const word = randomChallenge.sentence.words[Math.floor(Math.random() * randomChallenge.sentence.words.length)];
            if (!correctWords.includes(word) && !extraWords.includes(word)) {
              extraWords.push(word);
            }
          }
        }
      }
      
      const allWords = [...correctWords, ...extraWords];
      setAvailableWords(allWords.sort(() => 0.5 - Math.random()));
      setSelectedWords([]);
      setIsCorrect(null);
    }
  }, [currentChallengeIndex, currentChallenge, lessonId]);
  
  if (challenges.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] text-white">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">No Translation Challenges</h1>
          <p className="mb-6">This lesson doesn't have any translation challenges yet.</p>
          <Button 
            className="bg-[#9b87f5] hover:bg-[#8a76e5] text-white"
            onClick={() => navigate(`/path/${level.id}`)}
          >
            Return to Path
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSelectWord = (word: string, index: number) => {
    if (isCorrect !== null) return;
    
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter((_, i) => i !== index));
  };
  
  const handleRemoveWord = (index: number) => {
    if (isCorrect !== null) return;
    
    const word = selectedWords[index];
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
    setAvailableWords([...availableWords, word]);
  };
  
  const handleSubmit = () => {
    if (!currentChallenge || !currentChallenge.sentence) return;
    
    const userTranslation = selectedWords.join(' ');
    const isUserCorrect = userTranslation.toLowerCase() === currentChallenge.sentence.translation.toLowerCase();
    
    setIsCorrect(isUserCorrect);
    
    setTimeout(() => {
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex(currentChallengeIndex + 1);
      } else {
        setCompleted(true);
        completeLesson(lessonId);
        addXP(lesson.xpReward);
        
        toast({
          title: "Lesson Completed!",
          description: `You earned ${lesson.xpReward} XP!`,
        });
        
        navigate(`/victory/${lessonId}`);
      }
    }, 2500);
  };
  
  return (
    <div className="min-h-screen py-6 px-4 bg-[#1A1F2C] text-white">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-[#9b87f5] font-medium"
            onClick={() => navigate(`/path/${level.id}/lesson/${lessonId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="text-sm font-medium">
            {currentChallengeIndex + 1}/{challenges.length}
          </div>
        </div>
        
        <div className="w-full bg-[#2A2F3C] rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: `${((currentChallengeIndex) / challenges.length) * 100}%` }}
            animate={{ width: `${((currentChallengeIndex + 1) / challenges.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-[#9b87f5] h-2 rounded-full"
          />
        </div>
        
        {currentChallenge && currentChallenge.sentence && (
          <>
            <div className="mb-8">
              <div className="relative">
                <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                  <MessageSquare className="w-6 h-6 text-[#9b87f5]" />
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#2A2F3C] p-6 rounded-xl ml-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm text-[#8E9196]">Translate this phrase:</h2>
                    <button className="p-2 rounded-full bg-[#2A2F3C] hover:bg-[#363C4A]">
                      <Volume className="w-5 h-5 text-[#9b87f5]" />
                    </button>
                  </div>
                  <div className="arabic-text text-2xl font-bold">
                    {currentChallenge.sentence.arabic}
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="bg-[#2A2F3C] border-2 border-dashed border-[#363C4A] rounded-xl p-4 min-h-16 mb-6">
              <motion.div className="flex flex-wrap gap-2">
                {selectedWords.length === 0 ? (
                  <div className="w-full text-center text-[#8E9196]">
                    Tap words to build your translation
                  </div>
                ) : (
                  selectedWords.map((word, index) => (
                    <motion.button
                      key={index}
                      className="bg-[#9b87f5] text-white py-2 px-4 rounded-xl text-sm font-medium"
                      onClick={() => handleRemoveWord(index)}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {word}
                    </motion.button>
                  ))
                )}
              </motion.div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <AnimatePresence>
                {availableWords.map((word, index) => (
                  <motion.button
                    key={`available-${index}`}
                    className="bg-[#363C4A] hover:bg-[#414958] text-white py-2 px-4 rounded-xl text-sm font-medium"
                    onClick={() => handleSelectWord(word, index)}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {word}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div 
                  className={`p-4 rounded-xl mb-4 ${
                    isCorrect ? 'bg-[#F2FCE2] text-green-800' : 'bg-[#FCEAEA] text-red-800'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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
            </AnimatePresence>
            
            <div className="flex justify-end">
              <Button
                className="bg-[#9b87f5] hover:bg-[#8a76e5] text-white px-8"
                onClick={handleSubmit}
                disabled={selectedWords.length === 0 || isCorrect !== null}
              >
                {isCorrect !== null ? 'NEXT' : 'CHECK'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SentenceTranslationChallengePage;
