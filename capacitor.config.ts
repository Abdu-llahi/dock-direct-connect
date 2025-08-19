import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dockdirect.connect',
  appName: 'Dock Direct Connect',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#2563eb",
      showSpinner: true,
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#2563eb"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Geolocation: {
      permissions: ["location"]
    }
  }
};

export default config;
