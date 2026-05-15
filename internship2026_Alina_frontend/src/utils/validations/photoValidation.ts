export const validateFiles = (files: File[]) => {
  if (files.length > 50) {
    return 'Maximum 50 files';
  }

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      return `${file.name} exceeds 5MB`;
    }

    if (
      !file.type.startsWith('image/')
    ) {
      return `${file.name} is not an image`;
    }
  }

  return null;
};
