import connection from "../dbStrategy/postgres.js";
import { postGamesValidation } from "../schemaValidations/validations.js";

export async function getGames(req, res) { 
    const { offSet, limit, order, desc } = res.locals.queryObject;

    if(req.query.name) {
        const name = req.query.name + '%';
        const caseInsensitive = name.substring(0,1).toUpperCase() + name.substring(1).toLowerCase();

        try {
            const { rows: gamesList } = await connection.query(`
                SELECT * FROM games
                WHERE name LIKE $1
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `, [caseInsensitive]);
        
            res.status(200).send(gamesList);
        } catch(e) {
            res.sendStatus(500);
        }
    } else {
        try {
            const { rows: gamesList } = await connection.query(`
                SELECT * FROM games
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `,);

            res.status(200).send(gamesList);
        } catch(e) {
            res.sendStatus(500);
        }
    }
}

export async function postGames(req, res) {
    const body = req.body;
    const value = await postGamesValidation(body);

    if(value.error || value === 500) {
        res.status(400).send(value.error.details);
    } else {
        try {
            const { rows: gamesNameList } = await connection.query(`
                SELECT (name) FROM games
            `);

            if(gamesNameList.some((n) =>
                n.name.toLowerCase() === body.name.toLowerCase()
            )) return res.sendStatus(409);

            await connection.query(`
                INSERT INTO games (
                    name,
                    image,
                    "stockTotal",
                    "categoryId",
                    "pricePerDay"
                ) VALUES (
                    '${body.name}',
                    '${body.image}',
                    ${body.stockTotal},
                    ${body.categoryId},
                    ${body.pricePerDay}
                )
            `);

            res.sendStatus(201);
        } catch(e) {
            res.status(500).send(e);
        }
    }
}