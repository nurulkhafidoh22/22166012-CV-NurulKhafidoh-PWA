const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
    '/portofolio-affi/',
    '/portofolio-affi/index.html',
    '/portofolio-affi/style.css',
    '/portofolio-affi/script.js',
    '/portofolio-affi/manifest.json',
    '/portofolio-affi/images/portofolio.jpg',
    '/portofolio-affi/images/foto.jpg',
    '/portofolio-affi/images/icon.png',
    '/portofolio-affi/assets/CV_Nurul_Khafidoh.pdf',
];

// Install Service Worker dan cache file
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Menghapus cache lama saat mengaktifkan Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Hapus cache yang tidak lagi digunakan
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Ambil file dari cache jika tersedia, jika tidak, ambil dari jaringan
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Kembalikan file dari cache jika ada
                if (response) {
                    return response; // Kembalikan response dari cache
                }

                // Jika tidak ada di cache, ambil dari jaringan
                return fetch(event.request).catch(() => {
                    // Jika terjadi kesalahan saat fetch (misalnya offline), kembalikan response 404
                    return new Response('Resource tidak tersedia di cache dan tidak dapat diambil dari jaringan.', {
                        status: 404,
                        statusText: 'Not Found'
                    });
                });
            })
    );
});


// Fungsi untuk menampilkan notifikasi
function showNotification() {
    const title = 'Hallo!';
    const options = {
        body: 'Selamat Datang di Web Portofolio Nurul Khafidoh. Terimakasih telah mengunjungi!',
        icon: '/images/icon.png'
    };

    // Menampilkan notifikasi
    self.registration.showNotification(title, options);
}

// Menangani klik pada notifikasi
self.addEventListener('notificationclick', event => {
    event.notification.close(); // Menutup notifikasi saat diklik
    event.waitUntil(
        clients.openWindow('https://nurulkhafidoh-aliviafatahyumna.store/portofolio-affi/') // URL yang akan dibuka saat notifikasi diklik
    );
});

// Menangani pesan dari script utama
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        showNotification();
    }
});
