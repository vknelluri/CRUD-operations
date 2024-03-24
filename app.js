const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const allPlayers = `SELECT *
        FROM cricket_team
        ORDER BY player_id;`;

  const player = await db.all(allPlayers);
  response.send(
    player.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

// app.post("/players/", async (request, response) => {
//   const playerDetails = request.body;
//   const { playerName, jerseyNumber, role } = playerDetails;
//   const addPlayer = `INSERT INTO cricket_team
//     (player_name, jersey_number, role)
//     VALUES('${playerName}',${jerseyNumber},'${role})';`;

//   const result = await db.run(addPlayer);
//   response.send("Player Added to Team");
// });

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayer = `INSERT INTO cricket_team
    (player_name, jersey_number, role)
    VALUES('${playerName}',${jerseyNumber},'${role}');`;

  const result = await db.run(addPlayer);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const player = `
    SELECT * FROM 
    cricket_team
    WHERE 
    player_id = ${playerId};`;
  const players = await db.get(player);
  response.send(convertDbObjectToResponseObject(players));
});

// app.put("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const playerDetails = request.body;
//   const { playerName, jerseyNumber, role } = playerDetails;
//   const updatePlayer = `
//     UPDATE cricket_team
//     SET
//   "player_name": '${playerName}',
//   "jersey_number": '${jerseyNumber}',
//   "role": '${role}'
//   WHERE
//   player_id = ${playerId};`;

//   await db.run(updatePlayer);
//   response.send("Player Details Updated");
// });

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayer = `
    UPDATE cricket_team 
    SET 
  player_name = '${playerName}',
  jersey_number = ${jerseyNumber},
  role = '${role}'
  WHERE 
  player_id = ${playerId};`;

  await db.run(updatePlayer);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `DELETE FROM cricket_team
    WHERE  player_id = ${playerId};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
