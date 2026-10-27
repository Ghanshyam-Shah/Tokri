// src/features/catalog/hooks/useImagePicker.ts
// Product photo: Camera ya Gallery se. Photo ka local uri onPicked ko milta hai.

import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';

export const useImagePicker = (onPicked: (uri: string) => void) => {
  const handleResponse = useCallback(
    (res: ImagePickerResponse) => {
      if (res.didCancel) return;

      if (res.errorCode) {
        if (res.errorCode === 'permission') {
          Alert.alert(
            'Permission needed',
            'Allow camera access from Settings to take a photo.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        } else if (res.errorCode === 'camera_unavailable') {
          Alert.alert('Camera not available', 'This device has no camera.');
        } else {
          Alert.alert(
            'Could not select image',
            res.errorMessage ?? 'Please try again.',
          );
        }
        return;
      }

      const uri = res.assets?.[0]?.uri;
      if (uri) onPicked(uri);
    },
    [onPicked],
  );

  const openCamera = useCallback(async () => {
    try {
      handleResponse(
        await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
        }),
      );
    } catch {
      Alert.alert('Could not open camera', 'Please try again.');
    }
  }, [handleResponse]);

  const openGallery = useCallback(async () => {
    try {
      handleResponse(
        await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
          selectionLimit: 1,
        }),
      );
    } catch {
      Alert.alert('Could not open gallery', 'Please try again.');
    }
  }, [handleResponse]);

  // "Select Image" dabane par: Camera / Gallery / Cancel
  const pickImage = useCallback(() => {
    Alert.alert('Product photo', 'Choose a source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [openCamera, openGallery]);

  return { pickImage };
};
