import React, { useRef, useState } from "react";
import { UploadCloud, FileImage, Video, X, AlertCircle } from "lucide-react";

interface DropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  const handleFiles = (files: FileList | null) => {
    setErrorMsg(null);
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Unsupported format. Allowed: JPEG, PNG, WebP, MP4, WebM.");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const maxBytes = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

    if (file.size > maxBytes) {
      setErrorMsg(
        `File too large. Maximum ${isVideo ? "50MB for video" : "10MB for images"}.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="field-panel p-4 flex items-center justify-between border-teal-500/50 bg-teal-950/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-teal-900/40 text-teal-400">
              {selectedFile.type.startsWith("video/") ? (
                <Video className="w-6 h-6" />
              ) : (
                <FileImage className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
              <p className="text-xs text-slate-400 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-teal-500 bg-teal-950/20"
              : "border-slate-700 hover:border-slate-500 bg-slate-900/40"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.mp4,.webm"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="mx-auto w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 mb-3 shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Click to upload field inspection file, or drag & drop here
          </p>
          <p className="mt-1 text-xs text-slate-400">
            High-res images (JPEG, PNG, WebP ≤ 10MB) or short structural video clips (MP4, WebM ≤ 50MB, ≤ 60s)
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800/40">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
