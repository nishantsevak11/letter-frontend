/**
 * API Service for Letter App (CORS Fixed)
 */

const API_BASE_URL = `https://cors-anywhere.herokuapp.com/${import.meta.env.VITE_API_URL}`;

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

// API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    mode: "cors", // Enable CORS mode
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth-related API methods
export const authAPI = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await apiRequest("/auth/user");
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  getLoginUrl: (): string => {
    return `${API_BASE_URL}/auth/google`;
  },

  getLogoutUrl: (): string => {
    return `${API_BASE_URL}/auth/logout`;
  },
};

// Letters-related API methods
export const lettersAPI = {
  getAllLetters: async (): Promise<Letter[]> => {
    try {
      return await apiRequest("/letters");
    } catch (error) {
      console.error("Failed to fetch letters:", error);
      throw error;
    }
  },

  getLetter: async (id: string): Promise<Letter> => {
    try {
      return await apiRequest(`/letters/${id}`);
    } catch (error) {
      console.error(`Failed to fetch letter ${id}:`, error);
      throw error;
    }
  },

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
