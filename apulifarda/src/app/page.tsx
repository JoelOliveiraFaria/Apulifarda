import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full text-center space-y-10">
        
        {/* Cabeçalho principal */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 tracking-tight">
            Apulifarda
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Premium Healthcare & Hospitality Uniforms. <br className="hidden md:block" />
            Designed for comfort, crafted for professionals.
          </p>
        </div>

        {/* Botões de Ação (Login e Register) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-blue-900 text-white font-bold text-lg rounded-lg hover:bg-blue-800 transition shadow-lg hover:shadow-xl text-center"
          >
            Sign In
          </Link>
          
          <Link 
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 font-bold text-lg rounded-lg border-2 border-blue-900 hover:bg-gray-50 transition shadow-sm hover:shadow-md text-center"
          >
            Create Account
          </Link>
        </div>

        {/* Secção de Vantagens (Para dar confiança ao cliente) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 mt-8 border-t border-gray-200">
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-3">🧵</span>
            <h3 className="font-bold text-gray-900 text-lg">Premium Fabrics</h3>
            <p className="text-gray-500 text-sm mt-1">Durable, breathable, and made to last through countless shifts.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-3">🇵🇹</span>
            <h3 className="font-bold text-gray-900 text-lg">Made in Portugal</h3>
            <p className="text-gray-500 text-sm mt-1">100% national production with over 14 years of expertise.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-3">✨</span>
            <h3 className="font-bold text-gray-900 text-lg">Custom Embroidery</h3>
            <p className="text-gray-500 text-sm mt-1">Personalize your uniform with your name or clinic logo.</p>
          </div>
        </div>

      </div>
    </main>
  )
}