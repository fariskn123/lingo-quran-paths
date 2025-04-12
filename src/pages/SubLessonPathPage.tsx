
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, HelpCircle, MessageSquare, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import levelsData, { Level, Lesson } from '@/data/levelsData';

const SubLessonPathPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const { userState } = useUser();
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    // Find the level data based on unitId
    const foundLevel = levelsData.find(level => level.id === unitId);
    if (foundLevel) {
      setLevel(foundLevel);
    }
  }, [unitId]);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unit not found</h1>
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

  // Determine if a lesson is locked based on previous lessons completion
  const isLessonLocked = (lessonIndex: number) => {
    // First lesson in a level is always unlocked if the level is unlocked
    if (lessonIndex === 0) return false;
    
    // For other lessons, check if previous lesson is completed
    const prevLesson = level.lessons[lessonIndex - 1];
    return prevLesson && !userState.completedLessons.includes(prevLesson.id);
  };

  return (
    <div className="min-h-screen py-6 px-4 bg-quran-background">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Path
          </button>
          <div className={`py-1 px-3 rounded-full text-white text-sm bg-${level.color}`}>
            {level.emoji} {level.name}
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{level.name}</h1>
          <p className="text-gray-600 mb-4">{level.description}</p>
          <XPBar />
        </div>
        
        <div className="relative pb-20">
          {level.lessons.map((lesson, index) => {
            const isCompleted = userState.completedLessons.includes(lesson.id);
            const isLocked = isLessonLocked(index);
            
            // Calculate progress percentage for the circle
            const lessonProgress = isCompleted ? 100 : 0;
            
            return (
              <div key={lesson.id} className="relative mb-14">
                {/* Connecting line */}
                {index < level.lessons.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-20 h-16 w-0.5 bg-gray-300 z-0"></div>
                )}
                
                <motion.div 
                  className="flex flex-col items-center relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
                >
                  {/* Progress ring around circle */}
                  <div className={`relative ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      {!isLocked && (
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: lessonProgress / 100 }}
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
                        className={`${!isLocked ? `fill-${level.color}` : 'fill-gray-300'}`}
                      />
                    </svg>
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">
                      {renderLessonIcon(lesson, isCompleted)}
                    </div>
                    
                    {!isLocked ? (
                      isCompleted && (
                        <div className="absolute -right-1 -bottom-1 bg-white p-1 rounded-full shadow-md">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )
                    ) : (
                      <div className="absolute -right-1 -bottom-1 bg-white p-1 rounded-full shadow-md">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-center">
                    <h3 className={`font-bold ${!isLocked ? `text-${level.color}` : 'text-gray-400'}`}>
                      {lesson.title}
                    </h3>
                    
                    {!isLocked ? (
                      <span className="text-xs text-gray-600 block">
                        {isCompleted ? 'Completed' : `+${lesson.xpReward} XP`}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 block">
                        Complete previous lesson to unlock
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

// Helper function to render the appropriate icon based on lesson type
const renderLessonIcon = (lesson: Lesson, isCompleted: boolean) => {
  // This is a simplified approach - in a real app, you might have a lesson type property
  // For now, we'll just use a Book icon for all lessons
  if (isCompleted) {
    return <CheckCircle className="w-6 h-6" />;
  } else {
    return <Book className="w-6 h-6" />;
  }
};

export default SubLessonPathPage;
