require('dotenv').config(); 
var express = require('express'),
	app = express(),
	bodyparser = require("body-parser"),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	localStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require('./seeds')

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


mongoose.connect(process.env.DATABASEURL , { useNewUrlParser: true, 
	useCreateIndex: true});

/* mongoose.connect('mongodb+srv://vineet:Tyagi135@cluster0.eeogz.mongodb.net/test?retryWrites=true&w=majority' , { useNewUrlParser: true, 
	useCreateIndex: true}).then(() => {
	console.log('connected to DB');
}).catch(err => {
	console.log('Error:' , err.message);
}); */


app.use(bodyparser.urlencoded({extended:true})); 
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
	//seedDB();

//Passport configruation

app.use(require("express-session")({
	secret: "Once again we are doing it" ,
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.set('useUnifiedTopology', true);

var Campground = require("./models/campground");


// Tell express to use the body parser


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});