import { connection } from '../Database/postgres.js'

export class pedidoModel {
    static async getAll() {
        try {
            const res = await connection.query(`SELECT * FROM pedidos`)
            return res.rows
        } catch (error) {
            console.error('Error al obtener todos los pedidos:', error)
            return false
        }
    }

    static async getPedido({ pedido_id }) {
        try {
            const res = await connection.query(
                `
                SELECT * FROM pedidos WHERE pedido_id = $1
                `,
                [pedido_id]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener el pedido del cliente:', error)
            return false
        }
    }

    static async getPedidoById({ nro_factura }) {
        try {
            const res = await connection.query(
                `
                SELECT * FROM pedidos WHERE nro_factura = $1
                `,
                [nro_factura]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener el pedido del cliente:', error)
            return false
        }
    }

    static async create({ nro_factura }) {
        try {
            const res = await connection.query(
                `
                INSERT INTO pedidos (estado, nro_factura) VALUES ('Ingreso del Pedido', $1)
                RETURNING *;
                `,
                [nro_factura]
            )
            return res.rows[0]
        } catch (error) {
            console.error('Error al crear el envios:', error)
            return false
        }
    }

    static async asignarOperador({ oper_id, pedido_id }) {
        try {
            const res = await connection.query(
                `
                UPDATE pedidos
                SET oper_id = $1
                WHERE pedido_id = $2;
                `,
                [oper_id, pedido_id]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener el pedido del cliente:', error)
            return false
        }
    }

    static async editarEstado({ estado, pedido_id }) {
        try {
            const res = await connection.query(
                `
                UPDATE pedidos
                SET estado = $1
                WHERE pedido_id = $2;
                `,
                [estado, pedido_id]
            )
            return res.rows
        } catch (error) {
            console.error('Error al actualizar estado del pedido:', error)
            return false
        }
    }
}
