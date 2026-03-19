import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function CatalogPage() {
  const supabase = await createClient()

  // 1. Ir buscar APENAS os produtos ativos!
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true) // A magia está aqui: esconde os rascunhos
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* Cabeçalho da Loja */}
      <div className="bg-blue-900 text-white py-12 px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Catálogo Apulifarda</h1>
          <p className="text-blue-200 text-lg">
            Descubra a nossa coleção de fardas e batas de alta qualidade.
          </p>
        </div>
      </div>

      {/* Grelha de Produtos */}
      <div className="max-w-6xl mx-auto px-8">
        {products?.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            Ainda não há produtos disponíveis na loja.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products?.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group">
                
                {/* Imagem do Produto */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.image_url ? (
                    // Usamos a tag <img> normal para não termos chatices de configuração com as imagens da nuvem para já
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Detalhes do Produto */}
                <div className="p-5">
                  <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">
                    {/* @ts-ignore - Ignorar erro temporário de tipos aninhados do Supabase */}
                    {product.categories?.name || 'Sem Categoria'}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 truncate">
                    {product.name}
                  </h2>
                  <p className="text-xl font-extrabold text-gray-900 mb-4">
                    {product.price.toFixed(2)} €
                  </p>

                  <button className="w-full bg-blue-50 text-blue-900 font-bold py-2 rounded-md hover:bg-blue-900 hover:text-white transition border border-blue-200">
                    Ver Detalhes
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}