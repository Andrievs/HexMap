require('dotenv').config();
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisPort = process.env.REIDSPORT || 6379;
const client  = redis.createClient(redisPort, process.env.REDIS_HOST);
const mysql = require('mysql');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const setup = require('./routes/manageDB');
const router = require('./routes/routes');

var db = mysql.createConnection({
	host     : process.env.RDS_HOSTNAME,
	user     : process.env.RDS_USERNAME,
	password : process.env.RDS_PASSWORD,
	port     : process.env.RDS_PORT
});
global.db = db;
  
setup.createDB();

db = mysql.createConnection({
	host     : process.env.RDS_HOSTNAME,
	user     : process.env.RDS_USERNAME,
	password : process.env.RDS_PASSWORD,
	port     : process.env.RDS_PORT,
  database: process.env.DATABASE
});
global.db = db;

app.use(session({
  secret: process.env.SESSION_SECRET,
  // create new redis store.
  store: new redisStore({ host: process.env.REDIS_HOST, port: redisPort, client: client, ttl : 260}),
  saveUninitialized: true,
  resave: true
}));

setup.fillsDB();
app.set('port', port); // set express to use this port
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
