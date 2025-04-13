
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, CheckCircle, Lock } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import StreakCounter from '@/components/StreakCounter';
import levelsData, { Level, Lesson } from '@/data/levelsData';
import { useLessonIndex } from '@/hooks/useLessonIndex';

const SubLessonPathPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const { userState } = useUser();
  const [level, setLevel] = useState<Level | null>(null);
  const { lessonIndex, isLoading: isLoadingIndex } = useLessonIndex();
  const [dynamicLessons, setDynamicLessons] = useState<any[]>([]);

  useEffect(() => {
    // First try to find level in static data
    const foundLevel = levelsData.find(level => level.id === unitId);
    
    if (foundLevel) {
      setLevel(foundLevel);
    } else if (unitId) {
      // Create a placeholder level if not found in static data
      setLevel({
        id: unitId,
        name: unitId.replace(/-/g, ' '),
        emoji: '📚',
        color: 'quran-green',
        description: 'Learning path',
        lessons: [],
      });
    }
  }, [unitId]);

  // Load dynamic lessons from the lesson index
  useEffect(() => {
    if (lessonIndex && unitId && lessonIndex[unitId]) {
      setDynamicLessons(lessonIndex[unitId]);
    }
  }, [lessonIndex, unitId]);

  // Combine static and dynamic lessons
  const allLessons = level?.lessons.concat(
    dynamicLessons.filter(dl => 
      !level?.lessons.some(sl => sl.id === dl.lessonId)
    ).map(dl => ({
      id: dl.lessonId,
      title: dl.title,
      description: dl.description || 'Learn new vocabulary',
      words: [], // Will be loaded when lesson is opened
      challenges: [],
      xpReward: 50,
    } as Lesson))
  ) || [];

  if (isLoadingIndex) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-quran-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Loading lessons...</h2>
        </div>
      </div>
    );
  }

  if (!level && !isLoadingIndex) {
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

  const isLessonLocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return false;
    
    const prevLesson = allLessons[lessonIndex - 1];
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
          <div className="flex justify-between items-center">
            <XPBar />
            <StreakCounter className="ml-4" />
          </div>
        </div>
        
        <div className="relative pb-20">
          {allLessons.map((lesson, index) => {
            const isCompleted = userState.completedLessons.includes(lesson.id);
            const isLocked = isLessonLocked(index);
            
            const lessonProgress = isCompleted ? 100 : 0;
            
            return (
              <div key={lesson.id} className="relative mb-14">
                {index < allLessons.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-20 h-16 w-0.5 bg-gray-300 z-0"></div>
                )}
                
                <motion.div 
                  className="flex flex-col items-center relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => !isLocked && navigate(`/path/${level.id}/lesson/${lesson.id}`)}
                >
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

const renderLessonIcon = (lesson: Lesson, isCompleted: boolean) => {
  if (isCompleted) {
    return <CheckCircle className="w-6 h-6" />;
  } else {
    return <Book className="w-6 h-6" />;
  }
};

export default SubLessonPathPage;
