import {z} from 'zod'

const userSchema = z.object({
    cli_cuil: z.string({
        invalid_type_error: 'cli_cuil must be a number',
        required_error: 'cli_cuil is required',
    }),
    cli_dni: z.string({
        invalid_type_error: 'cli_dni must be a number',
    }).default(''),
    nombre: z.string({
        invalid_type_error: 'cli_nombre must be a string',
        required_error: 'cli_nombre is required',
    }),
    cli_apellido: z.string({
        invalid_type_error: 'cli_apellido must be a string',
    }).default(''),
    cli_email: z.string({
        invalid_type_error: 'cli_email must be a string',
        required_error: 'cli_email is required',
    }),
    cli_contrasena: z.string({
        invalid_type_error: 'cli_contrasena must be a string',
        required_error: 'cli_contrasena is required',
    }),
    cli_telefono: z.string({
        message: 'cli_telefono must be a string',
    }).default(''),
    prov_id: z.string({
        invalid_type_error: 'prov_id must be a string',
    }),
    rol_id: z.number().default(1),
    googleId: z.string({
        message: "googleId must be a string",
    }).default(''),
    local_codpostal: z.string({
        invalid_type_error: 'codpostal must be a number',
    }),
})

export function validateUser(object) {
    return userSchema.safeParse(object)
}

export function validatePartialUser(object) {
    return userSchema.partial().safeParse(object)
}
