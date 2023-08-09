const router= require('express').Router();

const { createCommentCtrl, getAllCommentsCtrl,
     deleteCommentCtrl, updateCommentCtrl } = require('../controllers/commentController');

const validateObjectId = require('../middelwares/validateObjectId');

const { verifyToken, verifyTokenAndAdmin } = require('../middelwares/verifyToken');

//   /api/comments
router.route('/').post(verifyToken , createCommentCtrl)
        .get(verifyTokenAndAdmin, getAllCommentsCtrl);

// /api/comments/:id

router.route("/:id").delete(validateObjectId, verifyToken, deleteCommentCtrl)
    .put( validateObjectId, verifyToken, updateCommentCtrl );

module.exports= router;