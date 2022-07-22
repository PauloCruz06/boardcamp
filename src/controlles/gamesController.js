import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {  
    if(req.query.name) {
        const name = req.query.name + '%';
        const caseInsensitive = name.substring(0,1).toUpperCase() + name.substring(1).toLowerCase();

        try {
            const { rows: gamesList } = await connection.query(`
                SELECT * FROM games
                WHERE name LIKE $1
            `, [caseInsensitive]);

            res.status(200).send(gamesList);
        } catch(e) {
            res.sendStatus(500);
        }
    } else {
        try {
            const { rows: gamesList } = await connection.query(`
                SELECT * FROM games
            `);

            res.status(200).send(gamesList);
        } catch(e) {
            res.sendStatus(500);
        }
    }
}