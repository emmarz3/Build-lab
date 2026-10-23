/* ============================================================
   CampusFix — New Report Page
   Form for creating a new issue report with validation
   and toast notifications on success / error.
   ============================================================ */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '@/features/reports/ReportsContext'
import { useToast } from '@/features/ui/Toast'
import {
  validateReportForm,
  errorsToMap,
  normalizeText,
} from '@/features/reports/report.validation'
import {
  ALL_CATEGORIES,
  ALL_PRIORITIES,
  FIELD_LIMITS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from '@/features/reports/report.constants'
import type { IssueCategory, IssuePriority } from '@/features/reports/report.types'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { LinkButton } from '@/components/ui/LinkButton'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLeft, Save } from 'lucide-react'

interface FormValues {
  title: string
  description: string
  category: string
  location: string
  priority: string
  reporter: string
}

const initialValues: FormValues = {
  title: '',
  description: '',
  category: '',
  location: '',
  priority: '',
  reporter: '',
}

export function NewReportPage() {
  const navigate = useNavigate()
  const { createReport } = useReports()
  const { addToast } = useToast()

  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ----- Field-level validation on blur -------------------------------

  const validateField = (field: string, value: string): string | null => {
    const trimmed = normalizeText(value)
    const formToValidate: FormValues = { ...values, [field]: trimmed }
    const result = validateReportForm(formToValidate)
    const map = errorsToMap(result.errors)
    return map[field] || null
  }

  // ----- Event handlers ------------------------------------------------

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleBlur = (field: string, value: string) => {
    const err = validateField(field, value)
    if (err) {
      setErrors((prev) => ({ ...prev, [field]: err }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = validateReportForm(values)
    const map = errorsToMap(result.errors)

    if (!result.valid) {
      setErrors(map)
      return
    }

    setIsSubmitting(true)
    try {
      const report = await createReport({
        title: values.title,
        description: values.description,
        category: values.category as IssueCategory,
        location: values.location,
        priority: values.priority as IssuePriority,
        reporter: values.reporter || undefined,
      })
      addToast({
        type: 'success',
        title: 'Report submitted',
        message: `Issue #${report.id.split('_')[1]?.slice(0, 6)} created.`,
      })
      navigate('/issues')
    } catch {
      addToast({
        type: 'error',
        title: 'Submission failed',
        message: 'Could not save the report. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ----- Render --------------------------------------------------------

  const canSubmit = !isSubmitting

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report an Issue"
        description="Fill out the form below and our team will address it as quickly as possible."
        action={
          <LinkButton
            to="/issues"
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Reports
          </LinkButton>
        }
      />

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            id="title"
            label="Title"
            placeholder="Brief description of the issue"
            value={values.title}
            error={errors.title}
            maxLength={FIELD_LIMITS.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={(e) => handleBlur('title', e.target.value)}
            required
          />
          {errors.title && <p className="text-xs text-[var(--color-danger)]">{errors.title}</p>}

          {/* Description */}
          <Textarea
            id="description"
            label="Description"
            placeholder="Provide as much detail as possible..."
            value={values.description}
            error={errors.description}
            maxLength={FIELD_LIMITS.description}
            rows={5}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={(e) => handleBlur('description', e.target.value)}
            required
          />
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {values.description.length} / {FIELD_LIMITS.description} characters
          </p>

          {/* Category */}
          <Select
            id="category"
            label="Category"
            value={values.category}
            error={errors.category}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={(e) => handleBlur('category', e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </Select>

          {/* Location */}
          <Input
            id="location"
            label="Location"
            placeholder="e.g. Room 204, Building B"
            value={values.location}
            error={errors.location}
            maxLength={FIELD_LIMITS.location}
            onChange={(e) => handleChange('location', e.target.value)}
            onBlur={(e) => handleBlur('location', e.target.value)}
            required
          />

          {/* Priority */}
          <Select
            id="priority"
            label="Priority"
            value={values.priority}
            error={errors.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            onBlur={(e) => handleBlur('priority', e.target.value)}
            required
          >
            <option value="" disabled>Select priority</option>
            {ALL_PRIORITIES.map((pri) => (
              <option key={pri} value={pri}>{PRIORITY_LABELS[pri]}</option>
            ))}
          </Select>

          {/* Reporter (optional) */}
          <Input
            id="reporter"
            label="Your name (optional)"
            placeholder="John Smith"
            value={values.reporter}
            maxLength={80}
            onChange={(e) => handleChange('reporter', e.target.value)}
          />

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <LinkButton
              to="/issues"
              variant="ghost"
              size="md"
            >
              Cancel
            </LinkButton>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save className="h-4 w-4" />}
              disabled={!canSubmit}
            >
              {isSubmitting ? 'Submitting…' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
