
const cloudinary= require('cloudinary');

cloudinary.config({

    cloud_name: process.env. CLAUDINARY_CLOUD_NAME , 
    api_key : process.env. CLAUDINARY_API_KEY ,
    api_secret : process.env. CLAUDINARY_API_SECRET
});

// Cloudinary Upload Image 

 const cloudiaryUploadImage = async( fileToUpload )=> {

    try {
        const data = await cloudinary.uploader.upload(fileToUpload ,{
            resourse_type: 'auto',
        });

        return data;
        // ici data contient url et publicId 

    } catch (error) {
        return error
    }

 }


 // Cloudinary Remove Image 

 const cloudiaryRemoveImage = async( imagePublicId )=> {

    try {
        
        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;

    } catch (error) {
        return error
    }

 }

  // Cloudinary Remove a multiple Images 

  const cloudiaryRemoveMultipleImage = async( publicIds )=> {

    try {
        
        const result = await cloudinary.v2.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        return error
    }

 }
 


 module.exports= {

    cloudiaryUploadImage,
    cloudiaryRemoveImage,
    cloudiaryRemoveMultipleImage,
    
 }