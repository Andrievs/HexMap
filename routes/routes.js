const express = require('express');
const router = express.Router();

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
        let query = "SELECT Hexmap.Hexes.Xcoord, Hexmap.Hexes.Ycoord, Hexmap.Hexes.Text, Hexmap.Hexes.Info, Hexmap.Fills.Hexcode, Hexmap.Fills.Name AS 'FillName', Hexmap.Tags.Path, Hexmap.Tags.Color, Hexmap.Tags.Fill, Hexmap.Tags.Name AS 'TagName', Hexmap.Tags.Width FROM Hexmap.Hexes JOIN Hexmap.Fills ON Hexmap.Hexes.FillId = Hexmap.Fills.Id JOIN Hexmap.Tags ON Hexmap.Hexes.TagId = Hexmap.Tags.Id JOIN Hexmap.Layers ON Hexmap.Hexes.LayerId = Hexmap.Layers.Id WHERE Hexmap.Layers.Name = ? ORDER BY Hexmap.Hexes.Id DESC";
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

router.get('/api/tags', async (req, res) => {
    try {
        let query = "SELECT Hexmap.Tags.Name, Hexmap.Tags.Path, Hexmap.Tags.Color, Hexmap.Tags.Width, Hexmap.Tags.Fill FROM Hexmap.Tags";

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

router.get('/api/tag/:name', async (req, res) => {
    try {
        const tagName = req.params.name;
        let query = "SELECT Hexmap.Tags.Name, Hexmap.Tags.Path, Hexmap.Tags.Color, Hexmap.Tags.Width, Hexmap.Tags.Fill FROM Hexmap.Tags WHERE Hexmap.Tags.Name = ?";

        // execute query
        db.query(query, [tagName], (err, result) => {
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
        const { currentX, currentY, currentlayer, currentFill, currentTag, currentText, currentInfo } = req.body;
        let query = "INSERT INTO Hexmap.Hexes(Xcoord, Ycoord, LayerId, FillId, TagId, Text, Info) VALUES (?, ?, (SELECT id from Hexmap.Layers WHERE Name=?), (SELECT id from Hexmap.Fills WHERE Name=?), (SELECT id from Hexmap.Tags WHERE Name=?), ?, ?) ON DUPLICATE KEY UPDATE FillId = (SELECT id from Hexmap.Fills WHERE Name=?), TagId = (SELECT id from Hexmap.Tags WHERE Name=?), Text = ?, Info = ?;";

        // execute query
        db.query(query, [currentX, currentY, currentlayer, currentFill, currentTag, currentText, currentInfo, currentFill, currentTag, currentText, currentInfo ], (err, result) => {
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

module.exports = router;