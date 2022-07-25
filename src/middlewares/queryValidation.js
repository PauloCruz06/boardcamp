import { querySchemaValidation } from "../schemaValidations/validations.js";

export default async function queryValidation(req, res, next) {
    const queryObject = {
        offSet: req.query.offset,
        limit: req.query.limit,
        order: req.query.order,
        desc: req.query.desc,
        status: req.query.status,
        startDate: req.query.startDate
    };
    const value = await querySchemaValidation(queryObject);

    if(value.error) {
        res.status(422).send(value.error.details);
    } else {
        const newQuery = {
            offSet: queryObject.offSet ? `OFFSET ${queryObject.offSet}` : '',
            limit: queryObject.limit ? `LIMIT ${queryObject.limit}` : '',
            order: queryObject.order ? `ORDER BY "${queryObject.order}"` : '',
            desc: queryObject.desc === 'true' ? 'DESC' : '',
            status: queryObject.status ?
                queryObject.status === 'open' ?
                    `AND rentals."returnDate" IS NULL` : `AND rentals."returnDate" IS NOT NULL`
            : '',
            startDate: queryObject.startDate ?
                `AND rentals."rentDate" >= '${queryObject.startDate}'`
            : ''
        }

        res.locals.queryObject = newQuery;
        next();
    }
}