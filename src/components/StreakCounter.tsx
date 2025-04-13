
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Flame, Brain, Star, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakCounterProps {
  className?: string;
  showMotivation?: boolean;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ className = '', showMotivation = false }) => {
  const { userState } = useUser();
  
  const getMotivationalMessage = () => {
    if (userState.streak === 0) return "Start your learning journey today!";
    if (userState.streak < 3) return "Great start! Keep going!";
    if (userState.streak < 7) return "You're building momentum!";
    if (userState.streak < 14) return "You're on fire! Consistency is key!";
    if (userState.streak < 30) return "Amazing dedication!";
    return "Incredible commitment to learning!";
  };
  
  const getStreakEmoji = () => {
    if (userState.streak >= 30) return <Award className="w-6 h-6 text-purple-500" />;
    if (userState.streak >= 14) return <Star className="w-6 h-6 text-yellow-500" />;
    if (userState.streak >= 7) return <Brain className="w-6 h-6 text-cyan-500" />;
    return <Flame className="w-6 h-6 text-quran-gold" />;
  };

  return (
    <div className={`streak-counter flex items-center gap-1 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              {getStreakEmoji()}
              <span className="text-lg font-semibold">{userState.streak}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMotivationalMessage()}</p>
            <p className="text-xs mt-1">Day streak: {userState.streak}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showMotivation && (
        <span className="text-sm text-gray-600 ml-2">{getMotivationalMessage()}</span>
      )}
    </div>
  );
};

export default StreakCounter;
