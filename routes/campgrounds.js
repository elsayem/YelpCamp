const express = require('express')
const router = express.Router()

const Joi = require('joi')
const { campgroundSchema } = require('../schemas.js')

const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')

const campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn} = require('../middleware')

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    // let  msg;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
    // console.log(msg);
}

router.get('/',catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))



router.get('/new', isLoggedIn,(req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', isLoggedIn,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('auther')
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    console.log(campground)
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))


router.post('/',isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError()
    
    const campground = new Campground(req.body.campground)
    // Saving the auther of the created camp
    campground.auther = req.user._id
    // console.log(req.body.campground)
    await campground.save()
    // req.flash('success','CampGround Added successfuly')
    req.flash('success', 'Successfully made a new campground!');
    
    res.redirect(`/campgrounds/${campground._id}`)
}))


//updating campground

router.put('/:id',isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
// destructuring the req.body.campground
    const campground = Campground.findById(id)
    if(!campground.auther.equals(req.user._id)){
        req.flash('error',"You don't have permission to edit")
        return res.redirect(`/campground/${id}`)
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    console.log('campground')
    
        req.flash('success', 'Successfuly Updated the campground');
        res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:id',isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))


//IMPORTANT to MAKE router Working
module.exports = router