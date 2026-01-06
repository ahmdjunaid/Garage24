import React, { useState } from "react";

interface FileUploaderProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  maxSizeKB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFileSelect,
  maxSizeKB = 1000,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = maxSizeKB * 1024;
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    if (!isImage && !isPDF) {
      setError("Only image or PDF files are allowed.");
      onFileSelect(null);
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setError(`File must be less than 1 MB`);
      onFileSelect(null);
      e.target.value = "";
      return;
    }

    setError("");
    setFileName(file.name);

    if (isImage) {
      setFileType("image");
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFileType("pdf");
      setPreview(null);
    }

    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    setFileType(null);
    setError("");
    onFileSelect(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleChange}
        className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent 
        focus:border-red-600 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 
        file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 
        file:text-red-700 hover:file:bg-red-100 cursor-pointer"
      />

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {/* Image Preview */}
      {fileType === "image" && preview && (
        <div className="mt-4 relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* PDF Preview */}
      {fileType === "pdf" && (
        <div className="mt-4 flex items-center justify-between bg-gray-100 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <span className="text-red-600 font-bold text-lg">PDF</span>
            <span className="text-sm text-gray-700 truncate max-w-xs">
              {fileName}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;