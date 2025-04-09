
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b3b6b969583d416c9d8b788fa375abca',
  appName: 'food-vault-manager',
  webDir: 'dist',
  server: {
    url: 'https://b3b6b969-583d-416c-9d8b-788fa375abca.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Configure any plugin-specific settings here
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
