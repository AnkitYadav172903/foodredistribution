import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import ImageUploader from '../upload/ImageUploader'
import { FOOD_CATEGORIES } from '../../utils/constants'

const EMPTY_FORM = {
  title: '',
  category: 'COOKED_MEAL',
  quantity: '',
  unit: 'kg',
  description: '',
  location: '',
  pickupBy: '',
  image: null,
}

const UNITS = ['kg', 'servings', 'boxes', 'litres', 'packets']

export function FoodForm({ initialValues, onSubmit, onCancel, submitLabel = 'Add Listing', loading = false }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.title?.trim()) nextErrors.title = 'Title is required'
    if (!form.quantity || Number(form.quantity) <= 0) nextErrors.quantity = 'Enter a valid quantity'
    if (!form.location?.trim()) nextErrors.location = 'Pickup location is required'
    if (!form.pickupBy) nextErrors.pickupBy = 'Pickup by time is required'
    if (new Date(form.pickupBy) <= new Date()) nextErrors.pickupBy = 'Pickup time must be in the future'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onSubmit(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUploader
        label="Upload food photo"
        value={form.image}
        onChange={(image) => setField('image', image)}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          name="title"
          label="Food title"
          placeholder="e.g. Pan-fried noodles (leftover)"
          value={form.title}
          onChange={(e) => setField('title', e.target.value)}
          error={errors.title}
        />

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {FOOD_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Input
          name="quantity"
          type="number"
          min="0"
          step="any"
          label="Quantity"
          placeholder="e.g. 5"
          value={form.quantity}
          onChange={(e) => setField('quantity', e.target.value)}
          error={errors.quantity}
        />

        <div>
          <label htmlFor="unit" className="mb-1.5 block text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            value={form.unit}
            onChange={(e) => setField('unit', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <Input
          name="pickupBy"
          type="datetime-local"
          label="Pickup by"
          value={form.pickupBy}
          onChange={(e) => setField('pickupBy', e.target.value)}
          error={errors.pickupBy}
        />
      </div>

      <Input
        name="location"
        label="Pickup location"
        placeholder="Full address or nearby landmark"
        value={form.location}
        onChange={(e) => setField('location', e.target.value)}
        error={errors.location}
      />

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
          Description <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="What is it? How was it stored? Dietary notes..."
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default FoodForm