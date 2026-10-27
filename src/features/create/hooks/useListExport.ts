// src/features/create/hooks/useListExport.ts
//
// Share / Save as PDF / Save as Image.
// NOTE: exports POORI list use karte hain, filtered nahi —
// search sirf item dhundhne ke liye hai, export se items na girein.
//
// ⚠️ Native packages:
//   react-native-view-shot, react-native-html-to-pdf,
//   @react-native-camera-roll/camera-roll, @react-native-documents/picker

import React, { useCallback } from 'react';
import { Alert, Share } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import {
  saveDocuments,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import { generatePDF } from 'react-native-html-to-pdf';
import { SelectedP } from '../constants/listDefaults';
import {
  ensureAndroidSavePermission,
  toFileUri,
  safeFileName,
  buildPlainText,
  buildPdfHtml,
} from '../utils/listExport';

interface Params {
  items: SelectedP[];
  listName: string;
  captureRef: React.RefObject<React.ComponentRef<typeof ViewShot> | null>;
}

export const useListExport = ({ items, listName, captureRef }: Params) => {
  const itemCount = items.length;

  // Header share icon: phone ki share sheet, plain text list ke saath
  // (WhatsApp, SMS, email wagairah sab isi me aate hain)
  const handleShare = useCallback(async () => {
    if (itemCount === 0) return;
    try {
      await Share.share({
        message: buildPlainText(items, listName),
        title: listName,
      });
    } catch {
      Alert.alert('Could not share', 'Please try again.');
    }
  }, [itemCount, items, listName]);

  const handleSaveAsPDF = useCallback(async () => {
    if (itemCount === 0) return;
    try {
      const html = buildPdfHtml(items, listName);
      const baseName = `${safeFileName(listName)}-${Date.now()}`;

      const pdf = await generatePDF({
        html,
        fileName: baseName,
        base64: false,
      });

      if (!pdf.filePath) throw new Error('PDF was not created');

      // Phone ka "Save" dialog: yahan Documents folder chuno (iOS par "Save to Files")
      await saveDocuments({
        sourceUris: [toFileUri(pdf.filePath)],
        copy: true,
        mimeType: 'application/pdf',
        fileName: `${baseName}.pdf`,
      });

      Alert.alert('PDF saved', 'Your list PDF was saved to the folder you chose.');
    } catch (err) {
      // user ne dialog band kar diya to chup raho
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert(
        'Could not save PDF',
        'Please check that the packages are installed and the app is rebuilt.',
      );
    }
  }, [items, listName, itemCount]);

  const handleSaveAsImage = useCallback(async () => {
    if (itemCount === 0) return;
    try {
      const uri = await captureRef.current?.capture?.();
      if (!uri) return;

      if (!(await ensureAndroidSavePermission())) {
        Alert.alert(
          'Permission needed',
          'Allow storage access to save the image to your gallery.',
        );
        return;
      }

      await CameraRoll.saveAsset(toFileUri(uri), { type: 'photo' });
      Alert.alert('Saved to gallery', 'Your list image is now in your Photos.');
    } catch (err) {
      Alert.alert(
        'Could not save image',
        'Please check that the packages are installed and the app is rebuilt.',
      );
    }
  }, [itemCount, captureRef]);

  return { handleShare, handleSaveAsPDF, handleSaveAsImage };
};
