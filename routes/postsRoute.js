
const router= require('express').Router();

const { createPostCtrl, getAllPostsCtrl, getSinglePostCtrl, getPostCountCtrl, deletePostCtrl, updatePostCtrl, updatePostImageCtrl, toggleLikeCtrl } = require('../controllers/postsController');
const photoUpload= require('../middelwares/photoUpload');
const validateObjectId = require('../middelwares/validateObjectId');

const { verifyToken }= require('../middelwares/verifyToken');

//  /api/posts

router.route("/")
    .post(verifyToken, photoUpload.single('image'), createPostCtrl)
    .get(getAllPostsCtrl)

    //   /api/posts/count
router.route("/count").get( getPostCountCtrl )

//   /api/posts/:id => get a single post

router.route("/:id").get(validateObjectId, getSinglePostCtrl )
    .delete(validateObjectId , verifyToken , deletePostCtrl)
    .put(validateObjectId, verifyToken, updatePostCtrl );

//  /api/posts/update-image/:id
router.route("/update-image/:id")
    .put(validateObjectId,verifyToken,photoUpload.single("image"), updatePostImageCtrl );


//   /api/posts/like/:id

router.route("/like/:id").put(validateObjectId, verifyToken, toggleLikeCtrl)

module.exports= router;