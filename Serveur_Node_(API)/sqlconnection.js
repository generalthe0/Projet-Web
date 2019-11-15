var mysql = require('mysql');

// Instantiate MySQL connection

exports.sqlconnection = (function() {
    
    var connection = mysql.createConnection({
    
        //Properties of the MySQL connection
    
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'liaison',
    })

    return connection;
})();