import Joi from "joi";

export const domainValidatorSchema = Joi.object({
    websiteUrl: Joi.string().required().pattern(
        new RegExp(
            /^(https?:\/\/)?([a-zA-Z0-9-_]+\.[a-zA-Z]{2,})([\/a-zA-Z0-9-_.]*)?$/
        )
    ).messages({
        'string.pattern.base': 'Invalid domain format',
    }),
});
