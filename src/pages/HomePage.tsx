
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import StreakCounter from '@/components/StreakCounter';

const HomePage = () => {
  const navigate = useNavigate();
  const { userState, checkAndUpdateStreak } = useUser();
  
  // Check streak when component mounts
  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);
  
  const handleContinue = () => {
    navigate('/levels');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center flex flex-col items-center">
        <div className="mb-8 animate-scale-in">
          <Book className="w-20 h-20 text-quran-green mb-2" />
          <h1 className="text-4xl font-bold text-quran-green mb-2">Qur'ānLingo</h1>
          <p className="text-gray-600">Master Qur'anic Arabic vocabulary with a structured approach</p>
        </div>
        
        <div className="w-full mb-8 animate-slide-up">
          <div className="mb-6">
            <h2 className="font-bold text-gray-700 mb-2">Your Progress</h2>
            <XPBar className="mb-4" />
            <div className="flex justify-center">
              <StreakCounter />
              <span className="ml-2 text-gray-600">day streak</span>
            </div>
          </div>
          
          <Button 
            className="btn-primary w-full"
            onClick={handleContinue}
          >
            {userState.completedLessons.length > 0 ? 'Continue Learning' : 'Start Learning'}
          </Button>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p className="mb-1">Learn with purpose</p>
          <p>Connect deeply with the Qur'an</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
