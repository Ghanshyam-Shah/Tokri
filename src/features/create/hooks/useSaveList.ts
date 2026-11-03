// src/features/create/hooks/useSaveList.ts
//
// CreateListScreen aur List screen dono isi se list save karte hain.
//   const { save } = useSaveList({ listId, listName, description, listType, startDate });
//   const id = await save(items, 'draft');       // draft save
//   const id = await save(items, 'completed');   // download / share ke baad
// Pehli baar save par list ban jati hai, uske baad wahi list update hoti hai.
// Do save ek saath aaye (jaise back + Save dabana) to line se chalte hain.

import { useCallback, useRef } from 'react';
import { useAppDispatch } from '../../../app/store/hooks';
import { useCatalog } from '../../catalog/hooks/useCatalog';
import {
  DbListType,
  isUuid,
  saveList,
} from '../../savedLists/services/listsService';
import { loadLists } from '../../savedLists/store/listsSlice';
import { ListItemParam } from '../../../navigation/types/navigationTypes';

interface Params {
  listId?: string; // route se aayi id (uuid ho tabhi maani jati hai)
  listName: string;
  description?: string;
  listType?: DbListType;
  startDate?: string;
}

export const useSaveList = ({
  listId,
  listName,
  description,
  listType,
  startDate,
}: Params) => {
  const dispatch = useAppDispatch();
  const { products } = useCatalog();

  const idRef = useRef<string | undefined>(isUuid(listId) ? listId : undefined);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  const save = useCallback(
    (items: ListItemParam[], status: 'draft' | 'completed') => {
      const run = async () => {
        const id = await saveList(
          {
            id: idRef.current,
            name: listName,
            description,
            listType,
            startDate,
            status,
            items,
          },
          products,
        );
        idRef.current = id;
        dispatch(loadLists());
        return id;
      };
      const result = queueRef.current.then(run, run);
      queueRef.current = result.catch(() => undefined);
      return result;
    },
    [listName, description, listType, startDate, products, dispatch],
  );

  return { save, getListId: () => idRef.current };
};
