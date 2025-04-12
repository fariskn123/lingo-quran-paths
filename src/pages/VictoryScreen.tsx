import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useUser } from '@/contexts/UserContext';
import levelsData from '@/data/levelsData';

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
    }
    
    return () => {
      console.log('Cleaning up confetti');
    };
  }, [lesson, completeLesson, userState.completedLessons]);
  
  const handleContinue = () => {
    if (level) {
      // Navigate back to the SubLessonPathPage instead of QuranicPathPage
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
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Return to Path
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-6xl">🎉</span>
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Victory!</h1>
        <p className="text-gray-600 mb-6">
          You've completed "{lesson.title}"
        </p>
        
        <div className="bg-muted rounded-lg p-4 mb-8">
          <motion.div 
            className="text-xl font-bold mb-1 text-quran-gold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            +{xpEarned} XP Earned
          </motion.div>
          
          <motion.div
            className="text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            You now have {userState.xp} XP total
          </motion.div>
        </div>
        
        <motion.button
          className="btn-primary w-full"
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VictoryScreen;
