{/* ═════════════════════════════════ List Item Params ═════════════════════════════════ */ }

export interface ListItemParam {
  id: string;
  name: string;
  nameHindi: string;
  unit: string;
  imageUrl?: string;
  quantity: number;
  note?: string;
  categoryId?: string;
}

/* ═════════════════════════════════ Auth Stack Params ═════════════════════════════════ */

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Otp: undefined;
  ResetPassword: undefined;
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
    startDate?: string; // ISO string, e.g. 2026-10-20T06:00:00.000Z
    sourceId?: string; // chuna hua Old List ya Template ka id
    description?: string
    
  };
  List: {
    listId?: string;
    listName?: string;
    items?: ListItemParam[];
    description?: string
  };
  AddItem: undefined;
  EditItem: {
    productId: string;
  };
    HistoryList: {
    listId: string; // history item ki id (SOURCE_ITEMS ki key)
    listName: string;
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

