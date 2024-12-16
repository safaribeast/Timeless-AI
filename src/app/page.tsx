import ContentGenerator from '@/components/ContentGenerator'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wider text-white">Timeless AI Content Generator</span>
          </div>
          
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-8 pb-8 pt-12 md:py-16">
          <div className="mx-auto flex max-w-[980px] flex-col items-start gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl/none lg:text-7xl/none">
              Create timeless content that
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">performs.</span>
            </h1>
            <p className="text-lg/relaxed text-gray-300 max-w-[700px]">
              Generate engaging articles and detailed safari itineraries optimized for search engines with Timeless International.
              Choose your content type below to get started.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[980px]">
            <ContentGenerator />
          </div>
        </section>
      </main>
    </div>
  )
}
