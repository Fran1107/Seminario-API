import { ImgProductModel } from "../Model/imgproduct.js";
import { uploadFile } from "../util/uploadFile.js";

export class ImgProductController {

    static async addImage(req, res) {
        const image = req.files.photo
        const { cod_prod } = req.params;

        if (image && image.length > 0 && cod_prod) {

            try {
                const { ref, downloadURL } = await uploadFile(image[0], 1280, 720)

                const imagen = await ImgProductModel.addImage({ cod_prod, url:downloadURL });
                
                if (imagen) {
                    return res.status(201).json({
                        status: "success",
                        message: "Imagen agregada exitosamente",
                        data: imagen
                    });
                } else {
                    return res.status(500).json({
                        status: "error",
                        message: "No se pudo agregar la imagen"
                    });
                }
            } catch (error) {
                console.error("Error en addImage controller:", error);
                return res.status(500).json({
                    status: "error",
                    message: "Error interno del servidor"
                });
            }
            
        }else{
            return res.status(400).json({
                status: "error",
                message: "Faltan datos necesarios (cod_prod, image)"
            });
        }
    }

    // Función para obtener todas las imágenes de un producto
    static async getImagesByProductId(req, res) {
        const { cod_prod } = req.params;

        if (!cod_prod) {
            return res.status(400).json({
                status: "error",
                message: "El parámetro cod_prod es requerido"
            });
        }

        try {
            const images = await ImgProductModel.getImagesByProductId({ cod_prod });

            if (images && images.length > 0) {
                return res.status(200).json({
                    status: "success",
                    message: "Imágenes obtenidas exitosamente",
                    data: images
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    message: "No se encontraron imágenes para este producto"
                });
            }
        } catch (error) {
            console.error("Error en getImagesByProductId controller:", error);
            return res.status(500).json({
                status: "error",
                message: "Error interno del servidor"
            });
        }
    }

    static async toggleVisibility(req, res) {
        const { imgprod_id } = req.params;
        const { hidden } = req.body; 
    
        if (typeof hidden !== 'boolean') {
            return res.status(400).json({
                status: "error",
                message: "El valor de 'hidden' debe ser booleano (true o false)."
            });
        }
    
        try {
            const updatedImage = await ImgProductModel.toggleImageVisibility({ imgprod_id, hidden });
    
            if (updatedImage) {
                return res.status(200).json({
                    status: "success",
                    message: `Imagen ${hidden ? 'ocultada' : 'mostrada'} correctamente`,
                    data: updatedImage,
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    message: "No se encontró la imagen para actualizar"
                });
            }
        } catch (error) {
            console.error("Error en toggleVisibility controller:", error);
            return res.status(500).json({
                status: "error",
                message: "Error interno del servidor"
            });
        }
    }
    
}
