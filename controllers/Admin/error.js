const adminErrorMessages = (code, detail) => {
    const messages = {
        1000: {
            message: {
                tr: "İstek inputlarınız eksik lütfen kontrol ediniz.",
                en: "Your request inputs are missing, please check.",
                de: "Es fehlen Eingaben in Ihrer Anfrage, bitte überprüfen Sie dies."
            },
            statusCode: 400,
            errorCode: 1000,
            detail
        }
    }
    return messages[code]
}

module.exports = {
    adminErrorMessages,
}
