
import { useState, useEffect } from 'react';

export interface Word {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  partOfSpeech?: string;
  root?: string;
}

export interface Sentence {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  words?: string[]; // IDs of the words used in the sentence
}

export interface LessonData {
  lessonId: string;
  unitId: string;
  title: string;
  description?: string;
  words: Word[];
  sentences: Sentence[];
}

export const useLessonData = (unitId?: string, lessonId?: string) => {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!unitId || !lessonId) {
      return;
    }

    const fetchLessonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/data/lessons/${unitId}/${lessonId}.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson data: ${response.status}`);
        }
        
        const data = await response.json();
        setLessonData(data);
      } catch (err) {
        console.error(`Error loading lesson data for ${unitId}/${lessonId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to load lesson ${lessonId}`));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [unitId, lessonId]);

  return { lessonData, isLoading, error };
};
