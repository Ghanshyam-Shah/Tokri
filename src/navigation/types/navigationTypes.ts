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
 
  AddItem: undefined;
  EditItem: undefined;
};

// List Stack
export type ListStackParamList = {
  ListMain: undefined;
};

// Create Stack
export type CreateStackParamList = {
  NewListScreen: undefined;
  CreateListScreen: {
    listId?: string;
    listName?: string;
  };
  List: undefined;
};

// Catalog Stack
export type CatalogStackParamList = {
  CatalogMain: undefined;
  AddItem: undefined;
  EditItem: undefined;
};

// History Stack
export type HistoryStackParamList = {
  HistoryMain: undefined;
};

// Bottom Tab
export type BottomTabParamList = {
  HomeTab: undefined;
  ListTab: undefined;
  CreateTab: undefined;
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
