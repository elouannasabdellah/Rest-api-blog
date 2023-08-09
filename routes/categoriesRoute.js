const router= require('express').Router();

const {  createCategoryCtrl, getAllCategoriesCtrl, deleteCategoryCtrl } = require('../controllers/categoriesController');
const { verifyTokenAndAdmin } = require('../middelwares/verifyToken');
const validateObjectId = require('../middelwares/validateObjectId')



//   /api/categories

router.route("/")
    .post( verifyTokenAndAdmin, createCategoryCtrl )
    .get( getAllCategoriesCtrl)

//  /api/categories/:id
router.route("/:id").delete(validateObjectId , verifyTokenAndAdmin, deleteCategoryCtrl )


module.exports= router;