
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import LessonCard from '@/components/LessonCard';
import levelsData from '@/data/levelsData';

const LevelDetailPage = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { userState } = useUser();
  
  const level = levelsData.find(l => l.id === levelId);
  
  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Level not found</h1>
          <button 
            className="btn-primary"
            onClick={() => navigate('/levels')}
          >
            Return to Levels
          </button>
        </div>
      </div>
    );
  }
  
  const isLevelUnlocked = userState.unlockedLevels.includes(level.id);
  
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate('/levels')}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Levels
          </button>
        </div>
        
        <div className="mb-6">
          <div className={`inline-block py-1 px-3 rounded-full text-white mb-2 bg-${level.color}`}>
            {level.emoji} {level.name}
          </div>
          <h1 className="text-2xl font-bold mb-1">{level.name}</h1>
          <p className="text-gray-600 mb-4">{level.description}</p>
          <XPBar />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Lessons</h2>
          
          {!isLevelUnlocked && (
            <div className="card bg-yellow-50 border border-yellow-200 mb-6">
              <p className="text-yellow-800">
                You need {level.xpRequired} XP to unlock this level. Keep learning!
              </p>
            </div>
          )}
          
          {level.lessons.map((lesson, index) => {
            const isCompleted = userState.completedLessons.includes(lesson.id);
            const previousLessonCompleted = index === 0 || 
              userState.completedLessons.includes(level.lessons[index-1].id);
            const isLocked = !isLevelUnlocked || (index > 0 && !previousLessonCompleted);
            
            return (
              <LessonCard 
                key={lesson.id} 
                lesson={lesson} 
                isCompleted={isCompleted} 
                isLocked={isLocked} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelDetailPage;
