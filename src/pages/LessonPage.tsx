
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import levelsData from '@/data/levelsData';

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState } = useUser();
  
  // Find the lesson and its parent level
  const level = levelsData.find(level => 
    level.lessons.some(lesson => lesson.id === lessonId)
  );
  
  const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
  
  if (!lesson || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <button 
            className="btn-primary"
            onClick={() => navigate('/levels')}
          >
            Return to Levels
          </button>
        </div>
      </div>
    );
  }
  
  const isCompleted = userState.completedLessons.includes(lesson.id);
  
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate(`/path/${level.id}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className={`py-1 px-3 rounded-full text-white text-sm bg-${level.color}`}>
            {level.emoji} {level.name}
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          <XPBar />
          
          {isCompleted && (
            <div className="bg-green-50 text-green-800 rounded-lg p-3 mt-4 text-sm">
              You've completed this lesson! Review it anytime.
            </div>
          )}
        </div>
        
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold">Learning Activities</h2>
          
          <Button 
            variant="outline" 
            className="w-full py-6 px-4 justify-start gap-3 text-lg"
            onClick={() => navigate(`/flashcards/${lessonId}`)}
          >
            <BookOpen className="w-6 h-6 text-quran-green" />
            <div className="text-left">
              <div className="font-bold">Flashcards</div>
              <div className="text-sm text-gray-500">Learn new vocabulary</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-6 px-4 justify-start gap-3 text-lg"
            onClick={() => navigate(`/quiz/${lessonId}`)}
          >
            <HelpCircle className="w-6 h-6 text-quran-gold" />
            <div className="text-left">
              <div className="font-bold">Quiz</div>
              <div className="text-sm text-gray-500">Test your knowledge</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-6 px-4 justify-start gap-3 text-lg"
            onClick={() => navigate(`/challenge/${lessonId}`)}
          >
            <MessageSquare className="w-6 h-6 text-level-3" />
            <div className="text-left">
              <div className="font-bold">Challenge Quiz</div>
              <div className="text-sm text-gray-500">Multiple choice challenges</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-6 px-4 justify-start gap-3 text-lg"
            onClick={() => navigate(`/challenge-translation/${lessonId}`)}
          >
            <MessageSquare className="w-6 h-6 text-level-4" />
            <div className="text-left">
              <div className="font-bold">Translation Builder</div>
              <div className="text-sm text-gray-500">Build English translations</div>
            </div>
          </Button>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-bold mb-2">What You'll Learn</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {lesson.words.map(word => (
              <li key={word.id}>{word.arabic} ({word.transliteration}) - {word.meaning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
