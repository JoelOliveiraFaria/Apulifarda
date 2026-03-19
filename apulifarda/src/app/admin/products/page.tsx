import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export default async function AdminProductPage() {
    
    //Buscar produtos a base de dados
    const {data: products} = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', {ascending: false})

    const {data: categories} = await supabase
        .from('categories')
        .select('*')

    //Create
    async function addProduct(formData: FormData) {
        'use server'

        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const category_id = formData.get('category_id') as string || null
        const image_url = formData.get('image_url') as string

        // Tratamento de Checkboxes (se estiver checked, o HTML envia 'on')
        const allows_embroidery = formData.get('allows_embroidery') === 'on'
        const is_active = formData.get('is_active') === 'on'

        // Tratamento de Arrays (Transformar "S, M, L" num array real)
        const sizesString = formData.get('available_sizes') as string
        const available_sizes = sizesString ? sizesString.split(',').map(s => s.trim()) : []

        const colorsString = formData.get('available_colors') as string
        const available_colors = colorsString ? colorsString.split(',').map(c => c.trim()) : []
    
        // Gerar o slug
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')


        const { error } = await supabase.from('products').insert({
            name,
            slug,
            description,
            price,
            category_id,
            image_url,
            available_sizes,
            available_colors,
            allows_embroidery,
            is_active
        })
    }
}