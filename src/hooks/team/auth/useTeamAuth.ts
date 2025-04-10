
import { useTeamAuthState } from './useTeamAuthState';
import { useTeamAuthActions } from './useTeamAuthActions';
import type { TeamAuthHook } from './types';

export { type LoginStep, type IdentifierType } from './types';

export function useTeamAuth(): TeamAuthHook {
  const stateAndSetters = useTeamAuthState();
  const actions = useTeamAuthActions(stateAndSetters, stateAndSetters);

  return {
    ...stateAndSetters,
    ...actions
  };
}
