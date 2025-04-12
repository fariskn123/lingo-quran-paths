
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, LockIcon } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Lesson } from '@/data/levelsData';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isLocked: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isCompleted, isLocked }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (!isLocked) {
      navigate(`/lesson/${lesson.id}`);
    }
  };
  
  return (
    <div 
      className={`card mb-4 transition-all duration-200 ${
        isLocked ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1'
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{lesson.title}</h3>
        {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-level-1" />
        ) : isLocked ? (
          <LockIcon className="w-6 h-6 text-gray-400" />
        ) : (
          <div className="rounded-full bg-quran-gold text-white text-xs font-bold px-2 py-1">
            +{lesson.xpReward} XP
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
      <div className="text-xs text-gray-500">
        {lesson.words.length} words · {lesson.challenges.length} challenges
      </div>
    </div>
  );
};

export default LessonCard;
