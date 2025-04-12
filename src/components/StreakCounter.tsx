
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  className?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ className = '' }) => {
  const { userState } = useUser();
  
  return (
    <div className={`streak-counter ${className}`}>
      <Flame className="w-6 h-6 animate-bounce-subtle text-quran-gold" />
      <span className="text-lg">{userState.streak}</span>
    </div>
  );
};

export default StreakCounter;
