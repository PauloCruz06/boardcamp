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
        desc: Joi.string().valid('true', 'false')
    });

    const value = schema.validate({
        offset: query.offset,
        limit: query.limit,
        order: query.order,
        desc: query.desc
    });

    return value;
}