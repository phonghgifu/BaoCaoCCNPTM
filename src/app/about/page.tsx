import Link from 'next/link'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Về Chúng Tôi - Professional Blog',
  description: 'Tìm hiểu thêm về nền tảng blog chuyên nghiệp dành cho sinh viên năm 4',
}

export default function AboutPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Về Nền Tảng Của Chúng Tôi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Một không gian được tạo ra để sinh viên năm 4 chia sẻ kiến thức, xây dựng portfolio và phát triển kỹ năng chuyên môn.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="text-gray-600 text-lg mb-4">
                Chúng tôi tin rằng mỗi sinh viên đều có những kiến thức và kinh nghiệm quý báu cần được chia sẻ. 
                Nền tảng này được xây dựng để tạo một cộng đồng học tập chuyên nghiệp.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Mục tiêu của chúng tôi là giúp sinh viên năm 4 chuẩn bị tốt nhất cho bước vào thế giới công việc thực tế, 
                với một portfolio ấn tượng và kinh nghiệm thực tiễn.
              </p>
              <p className="text-gray-600 text-lg">
                Thông qua các bài viết, dự án và tương tác cộng đồng, chúng tôi muốn tạo ra một nền tảng nơi 
                sự phát triển chuyên môn và kỹ năng mềm đi cùng nhau.
              </p>
            </div>
            <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-lg h-80 flex items-center justify-center">
              <span className="text-7xl">🎯</span>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Giá Trị Cốt Lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sáng Tạo</h3>
              <p className="text-gray-600">
                Chúng tôi khuyến khích sáng tạo và đổi mới trong mỗi bài viết và dự án. Hãy chia sẻ những ý tưởng độc đáo của bạn.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cộng Đồng</h3>
              <p className="text-gray-600">
                Một cộng đồng mạnh mẽ được xây dựng trên sự tôn trọng, hỗ trợ lẫn nhau và chia sẻ kiến thức.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Phát Triển</h3>
              <p className="text-gray-600">
                Chúng tôi tin vào sự phát triển liên tục. Mỗi ngày là một cơ hội để học hỏi và cải thiện kỹ năng.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 p-12 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Những Điểm Nổi Bật</h2>
          <ul className="space-y-4 text-lg text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-4">✓</span>
              <span>
                <strong>Blog Chuyên Nghiệp:</strong> Viết và chia sẻ bài viết kỹ thuật, kinh nghiệm học tập và insight.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-4">✓</span>
              <span>
                <strong>Portfolio Builder:</strong> Xây dựng một portfolio ấn tượng để trình bày với nhà tuyển dụng.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-4">✓</span>
              <span>
                <strong>Cộng Đồng Tương Tác:</strong> Kết nối với các sinh viên khác, bình luận, chia sẻ ý kiến.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-4">✓</span>
              <span>
                <strong>Hỗ Trợ Xác Thực:</strong> Hệ thống bảo mật với xác thực OAuth để bảo vệ dữ liệu của bạn.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-4">✓</span>
              <span>
                <strong>Thiết Kế Responsive:</strong> Truy cập trên mọi thiết bị - desktop, tablet, mobile.
              </span>
            </li>
          </ul>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Đội Ngũ Phát Triển</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="w-32 h-32 bg-linear-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl">
                👨‍💻
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nhà Phát Triển Full-Stack</h3>
              <p className="text-gray-600 mb-4">
                Sử dụng Next.js, React, TypeScript và Supabase để xây dựng nền tảng hiện đại, nhanh chóng và an toàn.
              </p>
              <p className="text-gray-500">Cam kết với chất lượng code và trải nghiệm người dùng tuyệt vời.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="w-32 h-32 bg-linear-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl">
                🎨
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nhà Thiết Kế UX/UI</h3>
              <p className="text-gray-600 mb-4">
                Tập trung vào việc tạo ra một giao diện đẹp, dễ sử dụng và chuyên nghiệp.
              </p>
              <p className="text-gray-500">Thiết kế responsive và accessible cho tất cả người dùng.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white p-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-6">Bạn Có Câu Hỏi?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Chúng tôi rất vui khi nghe ý kiến từ bạn. Hãy liên hệ với chúng tôi hoặc tham gia cộng đồng ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-50 transition"
            >
              Tham Gia Ngay
            </Link>
            <a
              href="mailto:info@ourblog.com"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Liên Hệ Với Chúng Tôi
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
