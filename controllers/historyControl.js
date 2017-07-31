var connection = require('../models/connection')

exports.get_history = function(req, res){
   	var sql = "SELECT data FROM History ORDER BY what_time DESC";
	connection.query(sql, function(err, result){
		if (err) throw err;
		var resArr = result.map(function(a) {return a.data;});
		res.send(resArr)
    // console.log(resArr);
	});
};
