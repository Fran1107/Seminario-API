import { z } from 'zod'

const productSchema = z.object({
    cod_prod: z.string({
        invalid_type_error: 'nombre must be a string',
        required_error: 'nombre is required',
    }),
    prod_nombre: z.string({
        invalid_type_error: 'nombre must be a string',
        required_error: 'nombre is required',
    }),
    prod_precio: z.number({
        invalid_type_error: 'precio must be a number',
        required_error: 'precio is required',
    }).min(0, { message: 'precio must be greater than or equal to 0' }),
    prod_descripcion: z.string({
        invalid_type_error: 'descripcion must be a string',
        required_error: 'descripcion is required',
    }).optional(),
    prod_stock: z.number({
        invalid_type_error: 'stock must be a number',
    }).min(0, { message: 'stock must be greater than or equal to 0' }).default(0),
    cat_id: z.string({
        invalid_type_error: 'cat_id must be a number',
        required_error: 'cat_id is required',
    }),
    marca_id: z.string({
        invalid_type_error: 'marca_id must be a number',
        required_error: 'marca_id is required',
    }),
    prod_destacado: z.boolean().default(false), 
    habilitar: z.boolean().default(false),
})

export function validateProduct(object) {
    return productSchema.safeParse(object)
}

export function validatePartialProduct(object) {
    return productSchema.partial().safeParse(object)
}
