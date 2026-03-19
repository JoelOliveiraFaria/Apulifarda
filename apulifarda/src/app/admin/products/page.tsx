// src/app/admin/products/page.tsx
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { addProduct, deleteProduct } from '@/actions/product.actions'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // 1. SEGURANÇA (Verifica se é admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'teu-email@apulifarda.pt') {
    redirect('/login')
  }

  // 2. BUSCAR DADOS (O "Model" da leitura)
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase.from('categories').select('*')

  // 3. A VIEW (O HTML limpinho)
  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Backoffice: Products</h1>
          <p className="text-gray-500">Manage your complete Apulifarda catalog.</p>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-blue-900">Add New Product</h2>
          
          {/* O form chama a função que importámos do outro ficheiro! */}
          <form action={addProduct} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" required className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                <input type="number" name="price" step="0.01" required className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={3} className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category_id" required className="w-full px-4 py-2 border rounded-md text-gray-900 bg-white">
                  <option value="">Select a category...</option>
                  {categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                <input type="text" name="available_sizes" className="w-full px-4 py-2 border rounded-md text-gray-900" placeholder="S, M, L" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                <input type="text" name="available_colors" className="w-full px-4 py-2 border rounded-md text-gray-900" placeholder="White, Navy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" name="image_url" className="w-full px-4 py-2 border rounded-md text-gray-900" />
              </div>
            </div>

            <div className="flex gap-8 py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="allows_embroidery" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Allows Embroidery?</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Product is Active</span>
              </label>
            </div>

            <div className="pt-2 border-t">
              <button type="submit" className="bg-blue-900 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-800 transition">
                Save Product
              </button>
            </div>
          </form>
        </div>

        {/* LISTA DE PRODUTOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                  <td className="p-4 font-medium text-gray-900">{product.name}</td>
                  <td className="p-4 font-semibold text-gray-900">{product.price}€</td>
                  <td className="p-4">
                    {product.is_active 
                      ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                      : <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Draft</span>
                    }
                  </td>
                  <td className="p-4 text-right">
                    {/* O form chama a função de delete que importámos! */}
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button type="submit" className="text-red-600 hover:text-red-800 font-semibold text-sm hover:underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  )
}