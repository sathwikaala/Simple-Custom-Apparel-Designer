var connection = require('../models/connection')

exports.get_index = function(req, res){
   	var sql = "SELECT data FROM History ORDER BY what_time DESC";
	connection.query(sql, function(err, result){
		if (err) throw err;
    var resArr = result.map(function(a) {return a.data;});
    resArr = JSON.stringify(resArr);
    res.render('index',{pastdata: resArr});
	});
}

exports.post_index = function(req, res){
	var val = {data: req.body.item};
	var sql = "INSERT INTO `History` SET ?";
	connection.query(sql, val, function(err, result){
		if (err) throw err;
		res.send('Yippee! Design Saved Successfully');
	});
}
