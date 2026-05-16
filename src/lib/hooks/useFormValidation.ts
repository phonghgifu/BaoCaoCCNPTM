/**
 * Form Validation Hook
 * 
 * Combines React Hook Form + Zod for seamless form validation
 * with real-time error messages and accessibility support
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodSchema } from 'zod'

interface UseFormValidationOptions<T> {
  schema: ZodSchema
  defaultValues?: T
  onSuccess?: (data: T) => void | Promise<void>
}

/**
 * Custom hook for form validation with React Hook Form + Zod
 * 
 * Usage:
 * const form = useFormValidation({
 *   schema: BlogPostSchema,
 *   onSuccess: async (data) => { await submitPost(data) }
 * })
 */
export function useFormValidation<T extends Record<string, any>>({
  schema,
  defaultValues,
  onSuccess,
}: UseFormValidationOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: (defaultValues || {}) as T,
    mode: 'onBlur', // Validate on blur for better UX
  })

  const onSubmit = async (data: T) => {
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      if (onSuccess) {
        await onSuccess(data)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '❌ Đã xảy ra lỗi'
      setSubmitError(message)
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    submitError,
    setSubmitError,
  }
}
