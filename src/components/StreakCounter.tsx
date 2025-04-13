
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Flame, Brain } from 'lucide-react';

interface StreakCounterProps {
  className?: string;
  showIcon?: 'flame' | 'brain' | null;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ className = '', showIcon = 'flame' }) => {
  const { userState } = useUser();
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon === 'flame' && (
        <Flame className="w-5 h-5 animate-bounce-subtle text-orange-500" />
      )}
      {showIcon === 'brain' && (
        <Brain className="w-5 h-5 animate-bounce-subtle text-purple-500" />
      )}
      <span className="font-bold">{userState.streak} day streak</span>
    </div>
  );
};

export default StreakCounter;
