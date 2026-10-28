# Tokri App — File & Folder Structure Audit & Refactoring Roadmap

> **Target Project:** Tokri (React Native + TypeScript + Redux Toolkit + Supabase)  
> **Document Type:** Architectural Audit, Scalability Review & Execution Playbook  
> **Intended Audience:** Developer & AI Coding Assistants  

---

## 1. Executive Summary

Tokri project mein **Feature-First Architecture** follow karne ki koshish ki gayi hai, jo modern React Native apps ke liye ek behtareen standard hai. Lekin beginner stage par hone ke karan project mein **Dead Code, Tight Feature Coupling, Deep Over-nesting, Naming Inconsistencies, aur Missing Path Aliases** jaisi samasyaayein aa chuki hain.

Yeh report ek **Step-by-Step Actionable Playbook** hai jise aap manually ya kisi AI agent ko dekar safely execute karwa sakte hain bina app ko tode.

---

## 2. Issues Inventory (Problems & Impact)

| ID | Issue | Location | Severity | Impact on Scalability |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **Dead Code Directory in Root** | `/OldCode` | **HIGH** | Repo bloat, accidental import risks, Git history bypass. |
| **SEC-02** | **Error Dump in Repo** | `/tsc_errors.txt` | **LOW** | Dirty Git commits, non-standard repository hygiene. |
| **SEC-03** | **Split Feature Domain** | `/src/features/create` & `/src/features/list` | **CRITICAL** | Circular dependencies, confusion regarding where list screens/components belong. |
| **SEC-04** | **Anti-Pattern "other" Feature & Deep Nesting** | `/src/features/other/about/screens/About.tsx` | **MEDIUM** | 5 levels of nesting for a simple screen; dumping ground for random files. |
| **SEC-05** | **Ghost / Empty Folders & Files** | `/src/tokri-supabase-wiring`<br>`/src/features/catalog/utils`<br>`/src/shared/components/headers/StackHeader.tsx` | **LOW** | Codebase noise, confusing mental model for developers. |
| **SEC-06** | **Folder Casing Inconsistency** | `/src/Data` (PascalCase) vs other lowercase | **HIGH** | Linux CI/CD, Android builds, and Mac/Git case-sensitive import breaks. |
| **SEC-07** | **Types & Mock Data Mixed** | `/src/Data/types.ts` vs `/src/features/catalog/types/types.ts` | **HIGH** | Global domain models mixed with dummy mock data; unclear source of truth. |
| **SEC-08** | **Code Duplication (Hooks)** | `/src/features/create/hooks/useCollapsibleBar.ts`<br>`/src/shared/hooks/useCollapsibleBar.ts` | **MEDIUM** | Maintenance divergence; bug fixes in one hook won't reflect in the other. |
| **SEC-09** | **Redundant Single-File Folders** | `/src/theme/types/theme.types.ts`<br>`/src/navigation/types/navigationTypes.ts`<br>`/src/features/catalog/types/types.ts` | **LOW** | Over-engineering, redundant file path length. |
| **SEC-10** | **Import Hell (Missing Path Aliases)** | Across all feature screens (e.g., `../../../../`) | **CRITICAL** | Fragile imports. Moving a single file breaks dozens of imports. |
| **SEC-11** | **Missing Standard Assets Directory** | No `src/assets/` folder | **MEDIUM** | No standardized location for SVGs, icons, images, and fonts. |

---

## 3. Ideal Architecture Blueprint (Target State)

Neeche diya gaya structure industry standard **Feature-First + Domain-Driven** React Native architecture hai:

```text
Tokri/
├── android/
├── ios/
├── App.tsx                        # Clean root container (No commented dead code)
├── index.js
├── tsconfig.json                  # Path aliases configured (@features, @shared, etc.)
├── babel.config.js                # module-resolver plugin configured
├── package.json
└── src/
    ├── app/                       # Global App Level Configs
    │   ├── providers/             # ThemeProvider, SafeArea, etc.
    │   └── store/                 # Redux store & global hooks
    │
    ├── assets/                    # Static Assets (Images, Icons, Fonts)
    │   ├── fonts/
    │   ├── icons/
    │   └── images/
    │
    ├── config/                    # Environment & 3rd-party configuration
    │   ├── env.ts
    │   └── supabase.ts            # Supabase URLs, keys, and client setup
    │
    ├── navigation/                # App Navigation Architecture
    │   ├── stacks/                # Individual Stack Navigators
    │   ├── BottomTabNavigator.tsx
    │   ├── RootNavigator.tsx
    │   └── navigation.types.ts    # Direct types file
    │
    ├── types/                     # Shared Global Domain Types
    │   ├── catalog.types.ts       # Product, Category
    │   ├── list.types.ts          # ListSummary, SelectedProduct, ListStatus
    │   └── index.ts               # Barrel export
    │
    ├── data/                      # Local Mock / Seed Data (lowercase folder)
    │   ├── demoProducts.ts
    │   ├── dummyData.ts
    │   └── sources.ts
    │
    ├── features/                  # Domain Features
    │   ├── auth/                  # Authentication Feature
    │   │   ├── api/
    │   │   ├── components/
    │   │   ├── screens/           # LoginScreen, SplashScreen, etc.
    │   │   ├── store/             # authSlice
    │   │   └── types.ts
    │   │
    │   ├── catalog/               # Catalog & Item Management Feature
    │   │   ├── components/
    │   │   │   └── form/
    │   │   ├── hooks/
    │   │   ├── screens/           # CatalogScreen, AddItemScreen, EditItemScreen
    │   │   ├── services/
    │   │   ├── store/             # catalogSlice
    │   │   └── types.ts
    │   │
    │   ├── lists/                 # CONSOLIDATED LISTS FEATURE (View + Create + Edit)
    │   │   ├── components/        # ListSheet, ExportImageView, etc.
    │   │   ├── constants/         # listDefaults.ts
    │   │   ├── hooks/             # useListExport.ts
    │   │   ├── screens/           # CreateListScreen, ListScreen, NewListScreen
    │   │   ├── utils/             # listExport.ts
    │   │   └── types.ts
    │   │
    │   ├── history/               # History Feature
    │   │   └── screens/           # HistoryScreen.tsx
    │   │
    │   ├── home/                  # Home Dashboard Feature
    │   │   ├── components/
    │   │   └── screens/           # HomeScreen.tsx
    │   │
    │   └── settings/              # Settings & Static Info (Replaces 'other')
    │       └── screens/           # AboutScreen.tsx, HelpScreen.tsx
    │
    ├── shared/                    # Reusable across ALL features
    │   ├── components/            # Button, Header, Chip, BottomSheet, FilterBar
    │   ├── hooks/                 # useCollapsibleBar, useDebounce, etc.
    │   └── utils/                 # prefillFromSource, formatters, etc.
    │
    └── theme/                     # Design System & Styling Tokens
        ├── colors.ts
        ├── spacing.ts
        ├── typography.ts
        ├── borderRadius.ts
        ├── shadows.ts
        ├── lightTheme.ts
        ├── darkTheme.ts
        ├── theme.types.ts         # Direct file
        └── index.ts
```

---

## 4. Phased Step-by-Step Refactoring Plan

> [!IMPORTANT]
> Hamesha **Phase 1** se shuru karein aur har phase ke baad `npx tsc --noEmit` run karke verify karein. Ek saath saare changes karne se debugging mushkil ho jati hai.

### Phase 1: Zero-Risk Cleanup (Safe & Immediate)

**Objective:** Dead code, ghost folders, aur temporary files remove karna.

1. **Delete Dead Code Folder:**
   ```bash
   rm -rf OldCode
   ```
2. **Delete Temp Logs & Empty Files:**
   ```bash
   rm tsc_errors.txt
   rm src/shared/components/headers/StackHeader.tsx
   ```
3. **Remove Ghost Directories:**
   ```bash
   rm -rf src/tokri-supabase-wiring
   rm -rf src/features/catalog/utils
   ```
4. **Clean Root `App.tsx`:**
   - [App.tsx](file:///home/dd-pc-15/Tokri/App.tsx) se lines 1 se 40 tak ka commented dead code delete karein.

---

### Phase 2: Path Aliases Configuration (Import Hell Eradication)

**Objective:** `../../../../` relative imports ko clean `@features/*`, `@shared/*` alias se replace karna.

1. **Install babel plugin (agar pehle se nahi hai):**
   ```bash
   npm install --save-dev babel-plugin-module-resolver
   ```
2. **Update [tsconfig.json](file:///home/dd-pc-15/Tokri/tsconfig.json):**
   ```json
   {
     "extends": "@react-native/typescript-config",
     "compilerOptions": {
       "types": ["jest"],
       "baseUrl": ".",
       "paths": {
         "@app/*": ["src/app/*"],
         "@assets/*": ["src/assets/*"],
         "@config/*": ["src/config/*"],
         "@data/*": ["src/data/*"],
         "@features/*": ["src/features/*"],
         "@navigation/*": ["src/navigation/*"],
         "@shared/*": ["src/shared/*"],
         "@theme/*": ["src/theme/*"],
         "@theme": ["src/theme"],
         "@types/*": ["src/types/*"],
         "@types": ["src/types"]
       }
     },
     "include": ["**/*.ts", "**/*.tsx"],
     "exclude": ["**/node_modules", "**/Pods"]
   }
   ```
3. **Update [babel.config.js](file:///home/dd-pc-15/Tokri/babel.config.js):**
   ```javascript
   module.exports = {
     presets: ['module:@react-native/babel-preset'],
     plugins: [
       [
         'module-resolver',
         {
           root: ['./src'],
           extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
           alias: {
             '@app': './src/app',
             '@assets': './src/assets',
             '@config': './src/config',
             '@data': './src/data',
             '@features': './src/features',
             '@navigation': './src/navigation',
             '@shared': './src/shared',
             '@theme': './src/theme',
             '@types': './src/types',
           },
         },
       ],
       'react-native-reanimated/plugin', // Keep if already used
     ],
   };
   ```

---

### Phase 3: Domain Types & Mock Data Restructuring

**Objective:** `src/Data` ko split karna: types ko `src/types/` mein aur seed/dummy data ko lowercase `src/data/` mein daalna.

1. **Create `src/types` Directory:**
   - Create `src/types/catalog.types.ts`: Move `Category`, `Product`, `CategoryId` from `src/Data/types.ts`.
   - Create `src/types/list.types.ts`: Move `ListStatus`, `ListCategory`, `ListSummary`, `SelectedProduct` from `src/Data/types.ts`.
   - Create `src/types/index.ts` to export all types.
2. **Rename `src/Data` to `src/data` (lowercase):**
   - Sirf mock/static data rakhein (`dummyData.ts`, `sources.ts`, `catalog.ts`).
   - PascalCase `DummyData.ts` ko camelCase `dummyData.ts` karein.
3. **Update Imports across the project:**
   - Replace `import { Product } from '../../../Data/types'` with `import { Product } from '@types'`.

---

### Phase 4: Feature Consolidation & Deduplication

**Objective:** `create` aur `list` ko ek unified `lists` feature banana aur duplicate hooks hatana.

1. **Merge `src/features/create` and `src/features/list` into `src/features/lists`:**
   - Screens:
     - `src/features/lists/screens/CreateListScreen.tsx`
     - `src/features/lists/screens/ListScreen.tsx` (or `SavedListsScreen.tsx`)
     - `src/features/lists/screens/NewListScreen.tsx`
   - Components: Move `ListSheet.tsx`, `ExportImageView.tsx` into `src/features/lists/components/`.
   - Utils & Constants: Move `listDefaults.ts`, `listExport.ts` into `src/features/lists/`.
2. **Delete Duplicate Hook:**
   - `src/features/create/hooks/useCollapsibleBar.ts` ko delete karein.
   - Sab jagah `import { useCollapsibleBar } from '@shared/hooks/useCollapsibleBar'` use karein.
3. **Refactor `src/features/other` to `src/features/settings`:**
   - Move `About.tsx` to `src/features/settings/screens/AboutScreen.tsx`.
   - Move `Help.tsx` to `src/features/settings/screens/HelpScreen.tsx`.
   - Delete `src/features/other`.
4. **Flatten Single-File Folders:**
   - Move `src/theme/types/theme.types.ts` to `src/theme/types.ts`.
   - Move `src/navigation/types/navigationTypes.ts` to `src/navigation/navigation.types.ts`.
   - Move `src/features/catalog/types/types.ts` to `src/features/catalog/types.ts`.

---

### Phase 5: Naming Conventions & Barrel Exports

1. **Screen Naming Standardization:**
   - Add `Screen` suffix to all screens:
     - `AddItem.tsx` -> `AddItemScreen.tsx`
     - `EditItem.tsx` -> `EditItemScreen.tsx`
     - `About.tsx` -> `AboutScreen.tsx`
     - `List.tsx` -> `ListScreen.tsx`
2. **Update Navigation Stacks:**
   - [src/navigation/stacks/CatalogStackNavigator.tsx](file:///home/dd-pc-15/Tokri/src/navigation/stacks/CatalogStackNavigator.tsx)
   - [src/navigation/stacks/ListStackNavigator.tsx](file:///home/dd-pc-15/Tokri/src/navigation/stacks/ListStackNavigator.tsx)
   - [src/navigation/stacks/CreateStackNavigator.tsx](file:///home/dd-pc-15/Tokri/src/navigation/stacks/CreateStackNavigator.tsx)
   - Ensure imports point to the new consolidated filenames.

---

## 5. Ready-to-Use AI Prompts (Copy-Paste for AI Agent)

Jab bhi aap AI se yeh task karwana chahein, niche diye gaye prompts ko ek-ek karke use karein:

### Prompt 1: Phase 1 Cleanup Prompt
```text
Clean up dead and temporary files in the Tokri project according to the audit report:
1. Delete the entire OldCode/ folder.
2. Delete tsc_errors.txt and src/shared/components/headers/StackHeader.tsx.
3. Delete empty directories: src/tokri-supabase-wiring and src/features/catalog/utils.
4. Clean App.tsx by removing lines 1 to 40 containing commented-out dead code.
Do not modify any functional application logic. Run `npx tsc --noEmit` after cleanup to verify.
```

### Prompt 2: Phase 2 Path Aliases Prompt
```text
Configure path aliases for the Tokri project:
1. Update tsconfig.json with baseUrl "." and paths for @app/*, @assets/*, @config/*, @data/*, @features/*, @navigation/*, @shared/*, @theme/*, @types/*.
2. Update babel.config.js with babel-plugin-module-resolver using the same aliases.
Verify that existing code compiles and runs without breaking.
```

### Prompt 3: Phase 3 Types & Data Restructuring Prompt
```text
Restructure types and mock data in Tokri:
1. Create src/types/catalog.types.ts and src/types/list.types.ts, re-exporting them from src/types/index.ts.
2. Rename src/Data to src/data (lowercase) and keep only static mock data (dummyData.ts, sources.ts, catalog.ts).
3. Update imports across all screens and components to use the new @types alias.
Run `npx tsc --noEmit` and ensure there are 0 TypeScript compilation errors.
```

### Prompt 4: Phase 4 Feature Merging Prompt
```text
Consolidate 'create' and 'list' features in Tokri:
1. Merge src/features/create and src/features/list into a single unified feature: src/features/lists.
2. Delete the duplicate hook src/features/create/hooks/useCollapsibleBar.ts and ensure all components use the shared hook.
3. Rename src/features/other to src/features/settings, moving About and Help screens there.
4. Flatten redundant types folders (e.g. src/theme/types/theme.types.ts -> src/theme/types.ts).
5. Update all navigation stacks and imports. Run `npx tsc --noEmit` to verify 0 errors.
```

---

## 6. Verification Checklist

Har phase ke baad ye 3 steps zaroor run karein:

- [ ] **TypeScript Type Check:**
  ```bash
  npx tsc --noEmit
  ```
  *(Zero errors aane chahiye)*
- [ ] **Clear Metro Cache:**
  ```bash
  npx react-native start --reset-cache
  ```
- [ ] **Run on Android / iOS Simulator:**
  ```bash
  npx react-native run-android
  # or
  npx react-native run-ios
  ```
  *(App crash nahi honi chahiye aur navigation smooth chalni chahiye)*
