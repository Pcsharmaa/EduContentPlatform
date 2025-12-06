export const fileValidation = {
  // Allowed file types for different content categories
  ALLOWED_TYPES: {
    IMAGE: [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    DOCUMENT: [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".rtf",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    VIDEO: [
      ".mp4",
      ".avi",
      ".mov",
      ".wmv",
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "video/x-ms-wmv",
    ],
    AUDIO: [".mp3", ".wav", ".ogg", "audio/mpeg", "audio/wav", "audio/ogg"],
    PRESENTATION: [
      ".ppt",
      ".pptx",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    SPREADSHEET: [
      ".xls",
      ".xlsx",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },

  // Maximum file sizes in MB
  MAX_SIZES: {
    IMAGE: 5,
    DOCUMENT: 10,
    VIDEO: 100,
    AUDIO: 20,
    PRESENTATION: 10,
    SPREADSHEET: 10,
    DEFAULT: 10,
  },

  // Validate file
  validateFile(file, category = "DEFAULT") {
    const errors = [];

    // Check file size
    const maxSizeMB = this.MAX_SIZES[category] || this.MAX_SIZES.DEFAULT;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    // Check file type
    const allowedTypes = this.ALLOWED_TYPES[category] || [];
    if (allowedTypes.length > 0) {
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      const isTypeAllowed = allowedTypes.some(
        (type) =>
          type.toLowerCase() === file.type.toLowerCase() ||
          type.toLowerCase() === fileExtension
      );

      if (!isTypeAllowed) {
        errors.push(
          `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
        );
      }
    }

    // Check file name
    if (!file.name || file.name.trim() === "") {
      errors.push("File name is required");
    }

    // Check for special characters in filename
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.name)) {
      errors.push("File name contains invalid characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate multiple files
  validateFiles(files, category = "DEFAULT") {
    const results = files.map((file) => ({
      file,
      validation: this.validateFile(file, category),
    }));

    const allValid = results.every((result) => result.validation.isValid);
    const allErrors = results.flatMap((result) => result.validation.errors);

    return {
      allValid,
      results,
      errors: allErrors,
    };
  },

  // Get file icon based on type
  getFileIcon(filename) {
    const extension = filename.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📽️";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "mp4":
      case "avi":
      case "mov":
        return "🎬";
      case "mp3":
      case "wav":
        return "🎵";
      case "zip":
      case "rar":
        return "📦";
      default:
        return "📁";
    }
  },

  // Get human readable file type
  getFileTypeDescription(filename) {
    const extension = filename.split(".").pop().toLowerCase();

    const types = {
      pdf: "PDF Document",
      doc: "Word Document",
      docx: "Word Document",
      xls: "Excel Spreadsheet",
      xlsx: "Excel Spreadsheet",
      ppt: "PowerPoint Presentation",
      pptx: "PowerPoint Presentation",
      jpg: "JPEG Image",
      jpeg: "JPEG Image",
      png: "PNG Image",
      gif: "GIF Image",
      mp4: "MP4 Video",
      avi: "AVI Video",
      mov: "QuickTime Video",
      mp3: "MP3 Audio",
      wav: "WAV Audio",
      zip: "ZIP Archive",
      rar: "RAR Archive",
      txt: "Text File",
      rtf: "Rich Text File",
    };

    return types[extension] || "File";
  },
};
