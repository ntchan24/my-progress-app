import { Directory, File, Paths } from 'expo-file-system';

// Media lives in the document directory so the OS won't clear it like the picker's cache.
const mediaDir = new Directory(Paths.document, 'achievement-media');

const ensureMediaDir = () => {
  if (!mediaDir.exists) {
    mediaDir.create({ intermediates: true, idempotent: true });
  }
};

// Copies a picked/captured file into permanent storage and returns its file name.
// We store only the name because the app's absolute path can change between installs on iOS.
export const saveMediaFile = async (sourceUri: string): Promise<string> => {
  ensureMediaDir();
  const source = new File(sourceUri);
  const extension = source.extension || '';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  await source.copy(new File(mediaDir, fileName));
  return fileName;
};

export const mediaFileExists = (uri: string): boolean => new File(uri).exists;

export const getMediaUri = (fileName: string): string => new File(mediaDir, fileName).uri;

export const deleteMediaFile = (fileName: string) => {
  const file = new File(mediaDir, fileName);
  if (file.exists) {
    file.delete();
  }
};

export const deleteAllMediaFiles = () => {
  if (mediaDir.exists) {
    mediaDir.delete();
  }
};
