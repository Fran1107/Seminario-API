import { ImgProductModel } from '../Model/imgproduct.js'
import { ProductModel } from '../Model/product.js'
import { validatePartialProduct, validateProduct } from '../Schemas/products.js'

export class ProductController {
    static async getAll(req, res) {
        try {
            const products = await ProductModel.getAll()
            if (!products) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay productos disponibles',
                })
            }
            return res.json(products)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener productos',
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params
        
        try {
            const product = await ProductModel.getById({ id })
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Producto no encontrado',
                })
            }
            // Trae las imagnes de un producto
            const images = await ImgProductModel.getImagesByProductId({
                cod_prod: id,
            })

            return res.json({ ...product, images })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener producto',
            })
        }
    }

    static async create(req, res) {
        const validation = validateProduct(req.body)
        if (!validation.success) {
            return res.status(400).json({
                status: 'error',
                error: validation.error.errors.map((err) => err.message),
            })
        }
        try {
            const product = await ProductModel.create({ input: req.body })
            if (!product) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al crear producto',
                })
            }
            const { url_imagen } = req.body
            if (url_imagen) {
                await ImgProductModel.addImage({
                    prod_id: product.prod_id,
                    url_imagen,
                })
            }
            return res.status(201).json({
                status: 'success',
                product,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear producto',
            })
        }
    }

    static async update(req, res) {

        
        const { id } = req.params
        try {
            const product = await ProductModel.update({ id, input: req.body })
            if (!product) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al actualizar producto',
                })
            }
            return res.json({
                status: 'success',
                product,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al actualizar producto',
            })
        }
    }

    static async delete(req, res) {
        const { id } = req.params
        try {
            const success = await ProductModel.delete({ id })
            if (!success) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Producto no encontrado',
                })
            }
            return res.json({
                status: 'success',
                message: 'Producto eliminado correctamente',
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al eliminar producto',
            })
        }
    }

    static async getByCategory(req, res) {
        const { categoryId } = req.params
        try {
            const products = await ProductModel.getByCategory({ categoryId })
            if (!products) {
                return res.status(404).json({
                    status: 'error',
                    error: 'No se encontraron productos para esta categoría',
                })
            }
            return res.json(products)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener productos por categoría',
            })
        }
    }

    static async getByBrand(req, res) {
        const { brandId } = req.params
        try {
            const products = await ProductModel.getByBrand({ brandId })
            if (!products) {
                return res.status(404).json({
                    status: 'error',
                    error: 'No se encontraron productos para esta marca',
                })
            }
            return res.json(products)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener productos por marca',
            })
        }
    }

    static async search(req, res) {
        const searchTerm = req.query.q || '' // Obtener el termino de busqueda de la consulta
        const limit = parseInt(req.query.limit) || 5 

        try {
            const products = await ProductModel.searchProducts(
                searchTerm,
                limit
            )
            if (!products) {
                return res.status(404).json({
                    status: 'error',
                    error: 'No se encontraron productos',
                })
            }
            return res.json(products)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al buscar productos',
            })
        }
    }

    static async updateHabilitar(req, res) {
        const { cod_prod, habilitar } = req.body

        try {
            const habilit = await ProductModel.updateHabilitar({
                cod_prod,
                habilitar,
            })
            if (!habilit) {
                return res.status(404).json({
                    status: 'error',
                    error: 'No se pudo habilitar o deshabilitar producto',
                })
            }
            return res.json(habilit)
        } catch (error) {
            console.error('Error al habilitar o deshabilitar producto', error)
        }
    }
}
