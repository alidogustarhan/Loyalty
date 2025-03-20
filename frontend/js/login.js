document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById("login-button").addEventListener('click', async function (e) {
        e.preventDefault(); // Formun sayfa yenilemesini engeller

        try {
            // Form alanlarından verileri al
            const email = document.getElementById('email').value.trim(); 
            const password = document.getElementById('password').value.trim(); 

            // Gönderilecek request verilerini hazırla
            const requestData = {
                email,
                password
            };

            // API'ye POST isteği gönderirken header'a Accepted-Language ekleyelim
            const response = await axios.post('http://localhost:3001/api/v1/case/customer/login', requestData, {
                headers: {
                    'Prepared-Language': 'tr'  // Dil tercihini manuel olarak gönderiyoruz
                }
            });

            if (response.status === 200) {

                localStorage.setItem('jwt_token', response.data.data);

                window.location.href = 'customer'; // Başarılı giriş sonrası yönlendirme

            }

        } catch (error) {

            if (error.response) {

                let { detail, msg } = error.response.data

                const errorMessage = detail || msg

                Swal.fire({
                    title: 'Hata!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Tamam'
                })

            } else {

                Swal.fire({
                    title: 'Hata!',
                    text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
                    icon: 'error',
                    confirmButtonText: 'Tamam'
                });
            }
        }
    });
});




