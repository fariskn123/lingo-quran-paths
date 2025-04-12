
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import levelsData from '@/data/levelsData';

const QuizPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userState, addXP } = useUser();
  const { toast } = useToast();
  
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
  
  // Generate quiz questions from the lesson words
  const generateQuestions = () => {
    return lesson.words.map(word => ({
      id: word.id,
      arabic: word.arabic,
      transliteration: word.transliteration,
      question: `What does ${word.arabic} (${word.transliteration}) mean?`,
      correctAnswer: word.meaning,
      options: generateOptions(word.meaning, lesson.words)
    }));
  };
  
  // Generate options including the correct answer and 3 random incorrect ones
  const generateOptions = (correctAnswer: string, allWords: typeof lesson.words) => {
    const incorrectAnswers = allWords
      .filter(word => word.meaning !== correctAnswer)
      .map(word => word.meaning);
    
    const randomIncorrect = incorrectAnswers
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    return [correctAnswer, ...randomIncorrect].sort(() => 0.5 - Math.random());
  };
  
  const [questions] = useState(generateQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    // Auto-advance after delay
    setTimeout(() => {
      handleNext();
    }, 1500);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      const xpEarned = Math.round((score / questions.length) * lesson.xpReward);
      addXP(xpEarned);
      
      toast({
        title: "Quiz Completed!",
        description: `You earned ${xpEarned} XP!`,
      });
    }
  };
  
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
          
          <div className={`text-6xl mb-6 ${passed ? 'text-level-1' : 'text-red-500'}`}>
            {percentage}%
          </div>
          
          <p className="text-xl mb-2">You got {score} out of {questions.length} correct</p>
          
          <div className={`p-4 rounded-lg mb-8 ${
            passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {passed ? 'Great job! You passed the quiz.' : 'Keep practicing! Review the flashcards and try again.'}
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              className="btn-primary"
              onClick={() => navigate(`/challenge/${lessonId}`)}
            >
              Continue to Translation Challenge
            </Button>
            
            {!passed && (
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setIsCorrect(null);
                  setScore(0);
                  setQuizCompleted(false);
                }}
              >
                Try Again
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => navigate(`/lesson/${lessonId}`)}
            >
              Back to Lesson
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
            onClick={() => navigate(`/lesson/${lessonId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="text-sm font-medium">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
        
        <div className="mb-6">
          <h1 className="text-xl font-bold">{lesson.title} Quiz</h1>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-quran-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-lg mb-4">{currentQuestion.question}</h2>
          <div className="arabic-text text-3xl font-bold mb-4">
            {currentQuestion.arabic}
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                selectedAnswer === option 
                  ? isCorrect 
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                  : 'bg-white border-2 border-gray-200 hover:border-quran-green'
              }`}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {selectedAnswer === option && (
                  isCorrect 
                    ? <Check className="text-green-500 w-5 h-5" />
                    : <X className="text-red-500 w-5 h-5" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {selectedAnswer && (
          <div className={`p-3 rounded-lg mb-4 ${
            isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {isCorrect 
              ? 'Correct! Well done.' 
              : `Incorrect. The correct answer is "${currentQuestion.correctAnswer}".`
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
