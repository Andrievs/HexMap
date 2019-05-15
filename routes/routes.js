const express = require('express');
const router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Express Error handler
const errorHandler = (err, req, res) => {
    if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(403).send({ title: 'Server responded with an error', message: err.message });
    } else if (err.request) {
        // The request was made but no response was received
        res.status(503).send({ title: 'Unable to communicate with server', message: err.message });
    } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).send({ title: 'An unexpected error occurred', message: err.message });
    }
};

router.get('/api/layer/:name', async (req, res) => {
    if(req.session.key) {
        try {
            const layerName = req.params.name;
            let query = "SELECT Hexmap.Hexes.Xcoord, Hexmap.Hexes.Ycoord, Hexmap.Hexes.Title, Hexmap.Hexes.Abstract, Hexmap.Hexes.Info, Hexmap.Hexes.Hyperlink, Hexmap.Fills.Hexcode, Hexmap.Fills.Name AS 'FillName', Hexmap.Details.Path, Hexmap.Details.Color, Hexmap.Details.Fill, Hexmap.Details.Name AS 'DetailName', Hexmap.Details.Width FROM Hexmap.Hexes JOIN Hexmap.Fills ON Hexmap.Hexes.FillId = Hexmap.Fills.Id JOIN Hexmap.Details ON Hexmap.Hexes.DetailId = Hexmap.Details.Id JOIN Hexmap.Layers ON Hexmap.Hexes.LayerId = Hexmap.Layers.Id WHERE Hexmap.Layers.Name = ? ORDER BY Hexmap.Hexes.Id DESC";
            // execute query
            db.query(query, [layerName], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
            errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

router.get('/api/layers', async (req, res) => {
    if(req.session.key) {
        try {
            let query = "SELECT Hexmap.Layers.Name FROM Hexmap.Layers ORDER BY Hexmap.Layers.Id";

            // execute query
            db.query(query,  (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
            errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

router.get('/api/details', async (req, res) => {
    if(req.session.key) {
        try {
            let query = "SELECT Hexmap.Details.Name, Hexmap.Details.Path, Hexmap.Details.Color, Hexmap.Details.Width, Hexmap.Details.Fill FROM Hexmap.Details";

            // execute query
            db.query(query, (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
            errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

router.get('/api/detail/:name', async (req, res) => {
    if(req.session.key) {
        try {
            const detailName = req.params.name;
            let query = "SELECT Hexmap.Details.Name, Hexmap.Details.Path, Hexmap.Details.Color, Hexmap.Details.Width, Hexmap.Details.Fill FROM Hexmap.Details WHERE Hexmap.Details.Name = ?";

            // execute query
            db.query(query, [detailName], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
            errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});


router.get('/api/fills', async (req, res) => {
    if(req.session.key) {
        try {
            let query = "SELECT Hexmap.Fills.Name, Hexmap.Fills.Hexcode FROM Hexmap.Fills";

            // execute query
            db.query(query, (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
            errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

router.post('/api/newhex', async (req, res) => {
    if(req.session.key) {
        try {
            const { currentX, currentY, currentLayer, currentFill, currentDetail, currentTitle, currentAbstract, currentInfo, currentHyperlink } = req.body;
            let query = "INSERT INTO Hexmap.Hexes(Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (?, ?, (SELECT id from Hexmap.Layers WHERE Name=?), (SELECT id from Hexmap.Fills WHERE Name=?), (SELECT id from Hexmap.Details WHERE Name=?), ?, ?, ?, ?) ON DUPLICATE KEY UPDATE FillId = (SELECT id from Hexmap.Fills WHERE Name=?), DetailId = (SELECT id from Hexmap.Details WHERE Name=?), Title = ?, Abstract = ?, Info = ?, Hyperlink = ?;";

            db.query(query, [currentX, currentY, currentLayer, currentFill, currentDetail, currentTitle, currentAbstract, currentInfo, currentHyperlink, currentFill, currentDetail, currentTitle, currentAbstract, currentInfo, currentHyperlink ], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
        console.log(error);
        errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

router.post('/api/newfill', async (req, res) => {
    if(req.session.key) {
        try {
            const { name, Hexcode } = req.body;
            let query = "INSERT INTO Hexmap.Fills(Name, Hexcode) VALUES (?, ?) ON DUPLICATE KEY UPDATE Hexcode = ?;";

            // execute query
            db.query(query, [name, Hexcode, Hexcode ], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
        errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});


router.post('/api/newdetail', async (req, res) => {
    if(req.session.key) {
        try {
            const { name, FillColor, StrokeColor, StrokeWidth, Path } = req.body;
            let query = "INSERT INTO Hexmap.Details(Name, Path, Fill, Color, Width) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Path = ?, Fill = ?, Color = ?, Width = ?;";

            // execute query
            db.query(query, [name, Path, FillColor, StrokeColor, StrokeWidth, Path, FillColor, StrokeColor, StrokeWidth ], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
        errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

router.post('/api/login', (req, res) => {
    try {
        const { id_token } = req.body;
        async function verify() {
            const ticket = await googleClient.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userId = payload['sub'];
            const userEmail = payload['email'];
            const userPicture = payload['picture'];
            const userName = payload['name'];

            req.session.key = userEmail;
            req.session.sub = userId;
            //req.session.picture = userPicture;
            
            let query = "INSERT INTO Hexmap.Users(Sub, Email, Nick_name, GroupId) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Email = ?;";
            db.query(query, [userId, userEmail, userName, 4, userEmail ], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
            });
            query = "SELECT Hexmap.Users.GroupId, Hexmap.Users.Nick_name FROM Hexmap.Users WHERE Hexmap.Users.Sub = ?";
            db.query(query, [userId ], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                //req.session.groupId = result[0].GroupId;
                //req.session.Nick_name = result[0].Nick_name;
                res.setHeader('Content-Type', 'text/html');
                res.send('Successful login');
            });
        }
        verify().catch(console.error);
        
    } catch (error) {
      errorHandler(error, req, res);
    }
});

router.post('/api/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                console.log(err);
                throw(err);
            }
            res.redirect('/');
        });
    } catch (error) {
      errorHandler(error, req, res);
    }
});

router.get('/api/userdata', async (req, res) => {
    if(req.session.key) {
        try {
            let query = "SELECT Hexmap.Users.Email, Hexmap.Users.Nick_name AS 'Nickname', Hexmap.Groups.Name AS 'GroupName' FROM Hexmap.Users JOIN Hexmap.Groups ON Hexmap.Users.GroupId = Hexmap.Groups.Id WHERE Hexmap.Users.Sub = ?";
            // execute query
            db.query(query, [req.session.sub], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
            errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

router.post('/api/updateUser', async (req, res) => {
    if(req.session.key) {
        try {
            const { Nickname } = req.body;
            let query = "UPDATE Hexmap.Users SET Hexmap.Users.Nick_name = ? WHERE Hexmap.Users.Sub = ?";
            // execute query
            db.query(query, [Nickname, req.session.sub], (err, result) => {
                if (err) {
                    console.error('Database connection failed: ' + err.stack);
                    throw(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            });
        } catch (error) {
            errorHandler(error, req, res);
        }
    }
    else {
        //res.setHeader('Content-Type', 'application/json');
        res.status(401).send({ title: 'Unautherized', message: 'You have not logged in or do not have access to this data' });
    }
});

module.exports = router;