module.exports = {
    createDB: function () {
        db.connect(function(err) {
            if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
            }
            console.log('Connected to database.');
        });
        
        var sql = 'CREATE DATABASE IF NOT EXISTS Hexmap';
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log('Database  created');
        });
    },
    fillsDB: function () {
        db.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
            console.log('Connected to database.');
          });
          
          sql = 'CREATE TABLE IF NOT EXISTS Layers (Id INT AUTO_INCREMENT PRIMARY KEY, Name VARCHAR(255) UNIQUE)';
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Layers table created");
          });
          
          sql = "INSERT IGNORE INTO Layers (Name) VALUES ('Main')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Layers table added Main layer");
          });

          sql = "INSERT IGNORE INTO Layers (Name) VALUES ('Feywild')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Layers table added Main layer");
          });

          sql = "INSERT IGNORE INTO Layers (Name) VALUES ('Shadowfel')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Layers table added Main layer");
          });
          
          sql = 'CREATE TABLE IF NOT EXISTS Fills (Id INT AUTO_INCREMENT PRIMARY KEY, Name VARCHAR(255) UNIQUE, Hexcode VARCHAR(255))';
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table created");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Empty', 'White')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Sand', '#eedd82')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Coast', '#7fffd4')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Sea', '#4169e1')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Tundra', '#8fbc8f')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Wetland', '#2e8b57')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Swamp', '#6e8b3d')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Forest', '#228b22')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Woodland', '#9acd32')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Hill', '#daa520')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Plain', '#7cfc00')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Mountain', '#708090')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Pink', '#C08090')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = "INSERT IGNORE INTO Fills (Name, Hexcode) VALUES ('Lava', '#d40000')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Fills table added Empty fill");
          });
          
          sql = 'CREATE TABLE IF NOT EXISTS Details (Id INT AUTO_INCREMENT PRIMARY KEY, Name VARCHAR(255) UNIQUE, Path LONGTEXT, Fill VARCHAR(255), Color VARCHAR(255), Width INT)';
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table created");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Empty', '', 'none', 'White', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Low_grass', 'm 2,-47 c -3,2 -2,12 1,5 2,-2 2,-5 -1,-5 z m -7,3 c -7,1 6,10 1,2 l 0,-1 z m -50,15 c -2,5 6,8 8,10 3,-4 -5,-7 -8,-10 z m 20,2 c -3,1 -4,9 -1,6 2,-2 5,-6 1,-6 z m 82,0 c -4,3 -3,13 1,6 1,-2 2,-5 -1,-6 z m -91,1 c -1,3 1,6 3,5 1,-2 1,-5 -2,-5 z m 53,-5 c -3,0 -3,3 -1,5 3,7 4,-3 1,-5 z m 31,7 c -8,1 5,11 1,3 0,-1 -1,-2 -1,-3 z m -24,-4 -1,1 0,1 c -5,8 8,-1 1,-2 z M 62,-1 C 59,2 51,5 54,9 56,7 64,4 62,-1 z M -40,-5 c -3,1 -2,4 -1,6 4,7 5,-3 1,-6 z m 82,6 c -4,0 -1,4 1,6 3,3 2,-5 -1,-6 z M -10,0 c -4,3 7,14 4,5 -1,-2 -2,-4 -4,-5 z m 60,2 c -3,0 -3,3 -2,5 2,1 4,-2 3,-5 z M 0,2 C -4,4 -3,14 0,7 1,6 4,2 0,2 z m -33,-4 c 0,1 -1,2 -1,3 -4,8 9,-2 1,-3 z m -1,27 c -2,5 6,8 8,11 3,-5 -5,-8 -8,-11 z m 20,2 c -3,1 -4,7 -2,5 3,-1 3,-2 2,-5 z m -8,1 c 0,0 0,0 -1,1 -1,2 2,7 3,5 0,-2 1,-6 -1,-6 0,0 0,0 -1,0 z M 23,18 c -2,1 -3,3 -4,5 -3,9 8,-2 4,-5 z m -10,2 c -4,0 -1,4 0,5 3,7 4,-3 0,-5 z m 24,17 c -3,3 -11,6 -8,11 2,-3 10,-6 8,-11 z m 20,-3 c -2,1 -6,10 -2,7 1,-2 8,-6 2,-7 z m -40,5 c -1,3 -1,4 2,5 2,2 1,-4 -2,-5 z m 35,-3 c -6,0 0,12 0,3 1,-1 0,-2 0,-3 z m -28,4 c -2,0 -1,4 -1,6 1,2 4,-3 3,-5 -1,-1 -1,-1 -2,-1 z M -58,12 c -6,1 1,5 2,7 4,3 0,-6 -2,-7 z m 5,2 c 0,1 -1,2 0,3 0,9 6,-3 0,-3 z', '#669966', '#669966', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('High_grass', 'M -18,-13 C -13,-6 -13,4 -8,12 C -11,14 -15,21 -18,26 C -20,17 -22,4 -28,0 C -26,-4 -21,-9 -18,-13 z M 5,-31 C 4,-19 3,-6 6,5 C 1,10 -0,14 -3,19 C -2,6 -3,-4 -4,-16 C -4,-21 2,-26 5,-31 z M 26,-1 C 16,6 19,5 9,18 C 12,3 21,-8 34,-17 C 32,-12 29,-6 27,-1 z', '#225544', '#225544', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Swamp', 'm 2,-47 c -3,2 -2,12 1,5 2,-2 2,-5 -1,-5 z m -7,3 c -7,1 6,10 1,2 l 0,-1 z m 8,8 c -7,1 -15,3 -22,3 0,5 6,1 9,3 7,-2 15,-4 23,0 6,2 13,-1 19,-2 -2,-6 -12,3 -17,-1 -4,-1 -8,-2 -12,-3 z m -58,7 c -2,5 6,8 8,10 3,-4 -5,-7 -8,-10 z m 20,2 c -3,1 -4,9 -1,6 2,-2 5,-6 1,-6 z m -8,1 c 0,0 0,0 -1,0 -1,3 1,6 3,5 1,-2 1,-5 -2,-5 z m -21,9 c -1,6 10,5 15,4 7,-2 14,-1 21,1 2,0 12,2 10,-2 -7,0 -15,-3 -23,-3 -6,0 -13,4 -20,1 -1,-1 -2,-1 -3,-1 z M 47,-27 c -4,3 -3,13 1,6 1,-2 2,-5 -1,-6 z m -7,3 c -8,1 5,11 1,3 0,-1 -1,-2 -1,-3 z m 7,9 c -7,1 -14,2 -21,2 -1,5 6,1 8,3 8,-2 16,-3 23,0 7,2 13,-1 19,-2 -2,-6 -12,3 -17,-1 -4,-1 -8,-2 -12,-2 z m -63,11 c -4,3 7,14 4,5 -1,-2 -2,-4 -4,-5 z m 10,2 c -4,2 -3,12 0,5 1,-1 4,-5 0,-5 z M -50,8 c -1,0 -1,0 -2,0 -4,2 -14,-1 -15,4 1,0 1,0 2,1 8,-1 17,-3 25,1 7,1 13,-4 19,0 6,-1 13,-4 20,0 5,-4 -6,-4 -8,-6 -8,3 -15,3 -23,2 -6,4 -12,-2 -18,-2 z m 80,1 c -2,5 6,8 8,11 3,-5 -5,-8 -8,-11 z m 20,2 c -3,1 -4,7 -2,5 3,-1 3,-2 2,-5 z m -7,1 c -1,0 -1,0 -2,1 -1,2 2,7 3,5 0,-2 1,-6 -1,-6 z m -22,9 c -1,6 10,5 15,5 6,-3 14,-2 21,0 2,0 12,2 10,-2 -7,0 -15,-3 -23,-3 -6,0 -13,5 -20,1 -1,0 -2,-1 -3,-1 z m -36,11 c -2,1 -6,10 -2,7 1,-2 8,-6 2,-7 z m -5,2 c -6,0 0,12 0,3 1,-1 0,-2 0,-3 z m 14,8 c -7,1 -15,4 -22,0 -6,0 -14,0 -17,3 4,4 11,-3 17,1 7,3 15,0 23,-1 7,0 13,5 21,1 6,-1 12,2 19,2 C 38,43 27,44 24,44 16,41 9,47 2,43 -1,42 -3,42 -6,42 z', '#445500', '#445500', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Tree', 'M46.021519005298615,-20.910303569519044 C45.818394005298615,-22.793116569519043 45.271519005298615,-24.574366569519043 44.462925005298615,-26.203272569519044 C42.435581005298616,-34.20717956951904 34.955113005298614,-38.64858556951904 27.306675005298615,-37.48061656951904 C25.052769005298615,-40.379053569519044 22.001988005298614,-42.660303569519044 18.166050005298615,-43.99624156951904 C12.107457005298613,-46.10561656951904 5.626988005298614,-43.94936656951904 1.6621440052986145,-39.38686656951904 C-9.513636994701386,-48.504053569519044 -26.744105994701385,-43.98842956951904 -31.513636994701386,-29.297022569519044 C-31.744105994701385,-28.578272569519044 -32.14254299470139,-27.906397569519044 -32.345668994701384,-27.179835569519042 C-32.353480994701385,-27.152491569519043 -32.36129299470139,-27.129053569519044 -32.369105994701385,-27.101710569519042 C-37.216761994701386,-25.843897569519044 -42.025355994701385,-21.875147569519044 -42.419886994701386,-16.937647569519044 C-42.447230994701385,-16.629053569519044 -42.45504299470139,-16.328272569519044 -42.451136994701386,-16.031397569519044 C-44.982386994701386,-9.496241569519043 -44.650355994701385,-3.1173355695190423 -40.724574994701385,3.0428204304809583 C-36.630824994701385,9.468602430480956 -30.720668994701384,12.620946430480956 -23.376918994701384,12.699070430480958 C-16.353480994701385,22.202977430480956 -9.912074994701385,32.124852430480956 -4.060511994701386,42.406102430480956 C-4.326136994701386,44.01157043048096 -4.876918994701384,45.76157043048096 -5.6347309947013855,47.88657043048096 C-7.349574994701385,52.67953943048096 -5.7441059947013855,55.089696430480956 -0.6464499947013849,55.245946430480956 C0.12308100529861571,55.26938343048096 0.8965190052986146,55.28500843048096 1.6621440052986145,55.22250843048096 C4.6152690052986145,54.964696430480956 6.169957005298613,52.75766443048096 5.353550005298615,49.91391443048096 C4.806675005298615,48.00766443048096 3.8496440052986145,46.171727430480956 3.595738005298614,44.234227430480956 C3.5840190052986145,44.140477430480956 3.595738005298614,43.687352430480956 3.6465190052986145,42.964696430480956 C6.525425005298615,37.50766443048096 12.951207005298613,34.296727430480956 16.564488005298614,29.339696430480956 C18.908238005298614,26.120946430480956 20.595738005298614,22.54282043048096 21.572300005298615,18.777196430480956 C23.853550005298615,18.628758430480957 26.154331005298616,17.925633430480957 28.478550005298615,16.452977430480956 C31.986363005298614,14.230320430480958 34.017613005298614,10.507664430480958 34.525425005298615,6.558446430480956 C34.98245700529861,5.605320430480958 35.560581005298616,5.160008430480957 36.775425005298615,4.972508430480957 C43.736363005298614,3.8982894304809577 48.01370700529861,-0.5782725695190436 48.916050005298615,-7.527491569519043 C49.529331005298616,-12.254053569519044 48.16995700529861,-16.468897569519044 46.025425005298615,-20.554835569519042 C46.033238005298614,-20.668116569519043 46.037144005298615,-20.785303569519044 46.021519005298615,-20.910303569519044 zM-16.857386994701386,14.687352430480956 C-14.962855994701385,16.456883430480957 -13.099574994701385,18.26157043048096 -11.498011994701386,20.273289430480958 C-10.580042994701387,21.421727430480956 -9.833949994701385,23.73032043048096 -9.119105994701385,26.07407043048096 C-11.607386994701386,22.218602430480956 -14.193324994701385,18.425633430480957 -16.857386994701386,14.687352430480956 zM-0.09957499470138498,30.554539430480958 C-1.5448869947013861,30.781102430480956 -4.9003559947013855,23.437352430480956 -6.064418994701384,21.062352430480956 C-2.427699994701385,20.827977430480956 1.2402690052986147,20.597508430480957 5.119175005298615,20.347508430480957 C5.029331005298616,20.601414430480958 4.978550005298615,20.902196430480956 4.834019005298615,21.152196430480956 C3.5918310052986158,23.288914430480958 2.830113005298614,30.093602430480956 -0.09957499470138498,30.554539430480958 zM11.212925005298615,29.277196430480956 C9.126988005298614,31.515477430480956 6.744175005298615,33.41782043048096 4.580113005298614,35.468602430480956 C5.505894005298615,29.972508430480957 7.212925005298615,22.925633430480957 10.232457005298613,17.48032043048096 C10.580113005298614,16.851414430480958 10.986363005298614,16.503758430480957 11.470738005298614,16.347508430480957 C13.416050005298615,17.300633430480957 15.376988005298614,18.046727430480956 17.349644005298615,18.456883430480957 C16.209019005298615,22.429539430480958 14.154331005298616,26.113133430480957 11.212925005298615,29.277196430480956 zM11.212925005298615,29.277196430480956 ', '#006000', '#000000', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Hill', 'M -42,11 C -38,5 -34,0 -28,-3 C -20,-6 -11,-5 -5,-0 C -2,2 1,6 3,9 C 4,12 2,13 0,14 C -3,9 -7,5 -13,2 C -21,-1 -30,0 -36,6 C -38,9 -40,11 -43,14 C -43,15 -44,14 -44,13 C -43,12 -43,12 -42,11 z M -5,-0 C 0,-6 7,-12 15,-16 C 21,-18 28,-17 33,-14 C 39,-11 41,-5 43,-0 C 42,2 41,5 39,2 C 37,-2 33,-8 27,-10 C 20,-13 12,-12 6,-7 C 2,-4 -1,-1 -4,1 C -7,4 -6,0 -5,-0 z', '#b8860b', '#b8860b', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Mountain', 'M 30,-30 c -5,3 -19,18 -28,28 -4,-5 -7,-10 -9,-16 -7,4 -40,43 -43,53 2,2 4,2 6,2 7,-8 26,-40 34,-46 10,14 26,31 35,49 2,-1 4,-3 5,-3 C 30,33 16,18 3,0 11,-8 21,-19 29,-25 39,-9 49,-3 58,13 60,12 60,11 61,10 61,5 42,-7 29,-30 z', '#666666', '#666666', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Jungle_tree', 'm 8,-20 c -6,-12 -36,-5 -44,7 9,-6 35,-12 37,-5 -18,0 -29,6 -33,24 C -22,-13 -8,-14 2,-13 -8,6 -20,13 -16,50 c 4,3 9,-5 5,-8 -1,-7 -1,-13 0,-20 C -10,10 1,-7 9,-12 27,-8 36,0 34,15 44,4 30,-12 14,-15 28,-16 41,-7 45,1 47,-8 29,-19 17,-20 c 11,-7 25,-3 30,3 -5,-14 -36,-11 -39,-3 z', '#228b22', '#228b22', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Volcano', 'm 31,-61 c -2,0 -4,1 -6,2 -6,-2 -12,7 -7,13 -2,-5 -1,-14 7,-12 5,-3 12,-5 14,3 0,-4 -3,-7 -7,-6 z m 8,7 c -3,0 -6,2 -8,6 7,-8 17,-4 15,4 5,0 9,5 5,14 4,-6 2,-15 -4,-16 0,-4 -3,-8 -8,-8 z m -5,8 c -3,0 -7,1 -11,3 -8,-5 -27,5 -20,15 C 2,-40 13,-46 23,-41 c 7,-4 22,-9 20,6 3,-9 -2,-12 -8,-12 z m -2,11 c -5,0 -9,2 -10,6 7,-8 19,-6 23,2 14,1 14,11 0,14 18,1 16,-14 2,-15 -2,-4 -9,-7 -15,-7 z m -17,7 C 7,-28 -1,-23 1,-15 3,-27 15,-30 23,-23 c 8,-2 16,3 15,16 3,-10 -3,-20 -14,-18 -2,-2 -6,-3 -9,-3 z m 3,13 C 9,-15 -1,-11 -9,-7 -12,3 -16,17 -30,13 c -8,-2 -7,7 -12,11 -8,6 -10,17 -18,24 4,0 7,-1 10,0 -1,-4 8,-20 14,-27 2,-7 10,-4 15,-4 8,-6 13,-14 18,-21 8,2 16,1 24,2 3,1 6,0 9,-1 -1,8 12,22 16,25 4,6 1,16 6,21 10,-2 5,1 15,0 C 65,35 59,36 56,30 48,20 35,6 34,-7 c 0,0 0,0 0,0 -3e-4,0 3e-4,0 0,0 0,-1 0,-2 0,-3 -4,-3 -10,-5 -16,-5 z m 0,2 c 4,0 8,1 11,3 5,5 0,5 -6,6 C 19,-4 7,-6 -1,-6 -3,-8 8,-13 18,-13 z', '#000000', '#000000', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('House', 'M 0,4 C -6,7 -7,22 -6,26 -3,26 4,25 7,26 8,24 6,5 0,4 z M 7,-7 C 10,3 19,14 15,29 8,28 -5,30 -14,29 -13,9 -9,1 7,-7 z M 6,-38 c 7,12 34,23 48,27 -1,6 0,12 1,14 -9,-5 -11,-7 -18,-9 -3,14 0,24 2,33 -9,0 -7,3 -14,3 1,-13 4,-32 5,-39 -9,-4 -17,-11 -26,-17 -8,7 -20,13 -29,20 1,12 0,21 2,33 -7,1 -8,2 -14,4 0,-9 2,-22 1,-31 -7,4 -14,6 -21,8 2,-11 45,-22 64,-46 z', '#000000', '#000000', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Pyramid', 'm -1,-43 c -22,23 -46,49 -65,70 45,0 90,0 129,0 C 41,2 18,-22 -1,-43 z m 0,6 20,22 -22,0 0,-5 5,0 0,-3 -11,0 0,3 3,0 0,5 -4,0 0,3 23,0 0,4 -11,0 0,3 18,0 0,-3 -4,0 0,-4 5,0 32,35 -109,0 z m 32,40 -57,0 0,3 9,0 0,3 -17,0 0,3 29,0 0,-3 -9,0 0,-3 45,0 z', '#000000', '#000000', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = "INSERT IGNORE INTO Details (Name, Path, Fill, Color, Width) VALUES ('Tower', 'm -5.9,-44.7 c -1.7,11.1 -12.4,22.6 -19.9,28.7 l 4.7,2.7 c 1.6,-1.4 4.2,-4.1 5.5,-5.4 12.1,23.9 2.3,48.8 -6.1,63.5 3.8,0.1 5.3,0.6 6.6,1.2 13.9,-31.1 7.2,-58.7 3.4,-66.3 l -2.5,0 c 3.7,-2.6 10.6,-17.9 11.7,-18.1 5.1,7.8 8.3,12.4 14.4,18.5 l -2.9,0.2 C 6,3.4 8.5,30.4 16,46 18.4,45.6 20.7,45.5 22.7,45.8 14.2,24 6.8,1.1 13.4,-18.1 c 0.4,0.5 2.8,1.9 3.2,2.5 4,-2.3 4.5,-1.6 5.9,-2 -5.9,-5.5 -19.6,-16.1 -23,-26.8 0,-0.7 -4.6,-0.2 -5.4,-0.2 z m 0.4,24.8 -4.7,0.1 c 0.7,1.1 2.1,4.3 2.5,5.6 l 3,0 c -0.4,-1.2 -0.4,-4.5 -0.9,-5.7 z m 5.4,-0.1 -3.8,0.3 c 0.8,1.7 0.6,3.8 0.8,5.5 l 3.9,-0.1 c -0.2,-1.7 -0.5,-4.3 -0.9,-5.8 z m 1.8,-0.1 c 0.3,1.8 0.3,3.6 0.5,5.9 l 3.9,-0.2 c 0.1,-1.8 0.3,-3.4 0.5,-5.2 z M 1.4,-5.8 c -0.1,1.5 0.8,5.7 0.5,7 l 2.9,0 c 0.2,-1.4 0.3,-5.8 0.6,-7 z m -6.4,5 c 0.1,1.6 0.1,5.1 0,6.6 l 4.3,0 c 0,-1.5 -0.1,-5.2 0,-6.6 z M 0.9,9.9 C 1.1,11.2 1.5,14.8 1.5,16.2 L 5.5,16 C 5.4,14.6 5,11.1 5.1,9.7 z M -4.6,14.5 c 0.1,0.8 -0.3,4.5 -0.4,5.2 l 4.1,0.2 c 0.1,-0.8 0.4,-4.5 0.5,-5.3 z m 5.7,9.9 c 0.2,1.4 0.7,5.1 0.8,6.4 l 6.2,0.2 C 7.9,30.4 6,27.3 5.6,24.6 z m -8.6,7.8 c 3,-0.7 3.4,-0.2 6.2,-0.4 0,-0.5 0.3,-5.6 0.3,-6.1 -2.4,-0.3 -2.5,0.2 -5.1,-0.2 0.1,3 -0.9,5 -1.4,6.7 z m 6.6,3.9 C -3.5,36.8 -6.2,44.1 -6.5,46.3 -3.4,45.8 4.7,45.9 6.2,45.7 6.2,40.8 3.2,34.9 -1,36.1 z', '#000000', '#000000', 1)"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Details table added Empty detail");
          });
          
          sql = 'CREATE TABLE IF NOT EXISTS Hexes (Id INT AUTO_INCREMENT PRIMARY KEY, Xcoord INT, Ycoord INT, LayerId INT, FillId INT, DetailId INT, Title VARCHAR(255), Abstract LONGTEXT, Info LONGTEXT, Hyperlink LONGTEXT, FOREIGN KEY (LayerId) REFERENCES Layers(Id), FOREIGN KEY (FillId) REFERENCES Fills(Id), FOREIGN KEY (DetailId) REFERENCES Details(Id), CONSTRAINT SpecificHex UNIQUE (Xcoord, Ycoord, LayerId))';
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hexes table created");
          });
          
          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (0, 0, 1, 2, 10, 'Home', 'A small town by the beach that holds the only port that', 'Long text', 'Hyperlink')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (1, 0, 1, 3, 1, '', '', '', '')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (0, 1, 1, 3, 1, '', '', '', '')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (-1, 0, 1, 3, 1, '', '', '', '')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (1, -1, 1, 2, 1, '', '', '', '')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (-1, -1, 1, 2, 1, '', '', '', '')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (0, -1, 1, 9, 5, '', '', '', '')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = "INSERT IGNORE INTO Hexes (Xcoord, Ycoord, LayerId, FillId, DetailId, Title, Abstract, Info, Hyperlink) VALUES (0, 0, 2, 1, 1, 'FeyHome', '', '', '')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Hex table added hex");
          });

          sql = 'CREATE TABLE IF NOT EXISTS Groups (Id INT AUTO_INCREMENT PRIMARY KEY, Name VARCHAR(255) UNIQUE)';
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Group table created");
          });

          sql = "INSERT IGNORE INTO Groups (Name) VALUES ('Admin')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Groups table added Admin group");
          });
          
          sql = "INSERT IGNORE INTO Groups (Name) VALUES ('Moderator')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Groups table added Moderator group");
          });

          sql = "INSERT IGNORE INTO Groups (Name) VALUES ('Game Master')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Groups table added Game Master group");
          });
          
          sql = "INSERT IGNORE INTO Groups (Name) VALUES ('Player')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Groups table added Player group");
          });

          sql = "INSERT IGNORE INTO Groups (Name) VALUES ('Unknwon')"
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Groups table added Unknwon group");
          });

          sql = 'CREATE TABLE IF NOT EXISTS Users (Id INT AUTO_INCREMENT PRIMARY KEY, Sub VARCHAR(255) UNIQUE, Email VARCHAR(255), Nick_name VARCHAR(255), GroupId INT, FOREIGN KEY (GroupId) REFERENCES Groups(Id))';
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Users table created");
          });

          sql = 'CREATE TABLE IF NOT EXISTS Comments (Id INT AUTO_INCREMENT PRIMARY KEY, Text LONGTEXT, Hyperlink LONGTEXT, DateTime DATETIME, HexId INT, UserId INT, GroupId INT, FOREIGN KEY (HexId) REFERENCES Hexes(Id), FOREIGN KEY (UserId) REFERENCES Users(Id), FOREIGN KEY (GroupId) REFERENCES Groups(Id))';
          db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Comments table created");
          });
      }
}