
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  className?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ className = '' }) => {
  const { userState } = useUser();
  
  return (
    <div className={cn("flex items-center gap-1 text-quran-gold", className)}>
      <Flame className="w-5 h-5 animate-pulse text-quran-gold" />
      <span className="font-semibold">{userState.streak}</span>
      <span className="text-sm text-gray-600">day streak</span>
    </div>
  );
};

export default StreakCounter;
