
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserState {
  xp: number;
  streak: number;
  lastLoginDate: string | null;
  completedLessons: string[];
  unlockedLevels: string[];
}

interface UserContextType {
  userState: UserState;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  checkAndUpdateStreak: () => void;
  resetProgress: () => void;
}

const initialUserState: UserState = {
  xp: 0,
  streak: 0,
  lastLoginDate: null,
  completedLessons: [],
  unlockedLevels: ['level-1'] // Level 1 is always unlocked
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(() => {
    const savedState = localStorage.getItem('quranLingo_userState');
    return savedState ? JSON.parse(savedState) : initialUserState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('quranLingo_userState', JSON.stringify(userState));
  }, [userState]);

  // Check streak on initial load
  useEffect(() => {
    checkAndUpdateStreak();
  }, []);

  // Update XP and unlock levels
  const addXP = (amount: number) => {
    setUserState(prev => {
      const newXP = prev.xp + amount;
      
      // Check if new levels should be unlocked
      const unlockedLevels = [...prev.unlockedLevels];
      
      // This would come from level data in a real app
      const xpThresholds = [
        { level: 'level-1', xp: 0 },
        { level: 'level-2', xp: 50 },
        { level: 'level-3', xp: 100 },
        { level: 'level-4', xp: 150 },
        { level: 'level-5', xp: 200 }
      ];
      
      xpThresholds.forEach(({ level, xp }) => {
        if (newXP >= xp && !unlockedLevels.includes(level)) {
          unlockedLevels.push(level);
        }
      });
      
      return {
        ...prev,
        xp: newXP,
        unlockedLevels
      };
    });
  };

  // Mark a lesson as completed
  const completeLesson = (lessonId: string) => {
    setUserState(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }
      
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      };
    });
  };

  // Check and update streak based on daily login
  const checkAndUpdateStreak = () => {
    const today = new Date().toLocaleDateString();
    
    setUserState(prev => {
      // If never logged in or first login today
      if (!prev.lastLoginDate) {
        return {
          ...prev,
          streak: 1,
          lastLoginDate: today
        };
      }
      
      // Convert dates to proper Date objects for comparison
      const lastLogin = new Date(prev.lastLoginDate).setHours(0, 0, 0, 0);
      const currentDate = new Date(today).setHours(0, 0, 0, 0);
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If already logged in today, don't change anything
      if (new Date(lastLogin).toDateString() === new Date(currentDate).toDateString()) {
        return prev;
      }
      
      // If logged in yesterday, increment streak
      if (new Date(lastLogin).toDateString() === yesterday.toDateString()) {
        return {
          ...prev,
          streak: prev.streak + 1,
          lastLoginDate: today
        };
      }
      
      // If more than a day has passed, reset streak
      return {
        ...prev,
        streak: 1,
        lastLoginDate: today
      };
    });
  };

  // Reset all progress
  const resetProgress = () => {
    setUserState(initialUserState);
  };

  return (
    <UserContext.Provider value={{ 
      userState, 
      addXP, 
      completeLesson, 
      checkAndUpdateStreak,
      resetProgress
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
