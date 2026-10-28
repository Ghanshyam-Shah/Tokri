// // src/features/create/components/list/ExportImageView.tsx
// //
// // "Save as Image" ke liye POORI list ka table (photos ke bina).
// // Screen ke bahar (left: -10000) render hota hai, user ko nahi dikhta.
// // ViewShot isi ko capture karta hai, isliye image me hamesha saare items aate hain.

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import ViewShot from 'react-native-view-shot';
// import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
// import { SelectedP } from '../../constants/listDefaults';
// import { formatExportDate } from '../../utils/listExport';

// const createStyles = (theme: AppTheme) => {
//   const { colors, spacing, typography, fontFamilies } = theme;

//   return StyleSheet.create({
//     offscreen: { position: 'absolute', top: 0, left: -10000 },
//     exportCanvas: { width: 420, backgroundColor: colors.cardBg },
//     exportHeader: {
//       backgroundColor: colors.primary,
//       paddingHorizontal: spacing.lg,
//       paddingVertical: spacing.lg,
//     },
//     exportTitle: {
//       fontSize: typography.lg,
//       fontFamily: fontFamilies.bold,
//       color: colors.onPrimary,
//     },
//     exportSub: {
//       fontSize: typography.xs,
//       fontFamily: fontFamilies.regular,
//       color: colors.onPrimary,
//       opacity: 0.85,
//       marginTop: 2,
//     },
//     exportDesc: {
//       fontSize: typography.xs + 1,
//       fontFamily: fontFamilies.regular,
//       color: colors.onPrimary,
//       opacity: 0.95,
//       marginTop: spacing.sm,
//       lineHeight: (typography.xs + 1) * 1.45,
//     },
//     exportHead: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: colors.primaryMuted,
//       paddingVertical: spacing.sm,
//       paddingHorizontal: spacing.lg,
//     },
//     exportHeadTxt: {
//       fontSize: typography.xs,
//       fontFamily: fontFamilies.bold,
//       color: colors.primary,
//     },
//     exportRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingVertical: spacing.sm + 2,
//       paddingHorizontal: spacing.lg,
//       borderBottomWidth: StyleSheet.hairlineWidth,
//       borderBottomColor: colors.border,
//     },
//     exportRowAlt: { backgroundColor: colors.cardBgVariant },
//     exportCell: {
//       fontSize: typography.xs + 1,
//       fontFamily: fontFamilies.regular,
//       color: colors.textPrimary,
//     },
//     exportName: { fontFamily: fontFamilies.semiBold },
//     exportNameHi: {
//       fontSize: typography.xs,
//       fontFamily: fontFamilies.regular,
//       color: colors.textMuted,
//       marginTop: 1,
//     },
//     exportQty: {
//       fontFamily: fontFamilies.bold,
//       color: colors.primary,
//       textAlign: 'center',
//     },
//     exportNote: { color: colors.textMuted },
//     exportFooter: {
//       textAlign: 'center',
//       fontSize: typography.xs - 1,
//       fontFamily: fontFamilies.regular,
//       color: colors.textMuted,
//       paddingVertical: spacing.md,
//     },
//     cNo: { width: 24 },
//     cName: { flex: 1.4, paddingRight: spacing.sm },
//     cUnit: { width: 54 },
//     cQty: { width: 34 },
//     cNoteCol: { flex: 1, paddingLeft: spacing.sm },
//   });
// };

// const useStyles = makeUseStyles(createStyles);

// interface Props {
//   captureRef: React.Ref<React.ComponentRef<typeof ViewShot>>;
//   listName: string;
//   description?: string;
//   items: SelectedP[];
// }

// const ExportImageView = ({
//   captureRef,
//   listName,
//   description,
//   items,
// }: Props) => {
//   const { styles: s } = useStyles();

//   if (items.length === 0) return null;

//   return (
//     <View pointerEvents="none" style={s.offscreen}>
//       <ViewShot
//         ref={captureRef}
//         options={{ format: 'png', quality: 1 }}
//         style={s.exportCanvas}
//       >
//         <View style={s.exportHeader}>
//           <Text style={s.exportTitle}>{listName}</Text>
//           <Text style={s.exportSub}>
//             {items.length} items • {formatExportDate()}
//           </Text>
//           {!!description?.trim() && (
//             <Text style={s.exportDesc}>{description.trim()}</Text>
//           )}
//         </View>

//         <View style={s.exportHead}>
//           <Text style={[s.exportHeadTxt, s.cNo]}>#</Text>
//           <Text style={[s.exportHeadTxt, s.cName]}>Item</Text>
//           <Text style={[s.exportHeadTxt, s.cUnit]}>Unit</Text>
//           <Text style={[s.exportHeadTxt, s.cQty, { textAlign: 'center' }]}>
//             Qty
//           </Text>
//           <Text style={[s.exportHeadTxt, s.cNoteCol]}>Note</Text>
//         </View>

//         {items.map((it, idx) => (
//           <View
//             key={it.id}
//             style={[s.exportRow, idx % 2 === 1 && s.exportRowAlt]}
//           >
//             <Text style={[s.exportCell, s.cNo]}>{idx + 1}</Text>
//             <View style={s.cName}>
//               <Text style={[s.exportCell, s.exportName]}>
//                 {it.name}
//                 {!!it.nameHindi && ` (${it.nameHindi})`}
//               </Text>
//             </View>

//             <Text style={[s.exportCell, s.cUnit]}>{it.unit}</Text>
//             <Text style={[s.exportCell, s.exportQty, s.cQty]}>
//               {it.quantity}
//             </Text>
//             <Text style={[s.exportCell, s.exportNote, s.cNoteCol]}>
//               {it.note ?? '-'}
//             </Text>
//           </View>
//         ))}

//         <Text style={s.exportFooter}>Made with Tokri</Text>
//       </ViewShot>
//     </View>
//   );
// };

// export default ExportImageView;


// src/features/create/components/list/ExportImageView.tsx
//
// "Save as Image" ke liye POORI list ka table (photos ke bina).
// Screen ke bahar (left: -10000) render hota hai, user ko nahi dikhta.
// ViewShot isi ko capture karta hai, isliye image me hamesha saare items aate hain.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import { SelectedP } from '../../constants/listDefaults';
import { formatExportDate } from '../../utils/listExport';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, typography, fontFamilies } = theme;

  return StyleSheet.create({
    offscreen: { position: 'absolute', top: 0, left: -10000 },
    exportCanvas: { width: 420, backgroundColor: colors.cardBg },
    exportHeader: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    exportTitle: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.onPrimary,
    },
    exportSub: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.onPrimary,
      opacity: 0.85,
      marginTop: 2,
    },
    exportDesc: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
      color: colors.onPrimary,
      opacity: 0.95,
      marginTop: spacing.sm,
      lineHeight: (typography.xs + 1) * 1.45,
    },
    exportHead: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryMuted,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    exportHeadTxt: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
    },
    exportRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    exportRowAlt: { backgroundColor: colors.cardBgVariant },
    exportCell: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
    },
    exportName: { fontFamily: fontFamilies.semiBold },
    exportQty: {
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
    },
    exportNote: { color: colors.textMuted },
    exportFooter: {
      textAlign: 'center',
      fontSize: typography.xs - 1,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      paddingVertical: spacing.md,
    },
    cNo: { width: 24 },
    cName: { flex: 1.4, paddingRight: spacing.sm },
    cUnit: { width: 54 },
    cQty: { width: 34 },
    cNoteCol: { flex: 1, paddingLeft: spacing.sm },
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  captureRef: React.Ref<React.ComponentRef<typeof ViewShot>>;
  listName: string;
  description?: string;
  items: SelectedP[];
}

const ExportImageView = ({
  captureRef,
  listName,
  description,
  items,
}: Props) => {
  const { styles: s } = useStyles();

  if (items.length === 0) return null;

  return (
    <View pointerEvents="none" style={s.offscreen}>
      <ViewShot
        ref={captureRef}
        options={{ format: 'png', quality: 1 }}
        style={s.exportCanvas}
      >
        <View style={s.exportHeader}>
          <Text style={s.exportTitle}>{listName}</Text>
          <Text style={s.exportSub}>
            {items.length} items • {formatExportDate()}
          </Text>
          {!!description?.trim() && (
            <Text style={s.exportDesc}>{description.trim()}</Text>
          )}
        </View>

        <View style={s.exportHead}>
          <Text style={[s.exportHeadTxt, s.cNo]}>#</Text>
          <Text style={[s.exportHeadTxt, s.cName]}>Item</Text>
          <Text style={[s.exportHeadTxt, s.cUnit]}>Unit</Text>
          <Text style={[s.exportHeadTxt, s.cQty]}>Qty</Text>
          <Text style={[s.exportHeadTxt, s.cNoteCol]}>Note</Text>
        </View>

        {items.map((it, idx) => (
          <View
            key={it.id}
            style={[s.exportRow, idx % 2 === 1 && s.exportRowAlt]}
          >
            <Text style={[s.exportCell, s.cNo]}>{idx + 1}</Text>
            <View style={s.cName}>
              <Text style={[s.exportCell, s.exportName]}>
                {it.name}
                {!!it.nameHindi && ` (${it.nameHindi})`}
              </Text>
            </View>

            <Text style={[s.exportCell, s.cUnit]}>{it.unit}</Text>
            <Text style={[s.exportCell, s.exportQty, s.cQty]}>
              {it.quantity}
            </Text>
            <Text style={[s.exportCell, s.exportNote, s.cNoteCol]}>
              {it.note ?? '-'}
            </Text>
          </View>
        ))}

        <Text style={s.exportFooter}>Made with Tokri</Text>
      </ViewShot>
    </View>
  );
};

export default ExportImageView;
