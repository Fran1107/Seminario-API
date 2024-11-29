import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../Config/firebase.js'
import sharp from 'sharp'

export async function uploadFile(file, ancho, alto) {
    let fileBuffer = await sharp(file.buffer)
        .resize({ width: ancho, height: alto, fit: 'contain' })
        .toBuffer()

    const fileRef = ref(storage, `files/${file.originalname} ${Date.now()}`)

    const fileMetadata = {
        contentType: file.mimetype,
    }

    const fileUploadPromise = uploadBytesResumable(
        fileRef,
        fileBuffer,
        fileMetadata
    )

    await fileUploadPromise

    const fileDownloadURL = await getDownloadURL(fileRef)

    return { ref: fileRef, downloadURL: fileDownloadURL }
}
