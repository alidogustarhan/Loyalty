const { z } = require("zod");

const loginInput = z.object({
  email: z
    .string()
    .min(1, { message: "E-posta alanı zorunludur." })  // Eğer e-posta alanı boş bırakılırsa, bu mesaj döner.
    .email("Geçerli bir e-posta adresi girin."),  // Geçerli bir e-posta formatı sağlanmadığında bu mesaj döner.

  password: z
    .string()
    .min(1, { message: "Şifre alanı zorunludur." })  // Şifre alanı boş bırakılmamalıdır.
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{6,}$/,
      "Şifre en az 6 haneli olmalı, bir sayı ve bir özel karakter içermelidir."
    )
});

const getCustomerInput = z.object({
  _id: z.string().optional()
})

const paymentInput = z.object({
  products: z.array(z.object({ productId: z.string(), quantity: z.number() }))
})

module.exports = {
  loginInput,
  getCustomerInput,
  paymentInput
}
