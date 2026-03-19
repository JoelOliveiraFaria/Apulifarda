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
    
    // 1. AQUI COMEÇA A MUDANÇA: Vamos agarrar no Ficheiro em vez do Texto
    const imageFile = formData.get('image') as File 
    let image_url = '' // Começa vazio, vamos encher com o link da nuvem
  
    const allows_embroidery = formData.get('allows_embroidery') === 'on'
    const is_active = formData.get('is_active') === 'on'

    const sizesString = formData.get('available_sizes') as string
    const available_sizes = sizesString ? sizesString.split(',').map(s => s.trim()) : []

    const colorsString = formData.get('available_colors') as string
    const available_colors = colorsString ? colorsString.split(',').map(c => c.trim()) : []
  
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    // 2. FAZER O UPLOAD DA IMAGEM PARA O BALDE
    if (imageFile && imageFile.size > 0) {
        // Criar um nome único para a foto (ex: 1712345678-bata-branca.jpg)
        const uniqueFileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`
        
        // Enviar para o Supabase Storage (balde 'product-images')
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(uniqueFileName, imageFile)

        if (uploadError) {
            console.error('Erro no upload da imagem:', uploadError.message)
            throw new Error('Falha ao fazer upload da imagem')
        }

        // Pedir ao Supabase o link público da foto que acabámos de enviar
        const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(uniqueFileName)
            
        image_url = publicUrlData.publicUrl // Guardamos o link oficial
    }

    // 3. GUARDAR NA BASE DE DADOS (agora com o link oficial do Supabase!)
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

export async function deleteProduct(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
  
    const { error } = await supabase.from('products').delete().eq('id', id)
  
    if (error) console.error("Erro ao apagar:", error.message)
  
    revalidatePath('/admin/products')
}