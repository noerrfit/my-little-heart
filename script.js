
/* =========================
   1. AMBIL ELEMEN HTML
========================= */

const opening = document.getElementById("opening");
const nameForm = document.getElementById("nameForm");
const nameInput = document.getElementById("nameInput");

const heartScreen = document.getElementById("heartScreen");
const heartContainer = document.getElementById("heartContainer");

const backgroundMusic = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");


/* =========================
   2. PENGATURAN ANIMASI
========================= */

const total = 100;
const speed = 0.004;
const heartScale = 15;

let hearts = [];
let animationId = null;
let isPlaying = false;


/* =========================
   3. MEMBUAT TEKS HATI
========================= */

function createHeart(name) {
    // Bersihkan animasi sebelumnya
    hearts = [];
    heartContainer.replaceChildren();

    
    // Buat titik pantulan cahaya
    sparkles = [];

    const sparklePositions = [
        Math.PI / 4,
        3 * Math.PI / 4,
        Math.PI,
        3 * Math.PI / 2
    ];

    sparklePositions.forEach((t, index) => {
        const sparkle = document.createElement("div");
        sparkle.className = "heart-sparkle";

        // Atur waktu kilau supaya tidak bersamaan
        sparkle.style.animationDelay = `${index * 0.45}s`;

        heartContainer.appendChild(sparkle);

        sparkles.push({
            div: sparkle,
            t: t
        });
    });


    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Ukuran hati menyesuaikan layar
    const scale = Math.min(
        window.innerWidth / 38,
        window.innerHeight / 34,
        heartScale
    );

    for (let i = 0; i < total; i++) {
        const t = (i / total) * Math.PI * 2;

        const div = document.createElement("div");
        div.className = "love";
        div.textContent = name;

        heartContainer.appendChild(div);

        hearts.push({
            div: div,
            t: t
        });
    }

    // Simpan posisi awal
    animateHeart(centerX, centerY, scale);

    
    // Pantulan cahaya mengikuti kurva hati
    sparkles.forEach((sparkle) => {
        const x = 16 * Math.pow(Math.sin(sparkle.t), 3);

        const y = -(
            13 * Math.cos(sparkle.t)
            - 5 * Math.cos(2 * sparkle.t)
            - 2 * Math.cos(3 * sparkle.t)
            - Math.cos(4 * sparkle.t)
        );

        sparkle.div.style.left = `${centerX + x * scale}px`;
        sparkle.div.style.top = `${centerY + y * scale}px`;
    });

}


/* =========================
   4. MENGGERAKKAN HATI
========================= */

function animateHeart(centerX, centerY, scale) {
    hearts.forEach((heart) => {
        heart.t += speed;

        // Rumus kurva hati
        const x =
            16 * Math.pow(Math.sin(heart.t), 3);

        const y = -(
            13 * Math.cos(heart.t)
            - 5 * Math.cos(2 * heart.t)
            - 2 * Math.cos(3 * heart.t)
            - Math.cos(4 * heart.t)
        );

        // Posisikan teks mengikuti kurva
        heart.div.style.left =
            `${centerX + x * scale}px`;

        heart.div.style.top =
            `${centerY + y * scale}px`;
    });

    animationId = requestAnimationFrame(() => {
        animateHeart(
            window.innerWidth / 2,
            window.innerHeight / 2,
            Math.min(
                window.innerWidth / 38,
                window.innerHeight / 34,
                heartScale
            )
        );
    });
}


/* =========================
   5. MEMULAI MUSIK
========================= */

async function playMusic() {
    try {
        backgroundMusic.volume = 0.7;

        await backgroundMusic.play();

        isPlaying = true;
        musicButton.hidden = true;

    } catch (error) {
        // Jika browser menolak autoplay,
        // tampilkan tombol untuk memulai musik.
        isPlaying = false;
        musicButton.hidden = false;

        console.warn(
            "Musik belum dapat diputar. Tekan tombol Play Music.",
            error
        );
    }
}


/* =========================
   6. TOMBOL PLAY / PAUSE
========================= */

musicButton.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
        await playMusic();
    } else {
        backgroundMusic.pause();
        isPlaying = false;
        musicButton.textContent = "▶ Play Music";
    }
});

backgroundMusic.addEventListener("play", () => {
    isPlaying = true;
    musicButton.textContent = "Ⅱ Pause Music";
});

backgroundMusic.addEventListener("pause", () => {
    isPlaying = false;
    musicButton.textContent = "▶ Play Music";
});


/* =========================
   7. KLIK CREATE
========================= */

nameForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();

    // Jangan lanjut jika nama kosong
    if (!name) {
        nameInput.focus();
        return;
    }

    // Cegah animasi berjalan berulang
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // Sembunyikan opening
    opening.classList.add("hide");

    // Tampilkan layar hati
    heartScreen.hidden = false;

    // Buat teks sesuai nama
    createHeart(name);

    // Mulai musik setelah klik Create
    await playMusic();
});


/* =========================
   8. RESPONSIVE SAAT RESIZE
========================= */

window.addEventListener("resize", () => {
    if (!heartScreen.hidden && hearts.length > 0) {
        // Animasi memakai ukuran layar terbaru
        // secara otomatis pada frame berikutnya.
    }
});

let sparkles = [];
