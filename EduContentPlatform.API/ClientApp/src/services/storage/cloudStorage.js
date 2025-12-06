import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const cloudStorageService = {
  // Upload file to server
  async uploadFile(file, onProgress = null) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (onProgress && event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error("Failed to parse server response"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload was cancelled"));
      });

      xhr.open("POST", `${API_ENDPOINTS.BASE_URL}/api/upload`);
      const token = localStorage.getItem("token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  },

  // Upload multiple files
  async uploadMultipleFiles(files, onProgress = null) {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, onProgress)
    );
    return Promise.all(uploadPromises);
  },

  // Get file URL
  getFileUrl(filename) {
    return `${API_ENDPOINTS.BASE_URL}/uploads/${filename}`;
  },

  // Delete file
  async deleteFile(filename) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/api/upload/${filename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },
};
