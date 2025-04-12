
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import StreakCounter from '@/components/StreakCounter';
import levelsData from '@/data/levelsData';

const LevelsPage = () => {
  const navigate = useNavigate();
  const { userState } = useUser();
  
  const handleLevelClick = (levelId: string) => {
    if (userState.unlockedLevels.includes(levelId)) {
      navigate(`/level/${levelId}`);
    }
  };
  
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Home
          </button>
          <StreakCounter />
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Qur'anic Path</h1>
          <XPBar />
        </div>
        
        <div className="space-y-4 mt-10">
          {levelsData.map((level, index) => {
            const isUnlocked = userState.unlockedLevels.includes(level.id);
            const hasCompletedLessons = level.lessons.some(lesson => 
              userState.completedLessons.includes(lesson.id)
            );
            
            // Calculate total lessons and completed lessons for this level
            const totalLessons = level.lessons.length;
            const completedLessons = level.lessons.filter(lesson => 
              userState.completedLessons.includes(lesson.id)
            ).length;
            
            return (
              <div key={level.id} className="relative">
                {/* Connecting line */}
                {index < levelsData.length - 1 && (
                  <div className={`absolute left-7 top-16 bottom-0 w-1 ${
                    isUnlocked ? `bg-${level.color}` : 'bg-gray-300'
                  }`}></div>
                )}
                
                <div 
                  className={`flex items-start relative z-10 ${isUnlocked ? '' : 'opacity-60'}`}
                  onClick={() => handleLevelClick(level.id)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full 
                    ${isUnlocked ? `bg-${level.color} text-white` : 'bg-gray-300 text-gray-600'} 
                    shadow-md text-xl font-bold shrink-0 mr-4`}
                  >
                    {level.emoji}
                  </div>
                  
                  <div className={`bg-white rounded-xl p-4 shadow flex-grow cursor-pointer 
                    ${isUnlocked ? 'hover:shadow-md' : 'cursor-not-allowed'}`}
                  >
                    <h2 className={`text-lg font-bold ${isUnlocked ? `text-${level.color}` : 'text-gray-500'}`}>
                      {level.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                    
                    {isUnlocked ? (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{completedLessons}/{totalLessons} lessons</span>
                        {!hasCompletedLessons && <span>Start now!</span>}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        Requires {level.xpRequired} XP to unlock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
