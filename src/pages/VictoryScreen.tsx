
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useUser } from '@/contexts/UserContext';
import { Flame, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import levelsData from '@/data/levelsData';
import StreakCounter from '@/components/StreakCounter';

const VictoryScreen = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, completeLesson } = useUser();
  const [xpEarned, setXpEarned] = useState(0);
  
  // Find the lesson and its parent level
  const level = levelsData.find(level => 
    level.lessons.some(lesson => lesson.id === lessonId)
  );
  
  const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
  
  useEffect(() => {
    if (lesson && !userState.completedLessons.includes(lesson.id)) {
      // Mark lesson as completed and add XP
      completeLesson(lesson.id);
      setXpEarned(lesson.xpReward);
      
      // Trigger confetti
      console.log('Showing victory confetti!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Second burst of confetti
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.1 }
        });
      }, 200);
      
      // Third burst of confetti
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.9 }
        });
      }, 400);
    }
    
    return () => {
      console.log('Cleaning up confetti');
    };
  }, [lesson, completeLesson, userState.completedLessons]);
  
  const handleContinue = () => {
    if (level) {
      // Navigate back to the SubLessonPathPage
      navigate(`/path/${level.id}`);
    } else {
      navigate('/');
    }
  };
  
  if (!lesson || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button 
            onClick={() => navigate('/')}
          >
            Return to Path
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#131F2B] to-[#1C2A3B] text-white">
      <motion.div 
        className="w-full max-w-md bg-[#2D4153] rounded-3xl shadow-lg p-8 text-center relative overflow-hidden border border-white/10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background decoration */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#58CC02]/10 blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-[#FFC800]/10 blur-3xl"></div>
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-6xl animate-bounce-subtle">🎉</span>
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2 text-white">Lesson Complete!</h1>
        <p className="text-white/70 mb-6">
          You've mastered "{lesson.title}"
        </p>
        
        <div className="bg-[#1A2A3A] rounded-lg p-6 mb-6 relative">
          <motion.div 
            className="text-xl font-bold mb-3 text-[#58CC02] flex items-center justify-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Trophy className="w-5 h-5" />
            <span>+{xpEarned} XP Earned</span>
          </motion.div>
          
          <motion.div
            className="flex justify-center items-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 bg-[#2D4153] px-4 py-2 rounded-full">
              <span className="text-white/70">Total XP:</span>
              <span className="text-[#FFC800] font-bold">{userState.xp}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-[#2D4153] px-4 py-2 rounded-full">
              <Flame className="w-5 h-5 text-[#FF9600]" />
              <span className="text-[#FF9600] font-bold">{userState.streak}</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-6"
        >
          <StreakCounter className="flex justify-center items-center gap-2 mb-4" />
          
          <p className="text-white/70 text-sm">
            Keep your streak going! Practice daily to advance further.
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <Button 
            onClick={handleContinue}
            className="w-full py-6 bg-[#58CC02] hover:bg-[#58CC02]/90 text-[#181602] font-bold rounded-xl text-lg flex items-center justify-center gap-2"
          >
            Back to Unit
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VictoryScreen;
