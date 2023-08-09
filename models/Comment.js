
const mongoose= require('mongoose');
const Joi= require('joi');
const { func } = require('joi');

//Comment schema
const CommentSchema= new mongoose.Schema( {

    postId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    text: {
        type:String,
        required:true,
    },
    username: {
        type:String,
        required:true,
    }

} , {timestamps: true } )

// Comment model

const Comment= mongoose.model("Comment", CommentSchema);

//Validate Create Comment

function validateCreateComment(obj) {
    const schema = Joi.object({
        postId: Joi.string().required().label("Post Id "),
        text: Joi.string().trim().required(),
    })

    return schema.validate(obj);
}

// validate Update Comment


function validateUpdateComment(obj) {
    const schema = Joi.object({
        text: Joi.string().trim().required(),
    })

    return schema.validate(obj);
}


module.exports= {
    Comment,
    validateCreateComment,
    validateUpdateComment,
}