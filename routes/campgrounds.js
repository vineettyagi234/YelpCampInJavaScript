var express = require('express');
var router = express.Router();	
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js")

// Showing all the campgrounds
router.get("/" , function(req , res){
	// Need to get all campground from the db 
	Campground.find({} , function(err , allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/campgrounds" , {campgrounds : allCampgrounds  ,
												   currentUser: req.user});
		}
	});
	
});

// Add new campground to DB
router.post("/" , middleware.isLoggedIn, function(req, res){
	// get the data from the form 
	var name = req.body.name;
	var price = req.body.price;
	var image= req.body.image;
	var description = req.body.description;
	var author = {
		id:  req.user._id,
		username: req.user.username
	}
	var newCampgrounds = {name:name, price: price, image: image , description:description , author: 							author};
	
	Campground.create(newCampgrounds , function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})	
	
});


// New- To create a new campground
router.get("/new" , middleware.isLoggedIn, function(req, res){
			res.render("campgrounds/new.ejs");
		});	


// SHOW MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id" , function(req , res){
	// Find the campgound with provided ID
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
			if(err){
				console.log(err);
			}else{
				res.render("campgrounds/show" , {campground:foundCampground});
			}
		})
	// render show template with that campground
	
});

// Edit the campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});


module.exports = router;