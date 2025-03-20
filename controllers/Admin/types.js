
const { z } = require('zod')

const setProductInput = z.object({
    name: z.string(),
    sku: z.string(),
    soldWithPoints: z.boolean().default(true),
    pointsEarned: z.number().default(0),
    price: z.number(),
    discountPrice: z.number().optional()
});

const updateProductInput = z.object({
    updatedId: z.string(),
    price: z.number(),
    soldWithPoints: z.boolean().default(true),
    pointsEarned: z.number().default(0),
    discountPrice: z.number().optional(),
    name: z.string(),
    sku: z.string()
});

const deleteProductInput = z.object({
    deletedId: z.string()
});

const getProductInput = z.object({
    _id: z.string().optional()
});

module.exports = {
    setProductInput,
    updateProductInput,
    deleteProductInput,
    getProductInput
}
