import Joi from "joi";

export async function postCategoriesValidation(body) {
    const schema = Joi.object({
        name: Joi.string().required()
    });

    const value = schema.validate({
        name: body.name
    });

    return value;
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