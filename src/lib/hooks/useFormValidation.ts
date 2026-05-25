/**
 * Form Validation Hook
 * 
 * Combines React Hook Form + Zod for seamless form validation
 * with real-time error messages and accessibility support
 */

import { useState } from 'react'
import { useForm, type DefaultValues, type FieldErrors, type FieldValues, type Resolver } from 'react-hook-form'
import type { ZodType } from 'zod'

interface UseFormValidationOptions<T extends FieldValues> {
  schema: ZodType<T>
  defaultValues?: Partial<T>
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
export function useFormValidation<T extends FieldValues>({
  schema,
  defaultValues,
  onSuccess,
}: UseFormValidationOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const resolver = (async (values: T) => {
    const parsed = schema.safeParse(values)

    if (parsed.success) {
      return { values: parsed.data, errors: {} as FieldErrors<T> }
    }

    const errors = parsed.error.issues.reduce<FieldErrors<T>>((accumulator, issue) => {
      const fieldName = issue.path[0]

      if (typeof fieldName === 'string') {
        const castAcc = accumulator as unknown as Record<string, { type: string; message: string }>
        castAcc[fieldName] = {
          type: issue.code,
          message: issue.message,
        }
      }

      return accumulator
    }, {} as FieldErrors<T>)

    return { values: {} as T, errors }
  }) as unknown as Resolver<T>

  const form = useForm<T>({
    resolver,
    defaultValues: defaultValues as DefaultValues<T>,
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
