const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use = express.json

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

app.get("/players/", async (request, response) => {
  const allPlayers = `SELECT *
        FROM cricket_team
        ORDER BY player_id;`;

  const players = await db.all(allPlayers);
  response.send(players);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addPlayer = `INSERT INTO cricket_team
    (player_id, player_name, jersey_number, role)
    VALUES('${player_id}',${player_name},${jersey_number},'${role})';`;

  const result = await db.run(addPlayer);
  response.send("Player Added to Team");
});


app.get("/players/:playerId/", async(request, response) => {
    const {playerId} = request.params
    const player = `
    SELECT * FROM 
    cricket_team
    WHERE 
    playerId = ${playerId};`;
    const play = await db.get(player);
    response.send(play);

});

app.put("/players/:playerId/", async(request, response) => {
    const {playerId} = request.params;
    const playerDetails = request.body;
    const{
        player_id,
        player_name,
        jersey_number,
        role,
    } = playerDetails;
    const updatePlayer = `
    UPDATE cricket_team 
    SET 
  "player_name": '${player_name}',
  "jersey_number": ${jersey_number},
  "role": '${role}'
  WHERE 
  player_id = ${playerId};`;

  await db.run(updatePlayer);
  response.send("Player Details Updated");

});4

app.delete("/players/:playerId/", async (request, response) => {
    const {playerId} = request.params;
    const deletePlayer = 
    `DELETE FROM cricket_team
    WHERE  player_id = ${playerId};`;
    await db.run(deletePlayer);
    response.send("Player Removed")
})

