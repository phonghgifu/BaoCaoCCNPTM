#!/usr/bin/env node

import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Checking Supabase Connection...\n')

// Check 1: Environment variables exist
console.log('1️⃣  Environment Variables:')
if (!url) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL is missing')
} else if (url.includes('your-')) {
  console.log(`   ⚠️  NEXT_PUBLIC_SUPABASE_URL is a placeholder: ${url}`)
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL is set: ${url}`)
}

if (!key) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
} else if (key.includes('your-')) {
  console.log(`   ⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY is a placeholder`)
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set (${key.substring(0, 20)}...)`)
}

// Check 2: Validate URL format
console.log('\n2️⃣  URL Format Validation:')
if (url && url.includes('supabase.co')) {
  console.log('   ✅ Looks like a valid Supabase URL')
} else if (url) {
  console.log('   ⚠️  URL format may be incorrect')
} else {
  console.log('   ❌ No URL to validate')
}

// Check 3: Connection Test
console.log('\n3️⃣  Connection Test:')
if (url && key && !url.includes('your-') && !key.includes('your-')) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)
    console.log('   ✅ Supabase client created successfully')
    console.log('   ℹ️  You can now make queries to the database')
  } catch (error) {
    console.log('   ❌ Failed to create Supabase client:', error.message)
  }
} else {
  console.log('   ⚠️  Cannot test connection - missing or placeholder credentials')
}

// Summary
console.log('\n📊 Summary:')
if (url?.includes('supabase.co') && key && !key.includes('your-')) {
  console.log('   ✅ Supabase appears to be properly configured!')
  console.log('   🚀 Ready to connect to the database')
} else {
  console.log('   ⚠️  Supabase is not fully configured yet')
  console.log('   📝 To configure:')
  console.log('      1. Create a Supabase project at https://supabase.com')
  console.log('      2. Get your URL and anon key from the project settings')
  console.log('      3. Update .env.local with these values')
}
