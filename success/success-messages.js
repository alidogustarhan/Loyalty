const successMessages = (code, detail) => {
  const messages = {
    2000: {
      message: {
        tr: "Giriş işlemi başarılı.",
        en: "Login succesfull."
      },
      statusCode: 200,
      successCode: 2000,
      detail,
    },
    2001: {
      message: {
        tr: "Veri başarıyla eklendi.",
        en: "Data added successfully."
      },
      statusCode: 201,
      successCode: 2001,
      detail,
    },
    2002: {
      message: {
        tr: "Veri başarıyla güncellendi.",
        en: "Data updated successfully."
      },
      statusCode: 200,
      successCode: 2002,
      detail,
    },
    2003: {
      message: {
        tr: "Veri başarıyla silindi.",
        en: "Data deleted successfully."
      },
      statusCode: 200,
      successCode: 2003,
      detail,
    },
    2004: {
      message: {
        tr: "Veriler.",
        en: "Data."
      },
      statusCode: 200,
      successCode: 2004,
      detail,
    },
    2005: {
      message: {
        tr: "Ödeme işlemi başarılı.",
        en: "Payment transaction successful."
      },
      statusCode: 200,
      successCode: 2005,
      detail,
    }
  }
  return messages[code]
}

module.exports = {
  successMessages,
}
