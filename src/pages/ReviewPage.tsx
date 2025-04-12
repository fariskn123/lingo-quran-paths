
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Repeat, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import levelsData, { Word } from '@/data/levelsData';

// Define review buckets based on spaced repetition
interface ReviewWord extends Word {
  lessonId: string;
  bucket: number; // 1 = daily, 2 = every 3 days, 3 = weekly, 4 = mastered
  nextReview: Date;
}

const REVIEW_KEY = 'quranLingo_reviewWords';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { userState, addXP } = useUser();
  
  const [reviewWords, setReviewWords] = useState<ReviewWord[]>([]);
  const [dueWords, setDueWords] = useState<ReviewWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Load review words on mount
  useEffect(() => {
    const storedReviewWords = localStorage.getItem(REVIEW_KEY);
    
    if (storedReviewWords) {
      // Parse and fix dates (they're stored as strings in localStorage)
      const parsed = JSON.parse(storedReviewWords).map((word: any) => ({
        ...word,
        nextReview: new Date(word.nextReview)
      }));
      setReviewWords(parsed);
    } else {
      // Initialize with words from completed lessons
      const initialReviewWords: ReviewWord[] = [];
      
      userState.completedLessons.forEach(lessonId => {
        const level = levelsData.find(level => 
          level.lessons.some(lesson => lesson.id === lessonId)
        );
        
        const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
        
        if (lesson) {
          lesson.words.forEach(word => {
            initialReviewWords.push({
              ...word,
              lessonId,
              bucket: 1,
              nextReview: new Date() // Due immediately
            });
          });
        }
      });
      
      setReviewWords(initialReviewWords);
      localStorage.setItem(REVIEW_KEY, JSON.stringify(initialReviewWords));
    }
  }, [userState.completedLessons]);
  
  // Filter for due words
  useEffect(() => {
    const now = new Date();
    const due = reviewWords.filter(word => word.nextReview <= now);
    setDueWords(due);
  }, [reviewWords]);
  
  // No words to review
  if (dueWords.length === 0 && !completed) {
    return (
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button 
              className="flex items-center text-quran-green font-medium"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Home
            </button>
          </div>
          
          <div className="text-center my-16">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">No Words to Review</h1>
            <p className="text-gray-600 mb-8">
              Great job! You've completed all your reviews for now.
              Check back later for more words to review.
            </p>
            <Button 
              className="btn-primary"
              onClick={() => navigate('/levels')}
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get current review word
  const currentWord = dueWords[currentIndex];
  
  // Handle when user marks a word as correct
  const handleKnown = () => {
    updateWordBucket(true);
  };
  
  // Handle when user marks a word as incorrect
  const handleUnknown = () => {
    updateWordBucket(false);
  };
  
  // Update the review bucket for a word based on user response
  const updateWordBucket = (known: boolean) => {
    const updatedReviewWords = [...reviewWords];
    const wordIndex = updatedReviewWords.findIndex(w => w.id === currentWord.id);
    
    if (wordIndex >= 0) {
      const word = updatedReviewWords[wordIndex];
      
      // Update bucket based on whether user knew the word
      let newBucket = word.bucket;
      if (known) {
        // Move to next bucket if correct
        newBucket = Math.min(4, word.bucket + 1);
      } else {
        // Move back to bucket 1 if incorrect
        newBucket = 1;
      }
      
      // Calculate next review date based on bucket
      const now = new Date();
      let nextReview = new Date();
      
      switch (newBucket) {
        case 1: // daily
          nextReview.setDate(now.getDate() + 1);
          break;
        case 2: // every 3 days
          nextReview.setDate(now.getDate() + 3);
          break;
        case 3: // weekly
          nextReview.setDate(now.getDate() + 7);
          break;
        case 4: // mastered - monthly
          nextReview.setDate(now.getDate() + 30);
          break;
        default:
          nextReview.setDate(now.getDate() + 1);
      }
      
      // Update the word
      updatedReviewWords[wordIndex] = {
        ...word,
        bucket: newBucket,
        nextReview
      };
      
      // Save updated words
      setReviewWords(updatedReviewWords);
      localStorage.setItem(REVIEW_KEY, JSON.stringify(updatedReviewWords));
      
      // Award XP for reviews
      if (known) {
        addXP(1); // Small XP reward for each correct review
      }
    }
    
    // Move to next word or complete
    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      setCompleted(true);
      addXP(5); // Bonus XP for completing all reviews
    }
  };
  
  // Completed all reviews
  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Review Completed!</h1>
          <p className="mb-2">You've reviewed {dueWords.length} words.</p>
          <p className="text-quran-gold font-bold mb-6">+{dueWords.length + 5} XP earned</p>
          
          <div className="flex flex-col gap-4">
            <Button 
              className="btn-primary"
              onClick={() => navigate('/levels')}
            >
              Continue Learning
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Home
          </button>
          <div className="flex items-center text-gray-600">
            <Repeat className="w-5 h-5 mr-1" />
            <span>{currentIndex + 1}/{dueWords.length}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Daily Review</h1>
          <p className="text-gray-600">Reviewing words from your learned lessons</p>
        </div>
        
        <div 
          className={`card aspect-[3/4] flex flex-col items-center justify-center p-6 mb-6 cursor-pointer transition-all duration-500 ${
            flipped ? 'bg-white' : 'bg-quran-background'
          }`}
          onClick={() => setFlipped(!flipped)}
        >
          {!flipped ? (
            <div className="text-center">
              <div className="arabic-text text-4xl font-bold mb-4">
                {currentWord.arabic}
              </div>
              <div className="text-gray-600 text-lg">
                {currentWord.transliteration}
              </div>
              <div className="mt-6 text-sm text-gray-500">
                Tap to reveal meaning
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-bold mb-6">{currentWord.meaning}</div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="arabic-text text-lg mb-2">{currentWord.example.arabic}</p>
                <p className="text-gray-600 text-sm">{currentWord.example.translation}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            className="py-6"
            onClick={handleUnknown}
          >
            I need practice
          </Button>
          
          <Button 
            className="bg-level-1 text-white py-6 hover:bg-green-600"
            onClick={handleKnown}
          >
            I know this
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
