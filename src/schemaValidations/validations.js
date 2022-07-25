import connection from "../dbStrategy/postgres.js";
import Joi from "joi";

export async function postCategoriesValidation(body) {
    const schema = Joi.object({
        name: Joi.string().pattern(/^[A-Z]+/).required()
    });

    const value = schema.validate({
        name: body.name
    });

    return value;
}

export async function postGamesValidation(body) {
    try {
        const { rows: categoryId } = await connection.query(`
            SELECT (id) FROM categories
        `);
        const categoryIdList = categoryId.map((id) => id.id);

        const schema = Joi.object({
            name: Joi.string().pattern(/^[A-Z0-9]+/).required(),
            image: Joi.string().uri().required(),
            stockTotal: Joi.number().integer().min(1).required(),
            categoryId: Joi.number().valid(...categoryIdList).required(),
            pricePerDay: Joi.number().integer().min(1).required()
        });

        const value = schema.validate({
            name: body.name,
            image: body.image,
            stockTotal: body.stockTotal,
            categoryId: body.categoryId,
            pricePerDay: body.pricePerDay
        });

        return value;
    } catch {
       return 500;
    }
}

export async function postCustomersValidation(body) {
    const schema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
        cpf: Joi.string().pattern(/^[0-9]{11}$/).required(),
        birthday: Joi.date().required()
    });

    const value = schema.validate({
        name: body.name,
        phone: body.phone,
        cpf: body.cpf,
        birthday: body.birthday
    });

    return value;
}

export async function postRentalsValidation(body) {
    try{
        const { rows: customerId } = await connection.query(`
            SELECT (id) FROM customers
        `);
        const customersIdList = customerId.map((id) =>
            id.id
        );

        const { rows: gameId } = await connection.query(`
            SELECT (id) FROM games
        `);
        const gamesIdList = gameId.map((id) => id.id);

        const schema = Joi.object({
            customerId: Joi.number().valid(...customersIdList).required(),
            gameId: Joi.number().valid(...gamesIdList).required(),
            daysRented: Joi.number().integer().min(1).required()
        })

        const value = schema.validate({
            customerId: body.customerId,
            gameId: body.gameId,
            daysRented:body.daysRented
        });

        return value;
    } catch {
        return 500;
    }
}

export async function querySchemaValidation(query) {
    const schema = Joi.object({
        offset: Joi.string().pattern(/^[0-9]*$/),
        limit: Joi.string().pattern(/^[0-9]*$/),
        order: Joi.string().valid(
            'id',
            'name',
            'stockTotal',
            'categoryId',
            'pricePerDay',
            'phone',
            'cpf',
            'birthday',
            'customerId',
            'gameId',
            'rentDate',
            'daysRented',
            'returnDate',
            'originalPrice',
            'delayFee'
        ),
        desc: Joi.string().valid('true', 'false'),
        status: Joi.string().valid('open', 'closed'),
        startDate: Joi.string().pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
    });

    const value = schema.validate({
        offset: query.offset,
        limit: query.limit,
        order: query.order,
        desc: query.desc,
        status: query.status,
        startDate: query.startDate
    });

    return value;
}