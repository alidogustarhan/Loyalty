const customerErrorMessages = (code, detail) => {
    const messages = {
        1000: {
            message: {
                tr: "E posta veya şifre hatalı.",
                en: "Email or password is incorrect."
            },
            statusCode: 401,
            errorCode: 1000,
            detail
        },
        1001: {
            message: {
                tr: "Sepetinizde satış türü uygun olmayan ürün var.",
                en: "There are products in your cart that are not suitable for sale."
            },
            statusCode: 400,
            errorCode: 1001,
            detail
        },
        1002: {
            message: {
                tr: "Satın almak için yeterli puanınız yok.",
                en: "You don't have enough points to buy."
            },
            statusCode: 400,
            errorCode: 1002,
            detail
        }
    }
    return messages[code]
}

module.exports = {
    customerErrorMessages,
}
