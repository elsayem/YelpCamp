const express = require('express')
const router = express.Router()

const Joi = require('joi')
const { campgroundSchema } = require('../schemas.js')

const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');


const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


router.get('/', catchAsync(campgrounds.index))
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))



router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id', isLoggedIn, catchAsync(campgrounds.showCampground))

//updating campground

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))







//IMPORTANT to MAKE router Working
module.exports = router