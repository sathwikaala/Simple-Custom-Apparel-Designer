var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var indexController = require('../controllers/indexControl.js');
// var historyController = require('../controllers/historyControl.js');

var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true});

router.get('/', indexController.get_index);
router.post('/', urlencodedParser, indexController.post_index);
// router.get('/history', historyController.get_history);

module.exports = router;
