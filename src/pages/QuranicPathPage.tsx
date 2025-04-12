
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import StreakCounter from '@/components/StreakCounter';
import levelsData from '@/data/levelsData';
import { Book, Lock, Check } from 'lucide-react';

const QuranicPathPage = () => {
  const navigate = useNavigate();
  const { userState, checkAndUpdateStreak } = useUser();
  
  // Check streak when component mounts
  React.useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);
  
  const handleLevelClick = (levelId: string) => {
    if (userState.unlockedLevels.includes(levelId)) {
      navigate(`/path/${levelId}`);
    }
  };
  
  return (
    <div className="min-h-screen py-6 px-4 bg-quran-background">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Book className="w-8 h-8 text-quran-green mr-2" />
            <h1 className="text-2xl font-bold text-quran-green">Qur'ānLingo</h1>
          </div>
          <StreakCounter />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Your Progress</h2>
          <XPBar />
          <p className="text-sm text-gray-600 mt-2">
            {userState.xp} XP total · Level {Math.floor(userState.xp / 50) + 1}
          </p>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Qur'anic Path</h2>
        
        <div className="relative pb-20">
          {levelsData.map((level, index) => {
            const isUnlocked = userState.unlockedLevels.includes(level.id);
            const hasCompletedLessons = level.lessons.some(lesson => 
              userState.completedLessons.includes(lesson.id)
            );
            
            // Calculate progress percentage
            const totalXpForLevel = level.xpRequired;
            const nextLevelXp = index < levelsData.length - 1 ? levelsData[index + 1].xpRequired : totalXpForLevel + 50;
            const xpProgress = isUnlocked ? Math.min(100, ((userState.xp - totalXpForLevel) / (nextLevelXp - totalXpForLevel)) * 100) : 0;
            
            return (
              <div key={level.id} className="relative mb-14">
                {/* Connecting line */}
                {index < levelsData.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-20 h-16 w-0.5 bg-gray-300 z-0"></div>
                )}
                
                <motion.div 
                  className="flex flex-col items-center relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleLevelClick(level.id)}
                >
                  {/* Progress ring around circle */}
                  <div className="relative">
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      {isUnlocked && (
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: xpProgress / 100 }}
                          transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke={`var(--tw-color-${level.color})`}
                          strokeWidth="6"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          strokeDasharray="289.02652413026095"
                          strokeDashoffset="0"
                          className={`text-${level.color}`}
                        />
                      )}
                      <circle
                        cx="50"
                        cy="50"
                        r="43"
                        className={`${isUnlocked ? `fill-${level.color}` : 'fill-gray-300'}`}
                      />
                    </svg>
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">
                      {level.emoji}
                    </div>
                    
                    {isUnlocked ? (
                      hasCompletedLessons && (
                        <div className="absolute -right-1 -bottom-1 bg-white p-1 rounded-full shadow-md">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                      )
                    ) : (
                      <div className="absolute -right-1 -bottom-1 bg-white p-1 rounded-full shadow-md">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-center">
                    <h3 className={`font-bold ${isUnlocked ? `text-${level.color}` : 'text-gray-400'}`}>
                      {level.name}
                    </h3>
                    
                    {isUnlocked ? (
                      <span className="text-xs text-gray-600 block">
                        {hasCompletedLessons ? `In progress (${userState.xp}/${nextLevelXp} XP)` : 'Ready to start'}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 block">
                        {level.xpRequired} XP to unlock
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuranicPathPage;
