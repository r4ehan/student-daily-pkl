import { useRef, useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { getFotoUrl } from "../../services/storageService";

export default function FileUpload({
  value, // path foto saat ini (atau null)
  onChange, // (file) => void  — file baru yang dipilih
  onRemove, // () => void      — saat user klik hapus
  loading = false,
  label = "Foto dokumentasi",
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5MB");
      return;
    }
    setPreview(URL.createObjectURL(file));
    onChange?.(file);
  }

  function handleRemove(e) {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  }

  const displayUrl = preview || (value ? getFotoUrl(value) : null);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-gray-400 font-normal">(opsional)</span>
      </label>

      <div
        onClick={() => !loading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors ${
          displayUrl
            ? "border-gray-200"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="preview"
              className="w-full h-48 object-cover"
            />
            {!loading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
            ) : (
              <Camera className="w-8 h-8 mb-2 text-gray-400" />
            )}
            <p className="text-sm font-medium">
              {loading ? "Mengupload..." : "Tambah foto"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Maksimal 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
