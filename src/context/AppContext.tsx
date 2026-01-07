import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  type: 'advertiser' | 'user';
  phone?: string;
}

interface Favorite {
  id: string;
  addedAt: number;
}

interface RecentView {
  id: string;
  viewedAt: number;
  title: string;
  location: string;
  pay: string;
}

interface SearchHistory {
  query: string;
  searchedAt: number;
}

interface AppState {
  // App Status
  isAppReady: boolean;
  isOnline: boolean;

  // User
  user: User | null;
  isAuthenticated: boolean;

  // Features
  favorites: Favorite[];
  recentViews: RecentView[];
  searchHistory: SearchHistory[];

  // UI State
  showBottomNav: boolean;
  currentRoute: string;
}

type AppAction =
  | { type: 'SET_APP_READY'; payload: boolean }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENT_VIEW'; payload: RecentView }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'SET_BOTTOM_NAV_VISIBLE'; payload: boolean }
  | { type: 'SET_CURRENT_ROUTE'; payload: string };

// Initial State
const initialState: AppState = {
  isAppReady: false,
  isOnline: navigator.onLine,
  user: null,
  isAuthenticated: false,
  favorites: [],
  recentViews: [],
  searchHistory: [],
  showBottomNav: true,
  currentRoute: '/',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_APP_READY':
      return { ...state, isAppReady: action.payload };

    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('lunaalba_current_user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    case 'ADD_FAVORITE': {
      const exists = state.favorites.some(f => f.id === action.payload);
      if (exists) return state;
      const newFavorites = [
        { id: action.payload, addedAt: Date.now() },
        ...state.favorites,
      ].slice(0, 100); // Keep max 100
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    }

    case 'REMOVE_FAVORITE': {
      const newFavorites = state.favorites.filter(f => f.id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    }

    case 'ADD_RECENT_VIEW': {
      const filtered = state.recentViews.filter(v => v.id !== action.payload.id);
      const newViews = [action.payload, ...filtered].slice(0, 50); // Keep max 50
      localStorage.setItem('recentViews', JSON.stringify(newViews));
      return { ...state, recentViews: newViews };
    }

    case 'ADD_SEARCH_HISTORY': {
      const filtered = state.searchHistory.filter(h => h.query !== action.payload);
      const newHistory = [
        { query: action.payload, searchedAt: Date.now() },
        ...filtered,
      ].slice(0, 20); // Keep max 20
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return { ...state, searchHistory: newHistory };
    }

    case 'CLEAR_SEARCH_HISTORY':
      localStorage.removeItem('searchHistory');
      return { ...state, searchHistory: [] };

    case 'SET_BOTTOM_NAV_VISIBLE':
      return { ...state, showBottomNav: action.payload };

    case 'SET_CURRENT_ROUTE':
      return { ...state, currentRoute: action.payload };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addRecentView: (item: Omit<RecentView, 'viewedAt'>) => void;
  addSearchHistory: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize from localStorage
  useEffect(() => {
    // Load user - check both possible storage keys
    const savedUser = localStorage.getItem('lunaalba_current_user') || localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Normalize user data format
        dispatch({
          type: 'SET_USER',
          payload: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            type: userData.type === 'worker' ? 'user' : userData.type === 'advertiser' ? 'advertiser' : userData.type,
            phone: userData.phone
          }
        });
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }

    // Load favorites
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        favorites.forEach((f: Favorite) => {
          dispatch({ type: 'ADD_FAVORITE', payload: f.id });
        });
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }

    // Load recent views
    const savedViews = localStorage.getItem('recentViews');
    if (savedViews) {
      try {
        const views = JSON.parse(savedViews);
        views.reverse().forEach((v: RecentView) => {
          dispatch({ type: 'ADD_RECENT_VIEW', payload: v });
        });
      } catch (e) {
        console.error('Failed to parse recent views', e);
      }
    }

    // Load search history
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        history.reverse().forEach((h: SearchHistory) => {
          dispatch({ type: 'ADD_SEARCH_HISTORY', payload: h.query });
        });
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }

    // Online/Offline listeners
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper functions
  const isFavorite = (id: string) => state.favorites.some(f => f.id === id);

  const toggleFavorite = (id: string) => {
    if (isFavorite(id)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: id });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: id });
    }
  };

  const addRecentView = (item: Omit<RecentView, 'viewedAt'>) => {
    dispatch({
      type: 'ADD_RECENT_VIEW',
      payload: { ...item, viewedAt: Date.now() },
    });
  };

  const addSearchHistory = (query: string) => {
    if (query.trim()) {
      dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query.trim() });
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        isFavorite,
        toggleFavorite,
        addRecentView,
        addSearchHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
