import connection from "../dbStrategy/postgres.js";
import { postCustomersValidation } from "../schemaValidations/validations.js";

export async function getCustomers(req, res) {
    const { offSet, limit, order, desc } = res.locals.queryObject;

    if(req.query.cpf) {
        const cpf =  req.query.cpf + '%';

        try {
            const { rows: customersList } = await connection.query(`
                SELECT * FROM customers
                WHERE cpf LIKE $1
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `, [cpf]);

            res.status(200).send(customersList);
        } catch(e) {
            res.status(500).send(e);
        }
    } else {
        try {
            const { rows: customersList } = await connection.query(`
                SELECT * FROM customers
                ${order}
                ${desc}
                ${limit}
                ${offSet}
            `,);

            res.status(200).send(customersList);
        } catch(e) {
            res.status(500).send(e);
        }
    }
}

export async function getCustomer(req, res) {
    const id = req.params.id;

    if(id) {
        try {
            const { rows: customer } = await connection.query(`
                SELECT * FROM customers
                WHERE id = $1
            `, [id]);

            if(customer.length === 0) return res.sendStatus(404);

            res.status(200).send(customer);
        } catch(e) {
            res.status(500).send(e);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function postCustomers(req, res){
    const body = req.body;
    const value = await postCustomersValidation(body);
    
    if(value.error) {
        res.status(400).send(value.error.details);
    } else {
        try {
            const { rows: customersCpf } = await connection.query(`
                SELECT (cpf) FROM customers
            `);

            if(customersCpf.some((n) =>
                n.cpf === body.cpf
            )) return res.sendStatus(409);

            await connection.query(`
                INSERT INTO customers (
                    name,
                    phone,
                    cpf,
                    birthday
                ) VALUES (
                    $1, $2, $3, $4
                )
            `, [
                body.name,
                body.phone,
                body.cpf,
                body.birthday
            ]);

            res.sendStatus(201);
        } catch(e) {
            res.status(500).send(e);
        }
    }
}

export async function setCustomers(req, res) {
    const body = req.body;
    const value = await postCustomersValidation(body);
    const id = req.params.id;

    if(value.error) return res.status(400).send(value.error.details);

    if(id) {
        try {
            const { rows: customerID } = await connection.query(`
                SELECT (id) FROM customers
                WHERE id = $1
            `, [id]);

            if(customerID.length === 0) return res.sendStatus(404);

            const { rows: customersCpf } = await connection.query(`
                SELECT (cpf) FROM customers
                WHERE id <> $1
            `, [id]);

            if(customersCpf.some((n) =>
                n.cpf === body.cpf
            )) return res.sendStatus(409);

            await connection.query(`
                UPDATE customers SET
                name=$1,
                phone=$2,
                cpf=$3,
                birthday=$4
                WHERE id = $5
            `, [
                body.name,
                body.phone,
                body.cpf,
                body.birthday,
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