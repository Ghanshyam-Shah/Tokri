// src/shared/utils/navHelpers.ts
// Kisi bhi screen se Home / New List tab par jaane ke helpers.
// (AppStack ke upar ya tabs ke andar, dono jagah se chalte hain.)

import {
  CommonActions,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';

type Nav = Pick<NavigationProp<ParamListBase>, 'dispatch'>;

/** Home tab par jao (beech ke screens hat jate hain) */
export const goHome = (nav: Nav) =>
  nav.dispatch(
    CommonActions.navigate({
      name: 'MainDrawer',
      params: { screen: 'MainTabs', params: { screen: 'HomeTab' } },
    }),
  );

/** New List screen kholo. source do to wo "Using: ..." ke saath chuna hua aata hai (Reuse) */
export const goToNewList = (
  nav: Nav,
  source?: { sourceId: string; sourceName: string },
) =>
  nav.dispatch(
    CommonActions.navigate({
      name: 'MainDrawer',
      params: {
        screen: 'MainTabs',
        params: {
          screen: 'CreateTab',
          params: { screen: 'NewListScreen', params: source },
        },
      },
    }),
  );
