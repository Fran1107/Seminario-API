import { connection } from '../Database/postgres.js'

export class VentaModel {
    static async getAll() {
        try {
            const res = await connection.query(`SELECT * FROM ventas`)
            return res.rows
        } catch (error) {
            console.error('Error al obtener las ventas:', error)
            return false
        }
    }

    static async getVentaById({ cli_cuil }) {
        try {
            const res = await connection.query(
                `SELECT nro_factura, venta_fecha, cli_cuil, venta_total
                    FROM ventas
                    WHERE cli_cuil = $1;`,
                [cli_cuil]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener la venta del cliente:', error)
            return false
        }
    }

    static async getVentaByFac({ nro_factura }) {
        try {
            const res = await connection.query(
                `SELECT nro_factura, venta_fecha, cli_cuil, venta_total
                    FROM ventas
                    WHERE nro_factura = $1;`,
                [nro_factura]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener la factura del cliente:', error)
            return false
        }
    }

    static async getDetVenta({ nro_factura }) {
        try {
            const res = await connection.query(
                `SELECT nro_factura, cod_prod, detventa_cantidad, detventa_subtotal
                    FROM det_ventas
                    WHERE nro_factura = $1;`,
                [nro_factura]
            ) 
            return res.rows
        } catch (error) {
            console.error('Error al obtener la factura del cliente:', error)
            return false
        }
    }

    static async createVentaWithDetails(cli_cuil, venta_total, cartItems) {
        const client = await connection.connect();

        try {
            // Iniciar la transacción
            await client.query('BEGIN');

            // Insertar en la tabla `ventas`
            const ventaRes = await client.query(
                `
                INSERT INTO ventas (venta_fecha, cli_cuil, venta_total)
                VALUES (now(), $1, $2)
                RETURNING nro_factura;
                `,
                [cli_cuil, venta_total]
            );

            const nro_factura = ventaRes.rows[0].nro_factura;

            // Insertar los detalles de cada producto en `det_ventas`
            for (const producto of cartItems) {
                const { cod_prod, cantidad, total } = producto;
                await client.query(
                    `
                    INSERT INTO det_ventas (nro_factura, cod_prod, detventa_cantidad, detventa_subtotal)
                    VALUES ($1, $2, $3, $4);
                    `,
                    [nro_factura, cod_prod, cantidad, total]
                );
            }

            // Confirmar la transacción
            await client.query('COMMIT');

            return { nro_factura, message: 'Venta y detalles creados correctamente' };
        } catch (error) {
            // Si hay algún error, revertir la transacción
            await client.query('ROLLBACK');
            console.error('Error al crear la venta con detalles:', error);
            return false;
        } finally {
            client.release();
        }
    }
}
