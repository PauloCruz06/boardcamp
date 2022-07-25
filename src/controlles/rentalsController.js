import connection from "../dbStrategy/postgres.js";
import { postRentalsValidation } from "../schemaValidations/validations.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    const { offSet, limit, order, desc, status, startDate } = res.locals.queryObject;
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
        WHERE rentals.id >= 1
    `

    if(req.query.customerId && req.query.gameId) {
        const { customerId, gameId } = req.query;

        try {
            const { rows: rentalsList } = await connection.query(`
                ${templateQuery}
                AND rentals."customerId"=$1 
                AND rentals."gameId"=$2
                ${status}
                ${startDate}
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
                AND rentals."customerId"=$1
                ${status}
                ${startDate}
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
                AND rentals."gameId"=$1
                ${status}
                ${startDate}
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
                ${status}
                ${startDate}
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

export async function setRentals(req, res) {
    const { id } = req.params;

    if(id) {
        try {
            const { rows: rentals } = await connection.query(`
                SELECT * FROM rentals
                WHERE id = $1
            `, [id]);

            if(rentals.length === 0) return res.sendStatus(404);

            if(rentals.some((rental) =>
                rental.returnDate != null
            )) return res.sendStatus(400);

            const returnDate = dayjs();

            const daysDiff = returnDate.diff(
                rentals[0].rentDate,
                'days'
            ) - rentals[0].daysRented;

            const delayFee = daysDiff < 0 ? 0 : (
                rentals[0].originalPrice / rentals[0].daysRented
            ) * daysDiff;

            await connection.query(`
                UPDATE rentals SET
                "returnDate"=$1,
                "delayFee"=$2
                WHERE id = $3
            `, [
                returnDate.format('YYYY-MM-DD'),
                delayFee,
                id
            ]);

            res.sendStatus(200);
        } catch(e) {
            res.status(500).send(e);
        }
    } else {
        res.sendStatus(422);
    }
}

export async function deleteRentals(req, res) {
    const { id } = req.params;

    if(id) {
        try {
            const { rows: rental } = await connection.query(`
                SELECT * FROM rentals
                WHERE id = $1    
            `, [id]);

            if(rental.length === 0) return res.sendStatus(404);
            if(rental.some((n) =>
                n.returnDate === null
            )) return res.sendStatus(400);

            await connection.query(`
                DELETE FROM rentals
                WHERE id = $1
            `, [id]);

            res.sendStatus(200);
        } catch(e) {
            res.status(500).send(e);
        }
    } else {
        res.sendStatus(422);
    }
}