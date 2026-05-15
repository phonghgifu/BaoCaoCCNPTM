export default function BlogLoading() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_36%),linear-gradient(to_bottom,#f8fbff,#ffffff)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center mb-12">
          <div>
            <div className="h-7 w-40 rounded-full bg-gray-200" />
            <div className="mt-5 h-16 max-w-4xl rounded-2xl bg-gray-200" />
            <div className="mt-4 h-16 max-w-3xl rounded-2xl bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl">
            <div className="h-24 rounded-2xl bg-gray-200" />
            <div className="h-24 rounded-2xl bg-gray-200" />
            <div className="col-span-2 h-14 rounded-2xl bg-gray-200" />
          </div>
        </div>

        <div className="mb-10 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_160px_auto]">
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="grid gap-6 md:grid-cols-[1fr_220px]">
                <div>
                  <div className="h-10 w-3/4 rounded-2xl bg-gray-200" />
                  <div className="mt-4 h-6 w-full rounded-2xl bg-gray-200" />
                  <div className="mt-3 h-6 w-11/12 rounded-2xl bg-gray-200" />
                  <div className="mt-8 h-10 w-48 rounded-full bg-gray-200" />
                </div>
                <div className="h-48 rounded-2xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
