import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleProjects = [
  {
    title: 'Hệ Thống Quản Lý Blog',
    description:
      'Một ứng dụng web full-stack xây dựng với Next.js, TypeScript và Supabase. Có tính năng xác thực, quản lý bài viết, bình luận và tương tác cộng đồng.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    image: '🎯',
  },
  {
    title: 'Ứng Dụng Quản Lý Công Việc',
    description:
      'Ứng dụng To-Do list hiện đại với kéo-thả, lưu dữ liệu và giao diện tối/sáng.',
    technologies: ['React', 'Drag & Drop', 'Local Storage', 'CSS Modules'],
    image: '✅',
  },
  {
    title: 'E-Commerce Platform',
    description:
      'Nền tảng thương mại điện tử đầy đủ với giỏ hàng, thanh toán, quản lý sản phẩm và đơn hàng.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express'],
    image: '🛒',
  },
  {
    title: 'Dashboard Phân Tích Dữ Liệu',
    description:
      'Dashboard hiển thị metrics quan trọng, biểu đồ và thống kê doanh số bán hàng.',
    technologies: ['React', 'Chart.js', 'D3.js', 'API REST'],
    image: '📊',
  },
  {
    title: 'Ứng Dụng Mạng Xã Hội Mini',
    description:
      'Mạng xã hội đơn giản với khả năng đăng bài, like, bình luận, follow người dùng và tin nhắn trực tiếp.',
    technologies: ['React Native', 'Firebase', 'Redux', 'Socket.io'],
    image: '👥',
  },
  {
    title: 'Trang Web Du Lịch',
    description:
      'Website du lịch đẹp mắt với danh sách điểm đến, thông tin chi tiết, đặt tour và hệ thống review.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    image: '✈️',
  },
]

async function seedProjects() {
  const { count, error: countError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    throw countError
  }

  if ((count ?? 0) > 0) {
    console.log(`Projects table already has ${count} rows. Skipping seed.`)
    return
  }

  const { data, error } = await supabase.from('projects').insert(sampleProjects).select('id, title')

  if (error) {
    throw error
  }

  console.log(`Seeded ${data?.length ?? 0} projects.`)
}

seedProjects().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})
