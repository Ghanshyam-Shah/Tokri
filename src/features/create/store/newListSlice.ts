// src/features/create/store/newListSlice.ts
//
// "New List" form ka state. Redux me rakha hai taaki:
//   - CreateListScreen se back aane par naam / type / date waise hi rahein
//   - wapas CreateListScreen jao to wahi draft (wahi products) khule (draftListId)
//   - Cancel / Discard / Save & Exit par poora saaf ho jaye (reset)

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListType } from '../../../Data/types';
import { signOut } from '../../auth/store/authSlice';

interface NewListState {
  listName: string;
  description: string;
  listType: ListType;
  startDate: string; // ISO
  sourceId: string | null; // Old List / Template / History jisse items copy honge
  sourceName: string | null;
  draftListId: string | null; // pehli save par bani list, wapas jaane par wahi khulti hai
}

const makeInitial = (): NewListState => ({
  listName: '',
  description: '',
  listType: 'monthly',
  startDate: new Date().toISOString(),
  sourceId: null,
  sourceName: null,
  draftListId: null,
});

const slice = createSlice({
  name: 'newList',
  initialState: makeInitial(),
  reducers: {
    setNewListFields(
      state,
      action: PayloadAction<
        Partial<Pick<NewListState, 'listName' | 'description' | 'listType' | 'startDate'>>
      >,
    ) {
      Object.assign(state, action.payload);
    },
    // Template / Old List / History chuna ya hataya: items naye source se aayenge,
    // isliye purani draft list ka link hata do.
    setNewListSource(
      state,
      action: PayloadAction<{ id: string | null; name: string | null }>,
    ) {
      state.sourceId = action.payload.id;
      state.sourceName = action.payload.name;
      state.draftListId = null;
    },
    // History / Home ke "Reuse" se: naya form, sirf source bhara hua (naam khali)
    startNewListFromSource(
      _state,
      action: PayloadAction<{ id: string; name: string }>,
    ) {
      return {
        ...makeInitial(),
        sourceId: action.payload.id,
        sourceName: action.payload.name,
      };
    },
    setNewListDraftId(state, action: PayloadAction<string | null>) {
      state.draftListId = action.payload;
    },
    resetNewList: () => makeInitial(),
  },
  extraReducers: builder => {
    builder.addCase(signOut.fulfilled, () => makeInitial());
  },
});

export const {
  setNewListFields,
  setNewListSource,
  startNewListFromSource,
  setNewListDraftId,
  resetNewList,
} = slice.actions;
export default slice.reducer;
