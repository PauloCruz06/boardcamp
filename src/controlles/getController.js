import connection from "../dbStrategy/postgres.js";
import { getValidation } from "../schemaValidations/validations.js";

export async function getFunction(req, res) {
    const { route } = req.params;
    const value = await getValidation(route);

    if(value.error) {
        res.status(422).send(value.error.details);
    } else {
        try {
            const { rows: reRows } = await connection.query(`SELECT * FROM ${route}`);
            if(!reRows) res.sendStatus(404);
            res.status(200).send(reRows);
        } catch(e) {
            res.status(500).send(e);
        }
    }
}