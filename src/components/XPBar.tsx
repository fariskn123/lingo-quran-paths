
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface XPBarProps {
  showXP?: boolean;
  className?: string;
  xpToNextLevel?: number;
}

const XPBar: React.FC<XPBarProps> = ({ showXP = true, className = '', xpToNextLevel = 50 }) => {
  const { userState } = useUser();
  
  // Calculate progress percentage
  const currentLevelXP = Math.floor(userState.xp / xpToNextLevel) * xpToNextLevel;
  const progress = ((userState.xp - currentLevelXP) / xpToNextLevel) * 100;
  
  return (
    <div className={cn("w-full", className)}>
      {showXP && (
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">XP: {userState.xp}</span>
          <span className="font-medium">{userState.xp % xpToNextLevel}/{xpToNextLevel}</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-quran-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default XPBar;
