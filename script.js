// Fungsi untuk membuka modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Tutup modal jika klik di luar area modal
window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
}

// Tombol kontak
const contactMeBtn = document.querySelector('.btn.contact-me');
const pages = document.querySelectorAll('.book-page.page-right');

// Klik tombol Contact Me
contactMeBtn.onclick = () => {
    pages.forEach((page, index) => {
        setTimeout(() => {
            page.classList.add('turn');
            setTimeout(() => {
                page.style.zIndex = 20 + index;
            }, 500);
        }, (index + 1) * 200 + 100);
    });
};

// Tombol back profile
const backProfileBtn = document.querySelector('.back-profile');
let totalPages = pages.length;
let pageNumber = 0;

// Fungsi indeks terbalik
function reverseIndex() {
    pageNumber--;
    if (pageNumber < 0) {
        pageNumber = totalPages - 1;
    }
}

// Klik tombol Back to Profile
backProfileBtn.onclick = () => {
    pages.forEach((_, index) => {
        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].classList.remove('turn');
            setTimeout(() => {
                reverseIndex();
                pages[pageNumber].style.zIndex = 10 + index;
            }, 500);
        }, (index + 1) * 200 + 100);
    });
};

// Tombol untuk halaman berikutnya dan sebelumnya
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) => {
    el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);

        if (pageTurn.classList.contains('turn')) {
            pageTurn.classList.remove('turn');
            setTimeout(() => {
                pageTurn.style.zIndex = 20 - index;
            }, 500);
        } else {
            pageTurn.classList.add('turn');
            setTimeout(() => {
                pageTurn.style.zIndex = 20 + index;
            }, 500);
        }
    };
});

// Animasi pembukaan halaman
const coverRight = document.querySelector('.cover.cover-right');
const pageLeft = document.querySelector('.book-page.page-left');

setTimeout(() => {
    coverRight.classList.add('turn');
}, 2100);

setTimeout(() => {
    coverRight.style.zIndex = -1;
}, 2800);

setTimeout(() => {
    pageLeft.style.zIndex = 20;
}, 3200);

pages.forEach((_, index) => {
    setTimeout(() => {
        reverseIndex();
        pages[pageNumber].classList.remove('turn');
        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].style.zIndex = 10 + index;
        }, 500);
    }, (index + 1) * 200 + 2100);
});

// Mendaftarkan Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/portofolio-affi/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker terdaftar dengan sukses:', registration);
            })
            .catch(function(error) {
                console.log('Pendaftaran Service Worker gagal:', error);
            });
    });
}


// Inisialisasi IndexedDB
const dbName = "PesanKontak";
const dbVersion = 1;
let db;

// Membuka atau membuat database IndexedDB
const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Membuat object store jika belum ada
    if (!db.objectStoreNames.contains("pesan")) {
        db.createObjectStore("pesan", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("IndexedDB berhasil diinisialisasi.");
};

request.onerror = function(event) {
    console.error("Kesalahan database:", event.target.errorCode);
};

// Fungsi untuk menyimpan pesan ke IndexedDB
function simpanKeIndexedDB(data) {
    const transaction = db.transaction("pesan", "readwrite");
    const store = transaction.objectStore("pesan");
    store.add(data);
    transaction.oncomplete = function() {
        console.log("Pesan berhasil disimpan ke IndexedDB.");
    };
    transaction.onerror = function(event) {
        console.error("Kesalahan menyimpan pesan:", event.target.error);
    };
}

// Fungsi yang akan dipanggil saat formulir dikirim
function sendMessage() {
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    // Membuat objek data
    const data = {
        name: name,
        email: email,
        message: message
    };

    // Menyimpan data ke IndexedDB
    simpanKeIndexedDB(data);

    // Tampilkan notifikasi
    alert("Pesan Anda telah dikirim dan disimpan! Terima kasih telah menghubungi kami.");
    
    return true; // Lanjutkan proses pengiriman ke Formspree
}


//untuk push notifikasi

// Memeriksa apakah service worker didukung oleh browser
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/portofolio-affi/service-worker.js')
    .then(registration => {
        console.log('Service Worker terdaftar:', registration);
    })
    .catch(error => {
        console.error('Pendaftaran Service Worker gagal:', error);
    });
}
// Meminta izin notifikasi saat halaman dimuat
if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
        console.log('Izin notifikasi:', permission);
        if (permission === 'granted') {
            // Mengirim pesan ke service worker untuk menampilkan notifikasi jika izin diberikan
            navigator.serviceWorker.ready.then(registration => {
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'SHOW_NOTIFICATION'
                    });
                } else {
                    console.log('Service Worker belum aktif.');
                }
            });
        } else {
            console.log('Izin notifikasi ditolak atau belum dipilih.');
        }
    });
} else {
    console.log('Browser tidak mendukung Notification API.');
}
