export const downloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
};

export const batchDownloadImages = async (images: { url: string; filename: string }[]) => {
  // Since we don't have JSZip, we'll just download them one by one
  // In a real app with more time/resources, we'd use JSZip
  for (const img of images) {
    await downloadImage(img.url, img.filename);
    // Small delay to prevent browser blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
