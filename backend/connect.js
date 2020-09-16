const sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
       
        user: 'pdmUser',
        password: '123@pdm',
        server: '192.168.57.2',
        database: 'PDM',
        "options": {
            "encrypt": true,
            "enableArithAbort": true
        }
    });

    return conn;
};

module.exports = connect;