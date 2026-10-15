{/* ═════════════════════════════════ List Item Params ═════════════════════════════════ */}

export interface ListItemParam {
  id: string;
  name: string;
  nameHindi: string;
  unit: string;
  imageUrl: string;
  quantity: number;
  note?: string;
  categoryId?: string;
}

/* ═════════════════════════════════ Auth Stack Params ═════════════════════════════════ */

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  PhoneOTP: { phoneNumber: string };
};

/* ═════════════════════════════════ Home Stack Params ═════════════════════════════════ */

export type HomeStackParamList = { HomeMain: undefined };

/* ═════════════════════════════════ List Stack Params ═════════════════════════════════ */

export type ListStackParamList = { ListMain: undefined };

/* ═════════════════════════════════ Create Stack Params ═════════════════════════════════ */

export type CreateStackParamList = { NewListScreen: undefined };

/* ═════════════════════════════════ Catalog Stack Params ═════════════════════════════════ */

export type CatalogStackParamList = { CatalogMain: undefined };

/* ═════════════════════════════════ History Stack Params ═════════════════════════════════ */

export type HistoryStackParamList = { HistoryMain: undefined };

/* ═════════════════════════════════ App Stack Params ═════════════════════════════════ */

export type AppStackParamList = {
  MainDrawer: undefined;
  CreateListScreen: {
    listId?: string;
    listName?: string;
  };
  List: {
    listId?: string;
    listName?: string;
    items?: ListItemParam[];
  };
  AddItem: undefined;
  EditItem: {
    productId: string;
  };
};

/* ═════════════════════════════════ Bottom Tab Params ═════════════════════════════════ */

export type BottomTabParamList = {
  HomeTab: undefined;
  ListTab: undefined;
  CreateTab: undefined;
  CatalogTab: undefined;
  HistoryTab: undefined;
};

/* ═════════════════════════════════ Drawer Params ═════════════════════════════════ */

// export type DrawerParamList = {
//   Help: undefined;
//   About: undefined;
//   Settings: undefined;
//   MainTabs: undefined;
// };
// Drawer
export type DrawerParamList = {
  MainTabs: undefined;
  Help: undefined;
  About: undefined;
};

/* ═════════════════════════════════ Root Stack Params ═════════════════════════════════ */

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};