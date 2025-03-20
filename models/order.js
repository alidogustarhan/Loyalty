const mongoose = require('mongoose');

const order = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true, // Sepetin toplam tutarı
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Cancelled'],
            default: 'Pending', // Sipariş durumu
        },
        createdAt: {
            type: Number,
            required: true,
        },
        updatedAt: {
            type: Number,
            required: true,
        }
    },
);

const orderSchema = mongoose.model('Order', order);

module.exports = { orderSchema };
