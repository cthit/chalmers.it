export function formDataFromUploadQueue(uploadQueue: {
  [key: string]: File;
}) {
  const formData = new FormData();

  for (const file of Object.values(uploadQueue)) {
    formData.append('file', file);
  }

  return formData;
}
