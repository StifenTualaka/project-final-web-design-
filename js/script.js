// =====================================
// DAFTAR GAME RYZARD
// =====================================

const games = [
    {name:"Minecraft",genre:"Adventure",platform:"PC Mobile Console",price:"Rp399.000",amount:399000,img:"img game shop/Onboarding_Card-A_For-Beginners_600x600.jpg"},
    {name:"Genshin Impact",genre:"RPG",platform:"PC Mobile Console",price:"Gratis",amount:0,img:"img game shop/4d4f67a277b41db5d4f78d7827784e80188086ee6c526161.avif"},
    {name:"Valorant",genre:"FPS",platform:"PC",price:"Gratis",amount:0,img:"img game shop/images valorant.jpg"},
    {name:"Forza Horizon 5",genre:"Racing",platform:"PC Xbox",price:"Rp599.000",amount:599000,img:"img game shop/images forza horizon.jpg"},
    {name:"EA Sports FC 26",genre:"Sports",platform:"PC Console Xbox",price:"Rp699.000",amount:699000,img:"img game shop/images EA sport FC 26.jpg"},
    {name:"Mobile Legends",genre:"MOBA",platform:"Mobile",price:"Gratis",amount:0,img:"img game shop/images mlbb.jpg"},
    {name:"PUBG Mobile",genre:"FPS",platform:"Mobile",price:"Gratis",amount:0,img:"img game shop/images pubg.jpg"},
    {name:"Free Fire",genre:"FPS",platform:"Mobile",price:"Gratis",amount:0,img:"img game shop/image free fire.jpg"},
    {name:"Call of Duty Mobile",genre:"FPS",platform:"Mobile",price:"Gratis",amount:0,img:"img game shop/Call of duty mobile.jpg"},
    {name:"Honkai Star Rail",genre:"RPG",platform:"PC Mobile",price:"Gratis",amount:0,img:"img game shop/honkai starrail.jpg"},
    {name:"Resident Evil 4 Remake",genre:"Horror",platform:"PC Console Xbox",price:"Rp549.000",amount:549000,img:"img game shop/Resident evil 4 Remake.jpg"},
    {name:"Elden Ring",genre:"RPG",platform:"PC Console Xbox",price:"Rp599.000",amount:599000,img:"img game shop/images elden ring.jpg"},
    {name:"Need for Speed The Run",genre:"Racing",platform:"PC Console Xbox",price:"Rp499.000",amount:499000,img:"img game shop/images NFS TR.jpg"},
    {name:"GTA V",genre:"Adventure",platform:"PC Console Xbox",price:"Rp399.000",amount:399000,img:"img game shop/logo-of-the-grand-theft-auto-v-five-free-vector.jpg"}
];


// =====================================
// KERANJANG
// =====================================

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("ryzardCart")) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("ryzardCart", JSON.stringify(cart));
    updateCount();
}

function updateCount() {
    let cart = getCart();

    let count = cart.reduce((total, item) => {
        return total + Number(item.qty || 0);
    }, 0);

    document.querySelectorAll(".cart-count").forEach(el => {
        el.textContent = count;
    });
}


// =====================================
// TAMBAH GAME KE KERANJANG
// =====================================

function addToCart(name) {
    let cart = getCart();

    let game = games.find(g => g.name === name);

    if (!game) {
        alert("Game tidak ditemukan!");
        return;
    }

    let found = cart.find(item => item.name === name);

    if (found) {
        found.qty++;
    } else {
        cart.push({
            ...game,
            qty: 1
        });
    }

    saveCart(cart);

    alert(name + " berhasil ditambahkan!");

    renderCart();
}


// =====================================
// TAMPILAN KARTU GAME
// =====================================

function createCard(game) {
    return `
    <div class="col-12 col-sm-6 col-lg-3">
        <div class="game-card">

            <img
                src="${game.img}"
                alt="${game.name}"
                onerror="this.onerror=null; this.src='https://placehold.co/400x250?text=${encodeURIComponent(game.name)}';"
            >

            <div class="card-body">
                <h5>${game.name}</h5>

                <p class="muted">
                    ${game.genre} • ${game.platform}
                </p>

                <p class="price">${game.price}</p>

                <button
                    class="btn btn-primary w-100"
                    onclick="addToCart('${game.name}')">
                    + Keranjang
                </button>
            </div>

        </div>
    </div>`;
}


// =====================================
// PENCARIAN DAN FILTER GAME
// =====================================

function renderGames() {
    let list = document.getElementById("game-list");

    if (!list) return;

    let search = document.getElementById("search")?.value.toLowerCase() || "";
    let genre = document.getElementById("genre")?.value || "all";
    let platform = document.getElementById("platform")?.value || "all";

    let filtered = games.filter(game =>
        game.name.toLowerCase().includes(search) &&
        (genre === "all" || game.genre === genre) &&
        (platform === "all" || game.platform.includes(platform))
    );

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="col-12 text-center">
                <h4>Game tidak ditemukan.</h4>
            </div>
        `;
    } else {
        list.innerHTML = filtered.map(createCard).join("");
    }
}


// =====================================
// GAME UNGGULAN DI HOME
// =====================================

function renderFeatured() {
    let list = document.getElementById("featured-games");

    if (list) {
        list.innerHTML = games.slice(0, 4).map(createCard).join("");
    }
}


// =====================================
// MENAMPILKAN KERANJANG
// =====================================

function renderCart() {
    let list = document.getElementById("cart-items");

    if (!list) return;

    let cart = getCart();

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="cart-row">
                <p>Keranjang masih kosong.</p>
            </div>
        `;
    } else {
        list.innerHTML = cart.map((item, index) => `
            <div class="cart-row">

                <h5>${item.name}</h5>

                <p>Harga: ${item.price}</p>

                <div class="d-flex align-items-center gap-2">

                    <button
                        class="btn btn-sm btn-light"
                        onclick="changeQty(${index}, -1)">
                        −
                    </button>

                    <span>${item.qty}</span>

                    <button
                        class="btn btn-sm btn-light"
                        onclick="changeQty(${index}, 1)">
                        +
                    </button>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="removeItem(${index})">
                        Hapus
                    </button>

                </div>

            </div>
        `).join("");
    }

    let total = cart.reduce((sum, item) => {
        return sum + (Number(item.amount) * Number(item.qty));
    }, 0);

    let totalElement = document.getElementById("cart-total");

    if (totalElement) {
        totalElement.textContent = "Rp" + total.toLocaleString("id-ID");
    }

    let form = document.getElementById("checkout-form");

    if (form) {
        form.style.display = cart.length > 0 ? "block" : "none";
    }
}


// =====================================
// UBAH JUMLAH GAME
// =====================================

function changeQty(index, change) {
    let cart = getCart();

    if (!cart[index]) return;

    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}


// =====================================
// HAPUS GAME
// =====================================

function removeItem(index) {
    let cart = getCart();

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart(cart);
    renderCart();
}


// =====================================
// CHECKOUT
// =====================================

function checkoutOrder(event) {
    event.preventDefault();

    let name = document.getElementById("buyer-name").value;
    let phone = document.getElementById("buyer-phone").value;
    let method = document.getElementById("payment-method").value;

    if (!name || !phone || !method) {
        alert("Lengkapi data terlebih dahulu!");
        return;
    }

    let cart = getCart();

    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    alert(
        "Pesanan berhasil dibuat!\n" +
        "Nama: " + name +
        "\nTelepon: " + phone +
        "\nPembayaran: " + method
    );

    localStorage.removeItem("ryzardCart");

    updateCount();
    renderCart();

    event.target.reset();
}


// =====================================
// MENJALANKAN SEMUA FITUR
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    updateCount();

    renderGames();
    renderFeatured();
    renderCart();

    ["search", "genre", "platform"].forEach(id => {

        let el = document.getElementById(id);

        if (el) {
            el.addEventListener(
                id === "search" ? "input" : "change",
                renderGames
            );
        }

    });

    let form = document.getElementById("checkout-form");

    if (form) {
        form.addEventListener("submit", checkoutOrder);
    }

});