
// Types for team authentication
export type LoginStep = 'identifier' | 'password' | 'setup';
export type IdentifierType = 'email' | 'phone';

export interface TeamAuthState {
  identifierType: IdentifierType;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  isLoading: boolean;
  loginStep: LoginStep;
  isFirstLogin: boolean;
}

export interface TeamAuthSetters {
  setIdentifierType: (type: IdentifierType) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phone: string) => void;
  setPhoneCountryCode: (code: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoginStep: (step: LoginStep) => void;
  setIsFirstLogin: (isFirst: boolean) => void;
}

export interface TeamAuthActions {
  handleCheckIdentifier: () => Promise<void>;
  handleLogin: () => Promise<void>;
  handleSetupPassword: () => Promise<void>;
  togglePasswordVisibility: () => void;
  goBackToIdentifier: () => void;
  getIdentifier: () => string;
}

export type TeamAuthHook = TeamAuthState & TeamAuthSetters & TeamAuthActions;
