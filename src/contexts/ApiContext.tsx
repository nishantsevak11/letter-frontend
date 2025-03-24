import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authAPI, lettersAPI, Letter, User } from '@/services/api';
import { toast } from 'sonner';

interface ApiContextType {
  isLoading: boolean;
  user: User | null;
  letters: Letter[];
  fetchLetters: () => Promise<void>;
  getLetter: (id: string) => Promise<Letter | undefined>;
  saveLetter: (letter: { id?: string; title: string; content: string }) => Promise<Letter | undefined>;
  deleteLetter: (id: string) => Promise<boolean>;
  loginUrl: string;
  logoutUrl: string;
}

const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);

  const loginUrl = authAPI.getLoginUrl();
  const logoutUrl = authAPI.getLogoutUrl();

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchLetters = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await lettersAPI.getAllLetters();
      setLetters(data);
    } catch (error: any) {
      console.error("Error fetching letters:", error);
      if (error.message === "Unauthorized") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/";
      } else {
        toast.error("Failed to load letters");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getLetter = useCallback(async (id: string): Promise<Letter | undefined> => {
    if (!user) return undefined;

    try {
      setIsLoading(true);
      return await lettersAPI.getLetter(id);
    } catch (error: any) {
      console.error(`Error fetching letter ${id}:`, error);
      if (error.message === "Unauthorized") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/";
      } else {
        toast.error("Failed to load letter");
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveLetter = useCallback(async (letter: { id?: string; title: string; content: string }): Promise<Letter | undefined> => {
    if (!user) return undefined;

    try {
      setIsLoading(true);
      const savedLetter = await lettersAPI.saveLetter(letter);
      await fetchLetters(); // This might trigger the loop if fetchLetters fails
      toast.success("Letter saved successfully");
      return savedLetter;
    } catch (error: any) {
      console.error("Error saving letter:", error);
      if (error.message === "Unauthorized") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/";
      } else {
        toast.error("Failed to save letter");
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchLetters]);

  const deleteLetter = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      await lettersAPI.deleteLetter(id);
      setLetters(prev => prev.filter(letter => letter._id !== id));
      toast.success("Letter deleted successfully");
      return true;
    } catch (error: any) {
      console.error(`Error deleting letter ${id}:`, error);
      if (error.message === "Unauthorized") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/";
      } else {
        toast.error("Failed to delete letter");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value = {
    isLoading,
    user,
    letters,
    fetchLetters,
    getLetter,
    saveLetter,
    deleteLetter,
    loginUrl,
    logoutUrl,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};