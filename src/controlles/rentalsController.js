import connection from "../dbStrategy/postgres.js";
import { postRentalsValidation } from "../schemaValidations/validations.js";
import dayjs from "dayjs";

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

    if(req.query.customerId && req.query.gameId) {
        const { customerId, gameId } = req.query;

        try {
            const { rows: rentalsList } = await connection.query(`
                ${templateQuery}
                WHERE rentals."customerId"=$1 
                AND rentals."gameId"=$2
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `, [customerId, gameId]);

            if(rentalsList.length === 0) return res.sendStatus(404);
    
            return res.status(200).send(rentalsList);
        } catch(e) {
            return res.status(500).send(e);
        }
    }

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

export async function postRentals(req, res) {
    const body = req.body;
    const value = await postRentalsValidation(body);

    if(value.error || value === 500) {
        res.status(400).send(
            value.error ? value.error.details : ''
        );
    } else {
        try {
            const { rows: game } = await connection.query(`
                SELECT * FROM games
                WHERE id = ${body.gameId}
            `);
            const { rowCount: rentalsLength } = await connection.query(`
                SELECT ("returnDate") FROM rentals
                WHERE "returnDate" IS NULL
                AND "gameId" = ${body.gameId}
            `);

            if(rentalsLength >= game[0].stockTotal) return res.sendStatus(400);

            const rentDate = dayjs().format('YYYY-MM-DD');
            const originalPrice = game[0].pricePerDay * body.daysRented;

            await connection.query(`
                INSERT INTO rentals (
                    "customerId",
                    "gameId",
                    "rentDate",
                    "daysRented",
                    "returnDate",
                    "originalPrice",
                    "delayFee"
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                )
            `, [
                body.customerId,
                body.gameId,
                rentDate,
                body.daysRented,
                null,
                originalPrice,
                null
            ]);

            res.sendStatus(201);
        } catch(e) {
            res.status(500).send(e);
        }
    }
}