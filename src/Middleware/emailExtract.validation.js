import Joi from "joi";
import ExpressError from "../Utils/ExpressError.js";
import { domainValidatorSchema } from "../Validators/emailExtract.validator.js";

export const domainValidation = (req, res, next) => {
    let query = req.body.websiteUrl;
    let domainArray = query.split(',');
    domainArray = [...new Set(domainArray)];
    for (let domain of domainArray) {
        let { error } = domainValidatorSchema.validate({ websiteUrl: domain.trim() });
        if (error) {
            throw new ExpressError(400, "Server side validation error", error.details[0].message);
        }
    }
    req.body.websiteUrl=domainArray;
    next();
}