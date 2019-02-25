require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const setup = require('./routes/manageDB');
const router = require('./routes/routes');

var db = mysql.createConnection({
	host     : process.env.HOST,
	user     : process.env.USER,
	password : process.env.PASSWORD,
	port     : process.env.DATABASEPORT
});
global.db = db;
  
setup.createDB();

db = mysql.createConnection({
	host     : process.env.HOST,
	user     : process.env.USER,
	password : process.env.PASSWORD,
	port     : process.env.DATABASEPORT,
  database: process.env.DATABASE
});
global.db = db;

setup.fillsDB();
app.set('port', process.env.port || port); // set express to use this port
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
// Set public folder as root
app.use(express.static('./public'));
// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
app.use(router);
// Redirect all traffic to index.html
app.use((req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

var server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    socket.on('getHexes', function(data){
        io.sockets.emit('allHexes', data);
    });

    socket.on('newHex', function(data){
        socket.broadcast.emit('newHex', data);
    });

});
