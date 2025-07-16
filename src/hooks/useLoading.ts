import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  type: 'booking' | 'payment' | 'search' | 'upload' | 'page';
  message?: string;
  progress?: number;
}

export const useLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    type: 'page'
  });

  const showLoading = useCallback((
    type: LoadingState['type'] = 'page', 
    message?: string,
    progress?: number
  ) => {
    setLoadingState({
      isLoading: true,
      type,
      message,
      progress
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false
    }));
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }));
  }, []);

  return {
    ...loadingState,
    showLoading,
    hideLoading,
    updateProgress,
    updateMessage
  };
};