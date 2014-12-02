var http = require('http'),
    server,
    port = 3000,
    express = require('express');

var app = express();
app.use(express.static('./public'));
app.set('view engine', 'html');
app.listen(port);

app.get('/', function(req, res) {
    res.sendFile('./public/index.html');
});