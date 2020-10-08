var express = require('express');
var router = express.Router({mergeParams: true});

var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require("../middleware/index.js")

// For a new comment
router.get("/new" , middleware.isLoggedIn ,  function(req , res){
	// find campground by id
	Campground.findById(req.params.id , function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new" , {campground: campground});		
		}
	})
	
})

// To create a new comment
router.post("/" , middleware.isLoggedIn ,function(req , res){
	//looking campgroud using ID
	Campground.findById(req.params.id , function(err, campground){
		if(err){
			console.log(err);
		}else{
				// create a new comments
			Comment.create(req.body.comment , function(err , comment){
				if(err){
					console.log(err);
				}else{
					// add username and id to the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
						// connect that comment to to the campgrounds
					campground.comments.push(comment);
					campground.save();
					req.flash("success" , "Comment added successfully");
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	});	
	
	// redirect to the same campground show page
})
 	
//Edit Route for comment
router.get("/:comment_id/edit" , middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id , function(err , foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit" , {campground_id: req.params.id , comment: foundComment});
		}
	})
	
})

// Update route for comments
router.put("/:comment_id" , middleware.checkCommentOwnership , function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err, 			          updatedComment){
						if(err){
							res.redirect("back");
						} else {
							res.redirect("/campgrounds/" + req.params.id);
						}
	});
})

// Destroy the comment
router.delete("/:comment_id" , middleware.checkCommentOwnership, function(req, res){
	// find by id and remove
	Comment.findByIdAndRemove(req.params.comment_id , function(err){
		if(err){
			req.flash("error" , "You don't have permission!")
			res.redirect("back");
		} else {
			req.flash("success" , "You have deleted the comment successfully!")
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})


module.exports = router;
