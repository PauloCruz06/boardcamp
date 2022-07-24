import connection from "../dbStrategy/postgres.js";

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