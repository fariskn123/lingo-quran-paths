
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, HelpCircle, MessageSquare, Puzzle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import XPBar from '@/components/XPBar';
import levelsData from '@/data/levelsData';

const SubLessonDetailPage = () => {
  const { unitId, lessonId } = useParams<{ unitId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { userState } = useUser();
  
  // Find the level and lesson data
  const level = levelsData.find(level => level.id === unitId);
  const lesson = level?.lessons.find(lesson => lesson.id === lessonId);
  
  if (!lesson || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button 
            onClick={() => navigate('/')}
          >
            Return to Path
          </Button>
        </div>
      </div>
    );
  }
  
  const isCompleted = userState.completedLessons.includes(lesson.id);
  
  // Determine the activity type based on the lesson
  const getActivityType = () => {
    // In a real app, this would be determined by the lesson data
    // For now, we'll just assume all lessons have these activities
    return [
      { 
        type: 'flashcard', 
        title: 'Flashcards', 
        description: 'Learn new vocabulary',
        icon: <BookOpen className="w-6 h-6 text-quran-green" />,
        path: `/flashcards/${lessonId}`
      },
      { 
        type: 'quiz', 
        title: 'Quiz', 
        description: 'Test your knowledge',
        icon: <HelpCircle className="w-6 h-6 text-quran-gold" />,
        path: `/quiz/${lessonId}`
      },
      { 
        type: 'challenge', 
        title: 'Translation Challenge', 
        description: 'Practice sentences',
        icon: <MessageSquare className="w-6 h-6 text-level-3" />,
        path: `/challenge/${lessonId}`
      }
    ];
  };
  
  const activities = getActivityType();
  
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-quran-green font-medium"
            onClick={() => navigate(`/path/${unitId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className={`py-1 px-3 rounded-full text-white text-sm bg-${level.color}`}>
            {level.emoji} {level.name}
          </div>
        </div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          <XPBar />
          
          {isCompleted && (
            <div className="bg-green-50 text-green-800 rounded-lg p-3 mt-4 text-sm">
              You've completed this lesson! Review it anytime.
            </div>
          )}
        </motion.div>
        
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold">Learning Activities</h2>
          
          {activities.map((activity, index) => (
            <motion.div
              key={activity.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    {activity.icon}
                    <div className="ml-2">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full"
                    onClick={() => navigate(activity.path)}
                  >
                    Start
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
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

export default SubLessonDetailPage;
