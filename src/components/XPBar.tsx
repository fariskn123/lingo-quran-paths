
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Progress } from '@/components/ui/progress';

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
    <div className={`w-full ${className}`}>
      {showXP && (
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">XP: {userState.xp}</span>
          <span className="font-medium">{userState.xp % xpToNextLevel}/{xpToNextLevel}</span>
        </div>
      )}
      <Progress 
        value={progress} 
        className="h-2 bg-gray-200"
      />
    </div>
  );
};

export default XPBar;
