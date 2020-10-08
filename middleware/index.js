var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All middle ware
var  middlewareObj ={};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				 res.redirect("/campgrounds");
			} 
			else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();  	
				} else {
					req.flash("error", "You don't have permission!!")
					res.redirect("back");
			}
			
		}
		});	
	} 
	else {
		req.flash("error" ,  "You need to log in first ");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			 res.redirect("/campgrounds");
		} else {
			//console.log(foundComment.author.id);
			//console.log(req.user._id);
			if(foundComment.author.id.equals(req.user._id)){
				next();  	
			} else {
				req.flash("error" , "You don't have permission!")
				res.redirect("back");
			}
			
		}
		});	
	} 
	else {
		req.flash("error" , "You have to be logged in!")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please logged in first")
	res.redirect("/login");
}
module.exports = middlewareObj;