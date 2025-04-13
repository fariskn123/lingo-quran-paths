
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { useEffect } from "react";

// Pages
import QuranicPathPage from "./pages/QuranicPathPage";
import SubLessonPathPage from "./pages/SubLessonPathPage";
import LevelsPage from "./pages/LevelsPage";
import LevelDetailPage from "./pages/LevelDetailPage";
import LessonPage from "./pages/LessonPage";
import SubLessonDetailPage from "./pages/SubLessonDetailPage";
import FlashcardLessonPage from "./pages/FlashcardLessonPage";
import QuizPage from "./pages/QuizPage";
import ChallengeQuizPage from "./pages/ChallengeQuizPage";
import ChallengeTranslationPage from "./pages/ChallengeTranslationPage";
import SentenceTranslationChallengePage from "./pages/SentenceTranslationChallengePage";
import VictoryScreen from "./pages/VictoryScreen";
import ReviewPage from "./pages/ReviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Dynamically load the Arabic font
  useEffect(() => {
    // Create link element for Google Font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
    document.head.appendChild(link);
    
    return () => {
      // Clean up when component unmounts
      document.head.removeChild(link);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<QuranicPathPage />} />
              <Route path="/path/:unitId" element={<SubLessonPathPage />} />
              <Route path="/path/:unitId/lesson/:lessonId" element={<SubLessonDetailPage />} />
              <Route path="/levels" element={<LevelsPage />} />
              <Route path="/level/:levelId" element={<LevelDetailPage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/flashcards/:lessonId" element={<FlashcardLessonPage />} />
              <Route path="/quiz/:lessonId" element={<QuizPage />} />
              <Route path="/challenge/:lessonId" element={<ChallengeQuizPage />} />
              <Route path="/challenge-translation/:lessonId" element={<ChallengeTranslationPage />} />
              <Route path="/sentence-translation/:lessonId" element={<SentenceTranslationChallengePage />} />
              <Route path="/victory/:lessonId" element={<VictoryScreen />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
