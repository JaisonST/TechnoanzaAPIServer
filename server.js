var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var cors = require('cors');

app.use(cors({origin: true}));

app.get('/', function (req, res) {       
      res.end("Technovenza API Server");
})

const mysql_con = require('./db');

require('./features/auth.js')(app, mysql_con);
require('./features/events.js')(app, mysql_con);
require('./features/users.js')(app, mysql_con);
require('./features/admin.js')(app, mysql_con);

var server = app.listen(3000, function () {    
   var port = server.address().port
   console.log("App listening at http://localhost:%s", port)
})

