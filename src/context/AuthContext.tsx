import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types/hemora';
import { mockAuthService } from '../services/mockServices';
import { MOCK_DONOR_USER } from '../mock/users';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isLoading: boolean;
  login: (role: UserRole, email?: string, password?: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<AuthUser>;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(MOCK_DONOR_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    mockAuthService.getCurrentUser().then((u) => {
      setUser(u || MOCK_DONOR_USER);
      setIsLoading(false);
    });
  }, []);

  const login = async (role: UserRole, email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedIn = await mockAuthService.login(role, email, password);
      setUser(loggedIn);
      return loggedIn;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await mockAuthService.logout();
    setUser(null);
  };

  const switchRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const switched = await mockAuthService.switchRole(targetRole);
      setUser(switched);
      return switched;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data } as AuthUser;
    setUser(updated);
    localStorage.setItem('hemora_current_user', JSON.stringify(updated));
  };

  const role: UserRole = user?.role || 'donor';

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout, switchRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
