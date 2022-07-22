import { querySchemaValidation } from "../schemaValidations/validations.js";

export default async function queryValidation(req, res, next) {
    const queryObject = {
        offSet: req.query.offset,
        limit: req.query.limit,
        order: req.query.order,
        desc: req.query.desc
    };
    const value = await querySchemaValidation(queryObject);

    if(value.error) {
        res.status(422).send(value.error.details);
    } else {
        const newQuery = {
            offSet: queryObject.offSet ? `OFFSET ${queryObject.offSet}` : '',
            limit: queryObject.limit ? `LIMIT ${queryObject.limit}` : '',
            order: queryObject.order ? `ORDER BY ${queryObject.order}` : '',
            desc: queryObject.desc === 'true' ? 'DESC' : ''
        }

        res.locals.queryObject = newQuery;
        next();
    }
}