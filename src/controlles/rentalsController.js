import connection from "../dbStrategy/postgres.js";

export async function getRentals(req, res) {
    const { offSet, limit, order, desc } = res.locals.queryObject;
    const templateQuery = `
        SELECT rentals.*, json_build_object(
            'id',customers.id,
            'name',customers.name
        ) AS customer, json_build_object(
            'id',games.id,
            'name',games.name,
            'categoryId',games."categoryId",
            'categoryName',categories.name
        ) AS game
        FROM rentals
        JOIN games ON
        rentals."gameId" = games.id
        JOIN customers ON
        rentals."customerId" = customers.id
        JOIN categories ON
        games."categoryId" = categories.id
    `

    if(req.query.customerId && req.query.gameId) return res.sendStatus(422);

    if(req.query.customerId) {
        const { customerId } = req.query;

        try {
            const { rows: rentalsList } = await connection.query(`
                ${templateQuery}
                WHERE rentals."customerId"=$1 
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `, [customerId]);

            if(rentalsList.length === 0) return res.sendStatus(404);
    
            res.status(200).send(rentalsList);
        } catch(e) {
            res.status(500).send(e);
        }
    }else if(req.query.gameId) {
        const { gameId } = req.query;

        try {
            const { rows: rentalsList } = await connection.query(`
                ${templateQuery}
                WHERE rentals."gameId"=$1 
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `, [gameId]);

            if(rentalsList.length === 0) return res.sendStatus(404);
    
            res.status(200).send(rentalsList);
        } catch(e) {
            res.status(500).send(e);
        }
    } else {
        try {
            const { rows: rentalsList } = await connection.query(`
                ${templateQuery}
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `);
    
            res.status(200).send(rentalsList);
        } catch(e) {
            res.status(500).send(e);
        }
    }
}