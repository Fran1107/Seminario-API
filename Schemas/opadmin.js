import {z} from 'zod'

const operSchema = z.object({
    oper_cuil: z.bigint({
        invalid_type_error: 'oper_cuil must be a number',
        required_error: 'oper_cuil is required',
    }),
    nombre: z.string({
        invalid_type_error: 'nombre must be a string',
        required_error: 'nombre is required',
    }),
    oper_apellido: z.string({
        invalid_type_error: 'oper_apellido must be a string',
    }).default(''),
    email: z.string({
        invalid_type_error: 'oper_email must be a string',
        required_error: 'oper_email is required',
    }),
    contrasena: z.string({
        invalid_type_error: 'oper_contrasena must be a string',
        required_error: 'oper_contrasena is required',
    }),
    oper_telefono: z.string({
        message: 'oper_telefono must be a string',
    }).default(''),
    rol_id: z.number().default(2),
})

export function validateOper(object) {
    return operSchema.safeParse(object)
}

export function validatePartialOper(object) {
    return operSchema.partial().safeParse(object)
}
