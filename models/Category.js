

const mongoose= require('mongoose');
const Joi= require('joi');
const { func } = require('joi');


//Category schema
const CategorySchema= new mongoose.Schema( {

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim:true,
        unique: true,
    },


} , {timestamps: true } )

// Comment model

const Category= mongoose.model("Category", CategorySchema);

//Validate Create Category

function validateCreateCategory(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().required()
    
    })

    return schema.validate(obj);
}



module.exports= {
    Category,
    validateCreateCategory,
}