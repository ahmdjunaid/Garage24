import React, { useState } from "react";

interface ImageUploaderProps {
  label: string;
  onImageSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const maxSize = 500 * 1024;

  if (file.size > maxSize) {
    setError(`Image must be less than 500 KB!`);
    onImageSelect(null);
    e.target.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    setError("Please upload a valid image file.");
    onImageSelect(null);
    e.target.value = "";
    return;
  }

  setError("");
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreview(reader.result as string);
  };
  reader.readAsDataURL(file);
  onImageSelect(file);
};

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent 
        focus:border-red-600 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 
        file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 
        file:text-red-700 hover:file:bg-red-100 cursor-pointer"
      />

      {error && <p className="text-red-600 font-light text-sm">{error}</p>}

      {preview && (
        <div className="mt-4 relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;