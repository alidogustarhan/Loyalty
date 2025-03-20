/* eslint-disable no-unused-vars */

//Kütüphaneler
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

//Database Şemaları
const { orderSchema } = require('../../models/order');
const { personelSchema } = require('../../models/personel');
const { productSchema } = require('../../models/product');

//Yardımcı Metodlar
const { createCustomError, errorRoute } = require('../../errors/custom-error');
const { createSuccessMessage } = require('../../success/custom-success')

//Metodlar

const login = async (input, next) => {

    const { email, password } = input;

    try {

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        const personelInformation = await personelSchema.findOne({
            email,
            password: hashedPassword,
            isActive: true
        });

        if (!personelInformation) {
            return next(createCustomError(1000, errorRoute.Enum.customer, input.system_language));
        }

        const token = jwt.sign({ fullName: `${personelInformation.name} ${personelInformation.surname}`, email: personelInformation.email, id: personelInformation._id }, process.env.JWT_SECRET, { expiresIn: '1w' });

        return next(createSuccessMessage(2000, input.system_language, token));

    } catch (error) {
        return next(createCustomError(9000, errorRoute.enum.general, input.system_language, error))
    }
}

const payment = async (input, next) => {

    const { products, system_userId } = input

    try {
        // Adım 1: Sepetteki ürünlerin soldWithPoints değerini kontrol et
        const productIds = products.map(product => product.productId);
        const productQuery = await productSchema.find({ _id: { $in: productIds } });

        const invalidProducts = productQuery.filter(product => !product.soldWithPoints);

        if (invalidProducts.length > 0) {
            const invalidProductNames = invalidProducts.map(product => product.name);
            return next(createCustomError(1001, errorRoute.Enum.customer, input.system_language, `Ürünler: ${invalidProductNames.join(', ')}`));
        }

        //Inputcontrollerda user kontrolü yapılıyor.Yani user kesin mevcut 
        const user = await personelSchema.findOne({ _id: system_userId })

        const totalValues = productQuery.reduce((acc, product) => {

            // Ürünün fiyatını kontrol et
            const price = product.discountPrice || product.price;

            const bonusPoints = product.pointsEarned || 0

            // Sepetteki ürünü bul
            let findedProduct = products.find((inputProduct) => inputProduct.productId == product._id);

            // Toplam miktar (amount) ve toplam fiyatı hesapla
            const totalPriceForProduct = price * findedProduct.quantity;
            const totalBonusForProduct = bonusPoints * findedProduct.quantity;

            // Toplam miktarı ve bonus puanını biriktir
            acc.totalAmount += totalPriceForProduct;
            acc.totalBonusPoints += totalBonusForProduct;

            return acc;
        }, { totalAmount: 0, totalBonusPoints: 0 }); // Başlangıç değeri olarak 0'ları ekliyoruz

        if (user.credit < totalValues.totalAmount) {
            return next(createCustomError(1002, errorRoute.Enum.customer, input.system_language))
        }

        //Order oluştur
        await orderSchema.create({ userId: system_userId, products, totalAmount: totalValues.totalAmount, createdAt: Date.now(), updatedAt: Date.now() }); // Siparişi kaydet

        const updatedCredit = user.credit - totalValues.totalAmount + totalValues.totalBonusPoints; // Kullanıcıdan puan düşülmesi

        await personelSchema.updateOne(
            { _id: system_userId },
            { $set: { credit: updatedCredit } } // Yalnızca credit alanını güncelle
        );

        return next(createSuccessMessage(2005, input.system_language));

    } catch (error) {
        return next(createCustomError(9000, errorRoute.enum.general, input.system_language, error))
    }
};

module.exports = {
    login,
    payment
}