export const fileUploadService = {
  // Validate file size
  validateFileSize(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }
    return true;
  },

  // Validate file type
  validateFileType(file, allowedTypes = []) {
    if (allowedTypes.length === 0) {
      return true; // No restrictions
    }

    const fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    const isTypeAllowed = allowedTypes.some((type) => {
      if (type.startsWith(".")) {
        return `.${fileExtension}` === type;
      }
      return fileType === type;
    });

    if (!isTypeAllowed) {
      throw new Error(
        `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    return true;
  },

  // Get file extension
  getFileExtension(filename) {
    return filename.split(".").pop().toLowerCase();
  },

  // Get file type category
  getFileTypeCategory(file) {
    const extension = this.getFileExtension(file.name);
    const mimeType = file.type;

    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else if (mimeType.startsWith("audio/")) {
      return "audio";
    } else if (mimeType.includes("pdf")) {
      return "pdf";
    } else if (["doc", "docx", "txt", "rtf"].includes(extension)) {
      return "document";
    } else if (["zip", "rar", "7z"].includes(extension)) {
      return "archive";
    } else {
      return "other";
    }
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Create object URL for preview
  createPreviewUrl(file) {
    return URL.createObjectURL(file);
  },

  // Revoke object URL
  revokePreviewUrl(url) {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  },

  // Generate unique filename
  generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = this.getFileExtension(originalName);
    return `${timestamp}_${random}.${extension}`;
  },
};
