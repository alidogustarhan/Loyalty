const errorMessages = (code, detail, language) => {
  const messages = {
    9000: {
      message: {
        tr: "Genel sunucu hatası.",
        en: "General server error."
      },
      statusCode: 500,
      errorCode: 9000,
      detail
    },
    1000: {
      message: {
        tr: "İstek inputlarınız eksik lütfen kontrol ediniz.",
        en: "Your request inputs are missing, please check."
      },
      statusCode: 400,
      errorCode: 1000,
      detail
    },
    1001: {
      message: {
        tr: "Geçersiz Token.",
        en: "Invalid Token."
      },
      statusCode: 401,
      errorCode: 1001,
      detail
    },
    1002: {
      message: {
        tr: "Personel kaydı bulunamadı.",
        en: "Personnel record not found."
      },
      statusCode: 404,
      errorCode: 1002,
      detail
    },
    1003: {
      message: {
        tr: "Bu veri zaten sistemde kayıtlıdır.",
        en: "This data is already recorded in the system."
      },
      statusCode: 409,
      errorCode: 1003,
      detail
    },
    1004: {
      message: {
        tr: "Güncelleme işlemi için kayıtlı veri bulunamadı.",
        en: "No data found for the update process."
      },
      statusCode: 404,
      errorCode: 1004,
      detail
    },
    1005: {
      message: {
        tr: "Silme işlemi için kayıtlı veri bulunamadı.",
        en: "No data found for the delete process."
      },
      statusCode: 404,
      errorCode: 1005,
      detail
    }
  }
  return messages[code]
}

module.exports = {
  errorMessages,
}
