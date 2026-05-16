#!/usr/bin/env node

/**
 * Debug script để kiểm tra environment variables configuration
 * Usage: node debug-env.js
 */

console.log('\n📋 === ENVIRONMENT VARIABLES DEBUG ===\n')

const vars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'NODE_ENV': process.env.NODE_ENV,
}

// 1. Check if variables exist
console.log('1️⃣  Variable Existence:')
Object.entries(vars).forEach(([key, value]) => {
  if (value) {
    const display = key.includes('KEY') ? value.substring(0, 20) + '...' : value
    console.log(`   ✅ ${key} = ${display}`)
  } else {
    console.log(`   ❌ ${key} = <undefined>`)
  }
})

// 2. Check if they're placeholders
console.log('\n2️⃣  Placeholder Detection:')
const isPlaceholder = (val) => val && (val.includes('your-') || val.includes('your_'))

Object.entries(vars).forEach(([key, value]) => {
  if (value) {
    if (isPlaceholder(value)) {
      console.log(`   ⚠️  ${key} is a PLACEHOLDER`)
    } else {
      console.log(`   ✅ ${key} looks like a real value`)
    }
  }
})

// 3. Source detection
console.log('\n3️⃣  Source Detection:')
const envFiles = {
  '.env.local': 'Local development',
  '.env.production': 'Local production build',
  '.env.development': 'Dev environment',
  'Vercel Dashboard': 'Production/Preview deployment'
}

const hasLocalFile = vars['NEXT_PUBLIC_SUPABASE_URL'] && !isPlaceholder(vars['NEXT_PUBLIC_SUPABASE_URL'])
if (hasLocalFile) {
  console.log('   📁 Source: .env.local or .env.production (local)')
  console.log('   ℹ️  These files are NOT committed to git')
} else {
  console.log('   ❌ No valid env file found locally')
  console.log('   ℹ️  On Vercel: check Vercel Dashboard → Environment Variables')
}

// 4. Configuration recommendation
console.log('\n4️⃣  Configuration Status:')
if (vars['NEXT_PUBLIC_SUPABASE_URL'] && !isPlaceholder(vars['NEXT_PUBLIC_SUPABASE_URL'])) {
  console.log('   ✅ Local configuration: OK')
  console.log('   📌 Next: Set Vercel Environment Variables')
  console.log('      - Vercel Dashboard → Settings → Environment Variables')
  console.log('      - Add NEXT_PUBLIC_SUPABASE_URL')
  console.log('      - Add NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('      - Set for: Production, Preview, Development')
  console.log('      - Redeploy')
} else {
  console.log('   ❌ Local configuration: Missing')
  console.log('   📌 Next: Create .env.local file')
  console.log('      - cp .env.example .env.local')
  console.log('      - Add your Supabase credentials')
  console.log('      - Restart dev server')
}

// 5. Testing
console.log('\n5️⃣  Quick Test Commands:')
console.log('   Local dev:')
console.log('      npm run dev')
console.log('      Open: http://localhost:3000/api/debug')
console.log('')
console.log('   Local build:')
console.log('      npm run build')
console.log('      npm start')
console.log('')
console.log('   Check env file:')
console.log('      cat .env.local')
console.log('      cat .env.example')
console.log('')

// 6. Common issues
console.log('6️⃣  Common Issues:')
console.log('   ❌ ".env.local file not found"')
console.log('      → Create: cp .env.example .env.local')
console.log('')
console.log('   ❌ "Missing environment variables"')
console.log('      → Add values to .env.local AND Vercel Dashboard')
console.log('')
console.log('   ❌ "Build fails on Vercel"')
console.log('      → Vercel Dashboard: check Environment Variables are set')
console.log('      → Redeploy after setting')
console.log('')
console.log('   ❌ "Placeholder values (your-xxx)"')
console.log('      → Get real values from Supabase Dashboard')
console.log('      → Update .env.local and Vercel')
console.log('')

console.log('✅ For more details: VERCEL_DEPLOYMENT_GUIDE.md\n')
