var express = require('express'),
	multer = require('multer'),
	router = express.Router(),
	trakController = require('../controllers/trak');

	var trakDetails={
	requestorId:'',
	wbs:'',
	stack: '',
	release: '',
	date:'',
	env: '',
	project: '',
	mediation:'',
	server: '',
	artifact: '',
	dir:'',
	prescript: '',
	postscript: '',
	instruction: '',
	filetoupload: ''
};


router.get('/', function(req, res,next) {
	res.render('index', {
	page : 'home',
	title: 'TOCP Trak',
	trakDetails:trakDetails,
	errors: []
	});
});


router.post('/createTrak',trakController.createTrak);
module.exports = router;
