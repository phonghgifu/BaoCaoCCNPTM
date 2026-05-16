/**
 * Validation Schemas using Zod
 * 
 * Centralized validation for forms throughout the application
 */

import { z } from 'zod'

// Blog Post Validation
export const BlogPostSchema = z.object({
  title: z
    .string()
    .min(5, '📝 Tiêu đề phải có ít nhất 5 ký tự')
    .max(200, '📝 Tiêu đề không được vượt quá 200 ký tự'),
  slug: z
    .string()
    .min(3, '🔗 Slug phải có ít nhất 3 ký tự')
    .regex(/^[a-z0-9-]+$/, '🔗 Slug chỉ chứa chữ thường, số và dấu gạch ngang')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(50, '✍️ Nội dung phải có ít nhất 50 ký tự')
    .max(10000, '✍️ Nội dung không được vượt quá 10000 ký tự'),
  description: z
    .string()
    .min(20, '📄 Mô tả phải có ít nhất 20 ký tự')
    .max(500, '📄 Mô tả không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
  image: z
    .string()
    .url('🖼️ URL ảnh không hợp lệ')
    .optional()
    .or(z.literal('')),
  published: z.boolean().optional(),
})

export type BlogPostInput = z.infer<typeof BlogPostSchema>

// Project Validation
export const ProjectSchema = z.object({
  title: z
    .string()
    .min(5, '📝 Tiêu đề dự án phải có ít nhất 5 ký tự')
    .max(150, '📝 Tiêu đề không được vượt quá 150 ký tự'),
  description: z
    .string()
    .min(20, '📄 Mô tả phải có ít nhất 20 ký tự')
    .max(1000, '📄 Mô tả không được vượt quá 1000 ký tự'),
  technologies: z
    .array(z.string())
    .min(1, '🛠️ Chọn ít nhất một công nghệ')
    .max(10, '🛠️ Tối đa 10 công nghệ'),
  image: z
    .string()
    .url('🖼️ URL ảnh không hợp lệ')
    .optional()
    .or(z.literal('')),
  link: z
    .string()
    .url('🔗 URL dự án không hợp lệ')
    .optional()
    .or(z.literal('')),
})

export type ProjectInput = z.infer<typeof ProjectSchema>

// User Profile Validation
export const ProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, '👤 Tên phải có ít nhất 2 ký tự')
    .max(100, '👤 Tên không được vượt quá 100 ký tự')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, '📝 Tiểu sử không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
  avatar_url: z
    .string()
    .url('🖼️ URL ảnh đại diện không hợp lệ')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('🔗 Website URL không hợp lệ')
    .optional()
    .or(z.literal('')),
})

export type ProfileInput = z.infer<typeof ProfileSchema>

// Comment Validation
export const CommentSchema = z.object({
  content: z
    .string()
    .min(1, '💬 Bình luận không được để trống')
    .max(500, '💬 Bình luận không được vượt quá 500 ký tự'),
})

export type CommentInput = z.infer<typeof CommentSchema>

// Auth Validation
export const LoginSchema = z.object({
  email: z
    .string()
    .email('📧 Email không hợp lệ')
    .toLowerCase(),
  password: z
    .string()
    .min(6, '🔒 Mật khẩu phải có ít nhất 6 ký tự'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const SignUpSchema = z
  .object({
    email: z
      .string()
      .email('📧 Email không hợp lệ')
      .toLowerCase(),
    password: z
      .string()
      .min(8, '🔒 Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, '🔒 Mật khẩu phải chứa ít nhất một chữ hoa')
      .regex(/[0-9]/, '🔒 Mật khẩu phải chứa ít nhất một chữ số'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '🔒 Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof SignUpSchema>
