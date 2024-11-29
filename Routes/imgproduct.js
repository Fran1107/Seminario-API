import { Router } from 'express'
import { ImgProductController } from '../Controllers/imgproducts.js'
import { upload } from '../Config/multer.js'

export const imgproductRouter = Router()

imgproductRouter.post( '/addImage/:cod_prod', upload.fields([{ name: 'photo', maxCount: 1 }]), ImgProductController.addImage)
imgproductRouter.get( '/getImagesByProductId/:cod_prod', ImgProductController.getImagesByProductId)
imgproductRouter.patch( '/toggleVisibility/:imgprod_id', ImgProductController.toggleVisibility)
