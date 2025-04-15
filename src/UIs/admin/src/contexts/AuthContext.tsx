import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
// export const AppContext: = createContext(); // Tạo context mới

export class Auth {
  expiresAt: Date = new Date(0);
  user: User = {} as User;

  constructor(user?: User, expiresAt?: Date) {
    this.user = user ?? ({} as User);
    this.expiresAt = expiresAt ?? new Date(0);
  }

  isAuthenticated(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    if (!this.user) {
      return false;
    }
    return this.expiresAt > new Date();
  }

  login(user: User, expiresAt: Date): void {
    if (
      !expiresAt ||
      !(expiresAt instanceof Date) ||
      expiresAt <= new Date() ||
      !user
    ) {
      console.log('Unauthorized');
    }

    this.expiresAt = expiresAt;
    this.user = user;
  }

  logout(): void {
    this.expiresAt = new Date(0);
    this.user = {} as User;
  }
}

export const AuthContext = createContext<{
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}>({ auth: new Auth(), setAuth: () => {} });

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth, setAuth] = useState<Auth>(new Auth());

  useEffect(() => {
    const authString = localStorage.getItem('authState');
    if (authString) {
      const authState = JSON.parse(authString) as Auth;
      const expiresAt = new Date(authState.expiresAt);
      const user: User = authState.user;
      const newAuth = new Auth();
      newAuth.login(user, expiresAt);
      setAuth(newAuth);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
