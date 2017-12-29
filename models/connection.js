var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'freshprints_db'
});

connection.connect(function(err) {
  if (err) {
    console.log('The following error occured while trying to connect to MySQL ' + err.message);
    return;
  }
  console.log('Connection to MySQL established successfully');

});

module.exports = connection;
