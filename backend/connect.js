const sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
       
        user: 'pdmUser',
        password: 'password',
        server: 'ip',
        database: 'PDM',
        "options": {
            "encrypt": true,
            "enableArithAbort": true
        }
    });

    return conn;
};

module.exports = connect;
