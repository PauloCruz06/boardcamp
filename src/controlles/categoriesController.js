import connection from "../dbStrategy/postgres.js";
import { postCategoriesValidation } from "../schemaValidations/validations.js";

export async function getCategories(_, res) {
    try {
        const { rows: reRows } = await connection.query(`SELECT * FROM categories`);
        if(!reRows) res.sendStatus(404);
        res.status(200).send(reRows);
    } catch(e) {
        res.status(500).send(e);
    }
}

export async function postCategories(req, res) {
    const body = req.body;
    const value = await postCategoriesValidation(body);

    if(value.error) {
        res.status(400).send(value.error.details);
    } else {
        try {
            const { rows: reRows } = await connection.query(`SELECT * FROM categories`)
            
            if(reRows.some(
                (n) => n.name.toLowerCase() === body.name.toLowerCase()
            )) return res.sendStatus(409);

            await connection.query(
                `INSERT INTO categories (name)
                VALUES ('${body.name}')`
            );
            res.sendStatus(201);
        } catch(e) {
            res.status(500).send(e);
        }
    }
}