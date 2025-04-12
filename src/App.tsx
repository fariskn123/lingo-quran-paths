
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

// Pages
import HomePage from "./pages/HomePage";
import LevelsPage from "./pages/LevelsPage";
import LevelDetailPage from "./pages/LevelDetailPage";
import LessonPage from "./pages/LessonPage";
import FlashcardLessonPage from "./pages/FlashcardLessonPage";
import QuizPage from "./pages/QuizPage";
import ChallengeTranslationPage from "./pages/ChallengeTranslationPage";
import VictoryScreen from "./pages/VictoryScreen";
import ReviewPage from "./pages/ReviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/levels" element={<LevelsPage />} />
            <Route path="/level/:levelId" element={<LevelDetailPage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/flashcards/:lessonId" element={<FlashcardLessonPage />} />
            <Route path="/quiz/:lessonId" element={<QuizPage />} />
            <Route path="/challenge/:lessonId" element={<ChallengeTranslationPage />} />
            <Route path="/victory/:lessonId" element={<VictoryScreen />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
