async function getProducts() {
    const token = localStorage.getItem('jwt_token');
    const language = 'tr'; // Veya 'en', dil tercihinizi burada belirleyebilirsiniz.

    const response = await fetch('http://localhost:3001/api/v1/case/admin/getProduct', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Prepared-Language': 'tr',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('API isteği başarısız oldu');
    }

    return await response.json();
}

async function getPersonel(personelId) {
    const token = localStorage.getItem('jwt_token');
    const language = 'tr'; // Veya 'en', dil tercihinizi burada belirleyebilirsiniz.

    const response = await fetch(`http://localhost:3001/api/v1/case/customer/getCustomer/${personelId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Prepared-Language': 'tr',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('API isteği başarısız oldu');
    }

    return await response.json();
}

function generateRatingStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="ti ti-star-filled"></i>';
        } else {
            stars += '<i class="ti ti-star"></i>';
        }
    }
    return stars;
}

document.addEventListener("DOMContentLoaded", async function () {

    let token = localStorage.getItem('jwt_token')

    if (!token) {
        window.location.href = "login"
    }

    const decodedToken = jwt_decode(token);

    let cart = []

    try {

        const products = await getProducts()
        let personel = await getPersonel(decodedToken.id)

        document.getElementById('fullName').textContent = `Kullanıcı: ${personel.data[0].name} ${personel.data[0].surname}`
        document.getElementById('creditAmount').textContent = `Puan: ${personel.data[0].credit}`

        const productList = document.getElementById('product-list')

        products.data.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('col-6', 'col-md-4');

            // Dinamik Badge ile ilgili işlem
            const bonusPoints = product.pointsEarned  // Eğer bonusPoints verisi varsa, kullan. Yoksa 0 puan göster.

            productCard.innerHTML = `
        <div class="card product-card">
            <div class="card-body" style="position: relative;">

                <a class="product-thumbnail d-block" data-bonus-points="${bonusPoints}">
                    <img class="mb-2" src="../img/product/17.png" style="margin-bottom: 30px;"> 
                </a>
                
                ${bonusPoints > 0 ?
                    `<span class="badge badge-info" style="position: absolute; top: 10px; right: 10px; z-index: 10;">+${bonusPoints} Puan</span>`
                    : ''}

                <!-- Kredi ile Alınabilir Badge -->
                ${product.soldWithPoints ?
                    `<span class="badge rounded-pill badge-success" style="position: absolute; top: -15px; left: 10px;">Puan ile Alınabilir</span>`
                    : ''}

                <!-- Product Title -->
                <a class="product-title" href="single-product.html">${product.name}</a>
                <!-- Product Price -->
                <p class="sale-price">
                    ${product.discountPrice ? `${product.discountPrice} Puan` : `${product.price} Puan`}
                    ${product.discountPrice ? `<span>${product.price} Puan</span>` : ''}
                </p>
                    
                <!-- Rating -->
                <div class="product-rating">
                    ${generateRatingStars(4.5)}
                </div>
                
                
                <button class="btn btn-primary btn-sm add-to-cart" data-id="${product._id}" data-name="${product.name}" data-price="${product.discountPrice || product.price}">
                    +
                </button>
            </div>
        </div>
    `;

            productList.appendChild(productCard);
        });

        document.getElementById('loader').style.display = 'none'

    } catch (error) {
        document.getElementById('loader').style.display = 'none'
        console.error("Ürünler alınırken bir hata oluştu: ", error)
    }


    // Sepete ürün ekleme ve çıkarma işlevi
    document.getElementById('product-list').addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            const productName = e.target.getAttribute('data-name');
            const productPrice = parseFloat(e.target.getAttribute('data-price'));
            const bonusPoints = parseInt(e.target.closest('.product-card').querySelector('.product-thumbnail').getAttribute('data-bonus-points'));

            const existingProductIndex = cart.findIndex(item => item.productId === productId);

            if (existingProductIndex !== -1) {
                // Ürün zaten sepette varsa, miktarını arttır
                cart[existingProductIndex].quantity++;
            } else {
                // Ürün sepette yoksa, sepete yeni ekle
                const product = {
                    productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    bonusPoints
                };

                cart.push(product);
            }

            updateCart();
        }
    });

    // Sepet içindeki "Çıkar" butonuna tıklama olayı eklemek için
    document.getElementById('cart-items').addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('remove-from-cart')) {
            const productId = e.target.getAttribute('data-id');

            // Sepetteki ürünü bul ve çıkar
            const productIndex = cart.findIndex(item => item.productId === productId);
            if (productIndex !== -1) {
                // Sepetteki ürünü çıkar
                cart.splice(productIndex, 1);
            }

            updateCart();  // Sepeti güncelle
        }
    });



    function updateCart() {
        const cartList = document.getElementById('cart-items');
        const totalAmount = document.getElementById('total-amount');
        const totalPoints = document.getElementById('total-points');

        // Sepetteki ürünleri listele
        cartList.innerHTML = '';  // Sepeti temizle
        let total = 0;
        let totalBonusPoints = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `
                ${item.name} - ${item.price} Puan x ${item.quantity} 
                <!-- Eksi butonu ile ürün çıkarma -->
                <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.productId}">-</button>
            `;
            cartList.appendChild(listItem);
            total += item.price * item.quantity;
            totalBonusPoints += item.bonusPoints * item.quantity; // Bonus puanı toplamaya ekle
        });

        // Toplam tutarı ve kazanılacak puanı güncelle
        totalAmount.textContent = `${total} Puan`;
        totalPoints.textContent = `${totalBonusPoints} Puan`; // Kazanılacak puanları güncelle
    }


    document.getElementById('pay-button').addEventListener('click', async function () {

        if (cart.length > 0) {

            const paymentData = {
                products: cart.map(({ productId, quantity }) => ({ productId, quantity }))
            };

            try {

                const response = await axios.post('http://localhost:3001/api/v1/case/customer/payment', paymentData, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Prepared-Language': 'tr',
                    }
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'Ödeme işleminiz başarılı!',
                        icon: 'success',
                        confirmButtonText: 'Tamam'
                    }).then(() => {
                        window.location.reload();
                    });
                }

            } catch (error) {

                console.log("eerrr",)

                Swal.fire({
                    title: error.response.data.msg,
                    text: error.response.data.detail,
                    icon: 'error',
                    confirmButtonText: 'Tamam'
                });
                console.error('Ödeme hatası:', error);
            }
        } else {
            // Sepette ürün yoksa, uyarı göster
            Swal.fire({
                title: 'Sepet Boş!',
                text: 'Ödeme yapabilmek için sepette ürün olmalıdır.',
                icon: 'warning',
                confirmButtonText: 'Tamam'
            });
        }

    });




});
