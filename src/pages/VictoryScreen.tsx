
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import levelsData from '@/data/levelsData';

const VictoryScreen = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState } = useUser();
  
  // Find the lesson and its parent level
  const level = levelsData.find(level => 
    level.lessons.some(lesson => lesson.id === lessonId)
  );
  
  const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
  
  if (!lesson || !level) {
    navigate('/levels');
    return null;
  }
  
  // Find next lesson
  const levelLessons = level.lessons;
  const currentLessonIndex = levelLessons.findIndex(l => l.id === lessonId);
  const nextLesson = levelLessons[currentLessonIndex + 1];
  
  // Find next level if this was the last lesson
  const levelIndex = levelsData.findIndex(l => l.id === level.id);
  const nextLevel = !nextLesson && levelIndex < levelsData.length - 1 
    ? levelsData[levelIndex + 1] 
    : null;
  const isNextLevelUnlocked = nextLevel 
    ? userState.unlockedLevels.includes(nextLevel.id)
    : false;
  
  // Confetti effect
  useEffect(() => {
    // This would be implemented with a confetti library in a real app
    console.log('Showing victory confetti!');
    
    return () => {
      console.log('Cleaning up confetti');
    };
  }, []);
  
  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    } else if (nextLevel && isNextLevelUnlocked) {
      navigate(`/level/${nextLevel.id}`);
    } else {
      navigate('/levels');
    }
  };
  
  return (
    <div className="min-h-screen bg-quran-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="animate-bounce-subtle mb-8">
          <Award className="w-24 h-24 mx-auto text-quran-gold" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Excellent!</h1>
        <h2 className="text-xl text-gray-700 mb-8">You completed "{lesson.title}"</h2>
        
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-quran-gold rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-white font-bold">+{lesson.xpReward}</span>
            </div>
            <div className="text-left">
              <div className="font-bold">XP Earned</div>
              <div className="text-sm text-gray-600">Total: {userState.xp} XP</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            You've mastered {lesson.words.length} new words!
          </div>
          
          {nextLevel && !isNextLevelUnlocked && (
            <div className="bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm">
              Keep learning to unlock {nextLevel.name} ({nextLevel.xpRequired - userState.xp} XP needed)
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {(nextLesson || (nextLevel && isNextLevelUnlocked)) && (
            <Button 
              className="btn-primary"
              onClick={handleNextLesson}
            >
              {nextLesson 
                ? 'Next Lesson' 
                : `Start ${nextLevel?.name}`
              }
            </Button>
          )}
          
          <Button 
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => navigate('/levels')}
          >
            <Home className="w-4 h-4" />
            Lesson Path
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => navigate(`/lesson/${lessonId}`)}
          >
            <RotateCcw className="w-4 h-4" />
            Review Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;
