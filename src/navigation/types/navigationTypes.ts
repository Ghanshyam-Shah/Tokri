// Auth Stack — Login flow screens
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  PhoneOTP: { phoneNumber: string };
};

// Home Stack
export type HomeStackParamList = {
  HomeMain: undefined;
};

// List Stack
export type ListStackParamList = {
  ListMain: undefined;
};

// Catalog Stack
export type CatalogStackParamList = {
  CatalogMain: undefined;
};

// History Stack
export type HistoryStackParamList = {
  HistoryMain: undefined;
};

// Bottom Tab
export type BottomTabParamList = {
  HomeTab: undefined;
  ListTab: undefined;
  CatalogTab: undefined;
  HistoryTab: undefined;
};

// Drawer
export type DrawerParamList = {
  Help: undefined;
  About: undefined;
  Settings: undefined;
  MainTabs: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};
