const express = require('express');
const router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');

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
});

router.get('/api/layers', async (req, res) => {
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
});

router.get('/api/details', async (req, res) => {
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
});

router.get('/api/detail/:name', async (req, res) => {
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
});


router.get('/api/fills', async (req, res) => {
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
});

router.post('/api/newhex', async (req, res) => {
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
});

router.post('/api/newfill', async (req, res) => {
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
});


router.post('/api/newdetail', async (req, res) => {
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
});

router.post('/api/login', async (req, res) => {
    try {
        const { id_token } = req.body;

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
        }
        verify().catch(console.error);
        
        var decoded = jwt.decode(id_token);
        let query = "INSERT INTO Hexmap.Users(Sub, Email, Nick_name, GroupId) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Email = ?";
        db.query(query, [decoded.sub, decoded.email, '', 4, decoded.email ], (err, result) => {
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
});

module.exports = router;