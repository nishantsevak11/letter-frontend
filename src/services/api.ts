
/**
 * API Service for Letter App
 * Handles all backend API communication for the application
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://letter-app-backend.vercel.app";

// Types
export interface Letter {
  _id: string;
  userId: string;
  title: string;
  content: string;
  googleDriveId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  accessToken: string;
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "API request failed");
  }

  return response.json();
};

// Auth-related API methods
export const authAPI = {
  // Get current authenticated user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await apiRequest("/auth/user");
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  // Login redirect URL
  getLoginUrl: (): string => {
    return `${API_BASE_URL}/auth/google`;
  },

  // Logout redirect URL
  getLogoutUrl: (): string => {
    return `${API_BASE_URL}/auth/logout`;
  },
};

// Letters-related API methods
export const lettersAPI = {
  // Get all letters for the current user
  getAllLetters: async (): Promise<Letter[]> => {
    try {
      return await apiRequest("/letters");
    } catch (error) {
      console.error("Failed to fetch letters:", error);
      throw error;
    }
  },

  // Get a single letter by ID
  getLetter: async (id: string): Promise<Letter> => {
    try {
      return await apiRequest(`/letters/${id}`);
    } catch (error) {
      console.error(`Failed to fetch letter ${id}:`, error);
      throw error;
    }
  },

  // Save a letter (create or update)
  saveLetter: async (letter: { id?: string; title: string; content: string }): Promise<Letter> => {
    try {
      const response = await apiRequest("/letters/save", {
        method: "POST",
        body: JSON.stringify(letter),
      });
      return response.letter;
    } catch (error) {
      console.error("Failed to save letter:", error);
      throw error;
    }
  },

  // Delete a letter by ID
  deleteLetter: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/letters/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Failed to delete letter ${id}:`, error);
      throw error;
    }
  },
};

export default {
  auth: authAPI,
  letters: lettersAPI,
};
