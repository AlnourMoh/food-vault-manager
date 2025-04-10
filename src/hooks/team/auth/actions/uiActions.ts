
import { TeamAuthState, TeamAuthSetters } from '../types';

export function useUIActions(
  state: TeamAuthState,
  setters: TeamAuthSetters
) {
  const togglePasswordVisibility = () => {
    setters.setShowPassword(!state.showPassword);
  };

  const goBackToIdentifier = () => {
    setters.setLoginStep('identifier');
    setters.setPassword('');
    setters.setConfirmPassword('');
  };

  return {
    togglePasswordVisibility,
    goBackToIdentifier
  };
}
