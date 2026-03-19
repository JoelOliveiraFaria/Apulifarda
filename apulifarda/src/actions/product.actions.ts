// src/actions/product.actions.ts
'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// Ação para Criar Produto
export async function addProduct(formData: FormData) {
    const supabase = await createClient()
  
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category_id = formData.get('category_id') as string || null
    const image_url = formData.get('image_url') as string
  
    const allows_embroidery = formData.get('allows_embroidery') === 'on'
    const is_active = formData.get('is_active') === 'on'

    const sizesString = formData.get('available_sizes') as string
    const available_sizes = sizesString ? sizesString.split(',').map(s => s.trim()) : []

    const colorsString = formData.get('available_colors') as string
    const available_colors = colorsString ? colorsString.split(',').map(c => c.trim()) : []
  
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    const { error } = await supabase.from('products').insert({
        name, slug, description, price, category_id, image_url,
        available_sizes, available_colors, allows_embroidery, is_active
    })

    if (error) {
        console.error("Erro ao inserir:", error.message)
        throw new Error("Failed to create product") 
    }

    revalidatePath('/admin/products')
}

// Ação para Apagar Produto
export async function deleteProduct(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
  
    const { error } = await supabase.from('products').delete().eq('id', id)
  
    if (error) console.error("Erro ao apagar:", error.message)
  
    revalidatePath('/admin/products')
}