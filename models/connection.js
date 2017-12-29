var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12213152',
  password: 'CkW1dd5uRu',
  database: 'sql12213152'
});

connection.connect(function(err) {
  if (err) {
    console.log('The following error occured while trying to connect to MySQL ' + err.message);
    return;
  }
  console.log('Connection to MySQL established successfully');

});

module.exports = connection;
