import Joi from "joi";

export async function getValidation(params) {
    const schema = Joi.object({
        params: Joi.string().valid(
            'categories',
            'customers',
            'games',
            'rentals'
        ).required()
    });

    const value = schema.validate({
        params: params
    });

    return value;
}