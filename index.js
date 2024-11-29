import express, { urlencoded } from 'express'
import { usersRouter } from './Routes/user.js'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './Middleware/cors.js'
import session from 'express-session'
import passport from 'passport'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(corsMiddleware())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

app.use(
    session({
        secret: process.env.TOP_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)

import './Config/passport.js' 
import { productsRouter } from './Routes/product.js'
import { categoriasRouter } from './Routes/categoria.js'
import { provinciasRouter } from './Routes/provincia.js'
import { localidadesRouter } from './Routes/localidad.js'
import { adminRouter } from './Routes/opadmin.js'
import { marcasRouter } from './Routes/marca.js'
import { imgproductRouter } from './Routes/imgproduct.js'
import { carritoRouter } from './Routes/carrito.js'
import { DomicilioRouter } from './Routes/domicilio.js'
import { costoenvioRouter } from './Routes/costoenvio.js'
import { MetPagoRouter } from './Routes/met_pago.js'
import { ventasRouter } from './Routes/venta.js'
import { pagosRouter } from './Routes/pago.js'
import { enviosRouter } from './Routes/envio.js'
import { pedidosRouter } from './Routes/pedido.js'
import { espRouter } from './Routes/especifiacion.js'
import { consultaRouter } from './Routes/consulta.js'
app.use(passport.initialize())
app.use(passport.session())

app.use('/admin', adminRouter)
app.use('/user', usersRouter)
app.use('/products', productsRouter)
app.use('/categorias', categoriasRouter)
app.use('/provincias', provinciasRouter)
app.use('/localidades', localidadesRouter)
app.use('/marcas', marcasRouter)
app.use('/imgproduct', imgproductRouter)
app.use('/cart', carritoRouter)
app.use('/domicilio', DomicilioRouter)
app.use('/costoenvio', costoenvioRouter)
app.use('/metpago', MetPagoRouter)
app.use('/ventas', ventasRouter)
app.use('/pago', pagosRouter)
app.use('/envios', enviosRouter)
app.use('/pedido', pedidosRouter)
app.use('/especificacion', espRouter)
app.use('/consulta', consultaRouter)

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
