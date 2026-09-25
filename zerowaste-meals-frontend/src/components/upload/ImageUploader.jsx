import { useRef } from 'react'
import uploadIcon from '../../assets/icons/upload.png'
import { MAX_IMAGE_SIZE_MB } from '../../utils/constants'
import { resolveMediaUrl } from '../../utils/media'

export function ImageUploader({ value, onChange, label = 'Upload image', className = '' }) {
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`)
      return
    }
    onChange(file)
  }

  const previewUrl =
    typeof value === 'string' ? resolveMediaUrl(value) : value ? URL.createObjectURL(value) : null

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="max-h-40 rounded-lg object-cover" />
        ) : (
          <>
            <img src={uploadIcon} alt="" className="h-16 w-16 rounded-xl object-contain" />
            <span className="text-sm font-medium text-gray-600">
              Click to {label.toLowerCase()}
            </span>
            <span className="text-xs text-gray-400">PNG, JPG up to {MAX_IMAGE_SIZE_MB}MB</span>
          </>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange(null)
            if (inputRef.current) inputRef.current.value = ''
          }}
          className="mt-2 text-xs text-red-600 hover:underline"
        >
          Remove image
        </button>
      )}
    </div>
  )
}

export default ImageUploader