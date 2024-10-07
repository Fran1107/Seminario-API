import {z} from 'zod'

const userSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'nombre must be a string',
        required_error: 'nombre is required',
    }),
    apellido: z.string({
        invalid_type_error: 'apellido must be a string',
        required_error: 'apellido is required',
    }),
    email: z.string({
        invalid_type_error: 'email must be a string',
        required_error: 'email is required',
    }),
    contrasena: z.string({
        invalid_type_error: 'contrasena must be a string',
        required_error: 'contrasena is required',
    })
})

export function validateUser(object) {
    return userSchema.safeParse(object)
}

export function validatePartialUser(object) {
    return userSchema.partial().safeParse(object)
}
