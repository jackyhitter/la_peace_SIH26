import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const operator = useAuthStore((state) => state.operator);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    token,
    operator,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
  };
}
