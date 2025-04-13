
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Brain } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface XPBarProps {
  showXP?: boolean;
  className?: string;
  xpToNextLevel?: number;
  showMotivation?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ 
  showXP = true, 
  className = '', 
  xpToNextLevel = 50,
  showMotivation = false
}) => {
  const { userState } = useUser();
  
  // Calculate progress percentage and level
  const currentLevel = Math.floor(userState.xp / xpToNextLevel) + 1;
  const currentLevelXP = (currentLevel - 1) * xpToNextLevel;
  const progress = ((userState.xp - currentLevelXP) / xpToNextLevel) * 100;
  
  const getMotivationalMessage = () => {
    if (progress < 20) return "Just starting this level!";
    if (progress < 50) return "Making good progress!";
    if (progress < 80) return "Almost there!";
    return "Ready to level up soon!";
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showXP && (
        <div className="flex justify-between text-sm mb-1">
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 font-medium cursor-help">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span>XP: {userState.xp}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Level {currentLevel}</p>
                  <p className="text-xs">Total experience points earned</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="font-medium">{userState.xp % xpToNextLevel}/{xpToNextLevel}</span>
        </div>
      )}
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse-glow"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {showMotivation && (
        <div className="text-xs text-gray-600 mt-1 text-right">{getMotivationalMessage()}</div>
      )}
    </div>
  );
};

export default XPBar;
