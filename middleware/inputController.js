//Kütüphaneler
const jwt = require('jsonwebtoken')

//Database şemaları
const { personelSchema } = require('../models/personel');

//Yardımcı Metodlar
const {createCustomError,errorRoute} = require('../errors/custom-error');


//Metodlar
const authCheckMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization
        const language = req.headers.language || 'tr'

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(createCustomError(1001, errorRoute.Enum.general));
        }

        const token = authHeader.split(' ')[1];

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const personelInfo = await personelSchema.findOne({ _id: decoded.id });

            if (!personelInfo) {
                return next(createCustomError(1002, errorRoute.enum.general, language));
            }

            req.decoded = decoded;

            next()

        } catch (error) {
            return next(createCustomError(9000, errorRoute.Enum.general, language, error));
        }
    } catch (error) {
        return next(createCustomError(9000, errorRoute.Enum.general, language, error));

    }
}

const inputControllerMiddleware = (inputModel, updateFunction, type, schema, existControl) => {
    return async (req, res, next) => {

        const language = req.headers["prepared-language"] || "tr"

        try {

            let input = type === 'post' ? req.body : req.params
            
            const validatedData = await inputModel.safeParse(input);

            if (!validatedData.success) {

                let { message, received, path } = validatedData.error.errors[0]

                const missingInputPath = message && received !== "undefined"
                    ? message
                    : path[0];

                return next(
                    createCustomError(1000, errorRoute.enum.general, language, missingInputPath)
                )

            }

            validatedData.data.system_language = language

            if (req.decoded) {
                validatedData.data.system_userId = req.decoded.id
            }

            let controlObject = {}

            for (const key in existControl) {
                if (input.hasOwnProperty(key)) {
                    controlObject[key] = validatedData.data[key]
                }
            }

            await updateFunction(validatedData.data, next, schema, controlObject)

        } catch (error) {
            return next(createCustomError(9000, errorRoute.enum.general, language));
        }
    };
}

module.exports = {
    authCheckMiddleware,
    inputControllerMiddleware
}
