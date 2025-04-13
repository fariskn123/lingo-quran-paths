
import { useState, useEffect } from 'react';

export interface LessonIndexEntry {
  lessonId: string;
  unitId: string;
  title: string;
  description?: string;
}

export interface LessonIndex {
  [unitId: string]: LessonIndexEntry[];
}

export const useLessonIndex = () => {
  const [lessonIndex, setLessonIndex] = useState<LessonIndex | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLessonIndex = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/lessonIndex.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson index: ${response.status}`);
        }
        
        const data = await response.json();
        setLessonIndex(data);
      } catch (err) {
        console.error('Error loading lesson index:', err);
        setError(err instanceof Error ? err : new Error('Failed to load lesson index'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonIndex();
  }, []);

  return { lessonIndex, isLoading, error };
};
