const mongoose = require('mongoose');

const personel = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'E-posta alanı zorunludur.'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Geçerli bir e-posta adresi girin.']
    },
    password: {
        type: String,
        required: [true, 'Şifre alanı zorunludur.'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/, 'Şifre en az 6 haneli olmalı, bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir.']
    },
    credit: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    actions: {
        type: Array,
        default: []
    },
})

const personelSchema = mongoose.model('personel', personel)

module.exports = { personelSchema }