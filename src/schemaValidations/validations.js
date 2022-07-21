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