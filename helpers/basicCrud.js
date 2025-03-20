const { createCustomError, errorRoute } = require("../errors/custom-error");
const { createSuccessMessage } = require("../success/custom-success");

class basicCrud {

    async set(input, next, schema, existControl) {

        try {

            const query = { isActive: true };

            if (Object.keys(existControl).length > 0) {

                for (const key in existControl) {
                    if (input.hasOwnProperty(key)) {
                        query[key] = input[key]

                    }
                }

                const alreadyExist = await schema.findOne(query);

                if (alreadyExist) {
                    return next(createCustomError(1003, errorRoute.Enum.general, input.system_language));
                }

            }

            const value = new schema({
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                userId: input.system_userId,
                ...input
            });

            await value.save()

            return next(createSuccessMessage(2001, input.system_language));

        } catch (error) {
            return next(createCustomError(9000, errorRoute.enum.general, input.system_language));

        }

    }

    async update(input, next, schema, existControl) {
        
        const { userId, updatedId, ...updatedValues } = input;

        try {

            const existData = await schema.findOne({ _id: updatedId, isActive: true })

            if (!existData) {
                return next(createCustomError(1004, errorRoute.Enum.general, input.system_language));
            }

            if (Object.keys(existControl).length > 0) {
                for (const key in existControl) {

                    if (input.hasOwnProperty(key)) {
                        const query = {};
                        query[key] = { $regex: new RegExp(`^${input[key]}$`, 'i') };
                        const existData = await schema.find(query)

                        if (existData.length >= 1 && existData.isActive == true && (existData[0]._id != updatedId)) {
                            return next(createCustomError(1003, errorRoute.Enum.general, input.system_language, input[key]));
                        }
                    }
                }
            }

            await schema.findOneAndUpdate(
                { _id: updatedId, isActive: true },
                {
                    $set: updatedValues
                },
                { new: true }
            )

            return next(createSuccessMessage(2002, input.system_language))

        } catch (error) {
            return next(createCustomError(9000, errorRoute.enum.general, input.system_language));
        }
    }

    async delete(input, next, schema) {

        const { deletedId } = input

        try {
            const checkExistValue = await schema.findOne({ _id: deletedId, isActive: true });

            if (!checkExistValue) {
                return next(createCustomError(1005, errorRoute.Enum.general, input.system_language));
            }

            await schema.findOneAndUpdate(
                { _id: deletedId },
                { isActive: false },
                { new: true }
            )

            return next(createSuccessMessage(2003, input.system_language))

        } catch (error) {
            return next(createCustomError(9000, errorRoute.enum.general, input.system_language, error))

        }
    }

    async get(input, next, schema) {

        try {

            const query = { isActive: true }

            for (const key in input) {

                if (key === 'system_language' || key === 'system_userId' || input[key] == undefined) {
                    continue;
                }

                query[key] = input[key]
            }

            const values = await schema.find(query).select('-password -userId -email');

            return next(createSuccessMessage(2004, input.system_language, values))

        } catch (error) {
            return next(createCustomError(9000, errorRoute.enum.general, input.system_language, error))
        }
    }

}

module.exports = new basicCrud();