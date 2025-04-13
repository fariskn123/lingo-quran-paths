
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, VolumeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import levelsData from '@/data/levelsData';

const FlashcardLessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, addXP } = useUser();
  
  // Find the lesson data
  const level = levelsData.find(level => 
    level.lessons.some(lesson => lesson.id === lessonId)
  );
  
  const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
  
  if (!lesson || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button 
            onClick={() => navigate('/path/' + level?.id || '')}
          >
            Return to Path
          </Button>
        </div>
      </div>
    );
  }
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const currentWord = lesson.words[currentCardIndex];
  const progress = ((currentCardIndex + 1) / lesson.words.length) * 100;
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleNext = () => {
    if (currentCardIndex < lesson.words.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    } else {
      // All cards reviewed
      setCompleted(true);
      addXP(5); // Give some XP for completing flashcards
    }
  };
  
  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };
  
  const playAudio = () => {
    // In a real app, this would play the pronunciation audio
    // This is just a placeholder
    console.log('Playing audio for:', currentWord.arabic);
  };
  
  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-quran-background">
        <motion.div 
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4">Flashcards Completed!</h1>
          <p className="mb-6">Great job reviewing all the words in this lesson.</p>
          <div className="flex flex-col gap-4">
            <Button 
              className="bg-quran-green text-white"
              onClick={() => navigate(`/quiz/${lessonId}`)}
            >
              Continue to Quiz
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/path/${level.id}`)}
            >
              Back to Path
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-6 px-4 bg-quran-background">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate(`/path/${level.id}/lesson/${lessonId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="text-sm font-medium">
            {currentCardIndex + 1}/{lesson.words.length}
          </div>
        </div>
        
        <div className="mb-4">
          <h1 className="text-xl font-bold">{lesson.title} Flashcards</h1>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div
              className="bg-quran-green h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </div>
        
        <motion.div 
          key={currentCardIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            className={`w-full aspect-[3/4] flex flex-col items-center justify-center p-6 mb-6 cursor-pointer transition-all duration-500 ${
              flipped ? 'bg-white' : 'bg-quran-background'
            }`}
            onClick={handleFlip}
          >
            <div className="text-center">
              {!flipped ? (
                <>
                  <div className="font-arabic text-4xl font-bold mb-4">
                    {currentWord.arabic}
                  </div>
                  <div className="text-gray-600 text-lg">
                    {currentWord.transliteration}
                  </div>
                  <button 
                    className="mt-6 text-quran-green"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio();
                    }}
                  >
                    <VolumeIcon className="w-8 h-8" />
                  </button>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold mb-6">{currentWord.meaning}</div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-arabic text-lg mb-2">{currentWord.example.arabic}</p>
                    <p className="text-gray-600 text-sm">{currentWord.example.translation}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
          >
            Previous
          </Button>
          
          <Button
            className="bg-quran-green text-white"
            onClick={handleNext}
          >
            {currentCardIndex === lesson.words.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          Tap the card to see {flipped ? 'the word' : 'the meaning'}
        </div>
      </div>
    </div>
  );
};

export default FlashcardLessonPage;
