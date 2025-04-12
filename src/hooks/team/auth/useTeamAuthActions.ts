
import { TeamAuthState, TeamAuthSetters, TeamAuthActions } from './types';
import { useCheckIdentifierActions } from './actions/checkIdentifierActions';
import { useLoginActions } from './actions/loginActions';
import { useSetupPasswordActions } from './actions/setupPasswordActions';
import { useUIActions } from './actions/uiActions';

export function useTeamAuthActions(
  state: TeamAuthState,
  setters: TeamAuthSetters
): TeamAuthActions {
  // Get actions from specialized hooks
  const { getIdentifier, handleCheckIdentifier } = useCheckIdentifierActions(state, setters);
  const { handleLogin } = useLoginActions(state, setters);
  const { handleSetupPassword } = useSetupPasswordActions(state, setters);
  const { togglePasswordVisibility, goBackToIdentifier } = useUIActions(state, setters);

  return {
    getIdentifier,
    handleCheckIdentifier,
    handleLogin,
    handleSetupPassword,
    togglePasswordVisibility,
    goBackToIdentifier
  };
}
