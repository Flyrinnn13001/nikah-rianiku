/**
 * PUNAKAWAN MANSION GARDEN — Interactive Wedding Invitation Controller
 * Riani & Rafly | Minggu, 22 Agustus 2027
 */
(function () {
  'use strict';

  /* ========================================================================
     CONFIGURATION
     - Isi `liveStreamingUrl` dengan tautan YouTube / Instagram / Zoom jika
       ada siaran langsung; biarkan string kosong "" agar bagian Live Streaming
       otomatis disembunyikan sesuai spesifikasi.
     ======================================================================== */
  const WEDDING_CONFIG = {
    weddingDateISO: '2027-08-22T08:00:00+07:00', // Minggu, 22 Agustus 2027 08.00 WIB
    liveStreamingUrl: '',                        // Kosong = disembunyikan otomatis; bisa juga diisi lewat ?live=<url>
    storageKeyWishes: 'punakawan_riani_rafly_wishes_v1',
    galleryPhotos: [
      { src: 'assets/photos/couple-main.jpg', alt: 'Potret Kebersamaan Riani & Rafly' },
      { src: 'assets/photos/bride-riani.jpg', alt: 'Siti Riani' },
      { src: 'assets/photos/groom-rafly.jpg', alt: 'Muhamad Rafly Kristiadi' },
      { src: 'assets/photos/couple-garden.jpg', alt: 'Riani & Rafly di Taman' }
    ]
  };

  /* ========================================================================
     1. PERSONALISASI NAMA TAMU (?to=) & KONFIGURASI LIVE STREAMING
     ======================================================================== */
  const params = new URLSearchParams(window.location.search);
  const guestNameEl = document.getElementById('guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');

  const rawGuest = params.get('to') || params.get('kepada') || '';
  const cleanedGuest = rawGuest.replace(/\+/g, ' ').trim();
  if (cleanedGuest && guestNameEl) {
    guestNameEl.textContent = cleanedGuest;
    if (rsvpNameInput && !rsvpNameInput.value) {
      rsvpNameInput.value = cleanedGuest;
    }
  }

  // Tampilkan bagian Live Streaming HANYA jika ada tautannya
  const liveUrl = (params.get('live') || WEDDING_CONFIG.liveStreamingUrl || '').trim();
  const liveSection = document.getElementById('live-streaming');
  const liveBtn = document.getElementById('btn-live-link');
  if (liveUrl && liveSection && liveBtn) {
    liveBtn.href = liveUrl;
    liveSection.hidden = false;
  }

  /* ========================================================================
     DETEKSI PERANGKAT LEMAH / REDUCED MOTION (FALLBACK SEDERHANA)
     ======================================================================== */
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowHardware =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2);
  const isLiteMode = Boolean(prefersReducedMotion || lowHardware);

  if (isLiteMode) {
    document.body.classList.add('lite-mode');
  }

  /* ========================================================================
     ELEMEN MELAYANG: KELOPAK MAWAR JATUH PERLAHAN
     ======================================================================== */
  function initFallingPetals() {
    const container = document.getElementById('petals-container');
    if (!container || prefersReducedMotion) return;

    const petalCount = isLiteMode ? 4 : 9;
    const colors = ['#D98292', '#9E4A5A', '#E8A5B2', '#F2D6AE', '#C45B6E'];

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'rose-petal';
      const leftPct = Math.round((i / petalCount) * 92 + (Math.random() * 8));
      const dur = (12 + Math.random() * 8).toFixed(1);
      const delay = (i * 2.1 + Math.random() * 2).toFixed(1);
      const sway = ((i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 22)).toFixed(0);
      const fill = colors[i % colors.length];

      petal.style.left = leftPct + '%';
      petal.style.setProperty('--dur', dur + 's');
      petal.style.setProperty('--delay', delay + 's');
      petal.style.setProperty('--sway', sway + 'px');

      petal.innerHTML =
        '<svg viewBox="0 0 20 24" width="100%" height="100%">' +
        '<path d="M10,1 C16,4 19,12 15,19 C12,23 6,23 4,18 C1,11 4,4 10,1 Z" fill="' +
        fill +
        '" fill-opacity="0.76" />' +
        '</svg>';
      container.appendChild(petal);
    }
  }
  initFallingPetals();

  /* ========================================================================
     MUSIK LATAR & PIRINGAN HITAM BERPUTAR (KANAN BAWAH)
     ======================================================================== */
  const audio = document.getElementById('bg-music');
  const vinylWrap = document.getElementById('vinyl-wrap');
  const vinylBtn = document.getElementById('vinyl-btn');
  let isMusicPlaying = false;

  function updateVinylUI(playing) {
    isMusicPlaying = playing;
    if (!vinylBtn) return;
    vinylBtn.classList.toggle('is-playing', playing);
  }

  function startMusic() {
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(function () {
          updateVinylUI(true);
        })
        .catch(function () {
          updateVinylUI(false);
        });
    } else {
      updateVinylUI(!audio.paused);
    }
  }

  if (vinylBtn && audio) {
    vinylBtn.addEventListener('click', function () {
      if (audio.paused) {
        startMusic();
      } else {
        audio.pause();
        updateVinylUI(false);
      }
    });
  }

  /* ========================================================================
     2. ANIMASI PINTU KACA & KAMERA MENUJU MANSION + AIR MANCUR NAIK
     Urutan persis:
       Step A: Sampul foto bergeser -> muncul Pintu Kaca Ganda rose-gold + cahaya putih terang
       Step B: Kedua daun pintu terbuka ke luar perlahan -> jalan taman lurus & Mansion Klasik Putih
       Step C: Kamera maju menyusuri jalan -> pohon hijau masuk kiri-kanan atas, mawar tumbuh di bawah,
               air mancur dua tingkat muncul naik di depan mansion dengan air mengalir
       Step D: Mansion memudar jadi watermark samar -> bingkai renda putih muncul mengelilingi layar,
               teks "The Wedding of Riani & Rafly", "22 . 08 . 2027", tombol "SAVE THE DATE" muncul,
               lalu halaman terbuka untuk di-scroll normal.
     ======================================================================== */
  const coverScreen = document.getElementById('cover-screen');
  const openBtn = document.getElementById('btn-open-invitation');
  const heroStage = document.getElementById('hero-stage');
  const frenchDoors = document.getElementById('french-doors-stage');
  const skipIntroBtn = document.getElementById('btn-skip-intro');

  let introTimers = [];
  let invitationOpened = false;

  function clearIntroTimers() {
    introTimers.forEach(function (id) {
      clearTimeout(id);
    });
    introTimers = [];
  }

  function finishOpeningSequence() {
    clearIntroTimers();
    if (coverScreen) {
      coverScreen.classList.add('is-sliding-away', 'is-hidden');
    }
    if (frenchDoors) {
      frenchDoors.classList.add('doors-opening', 'doors-zoom-through', 'is-removed');
    }
    if (heroStage) {
      heroStage.classList.add('phase-camera-walk', 'phase-hero-final');
    }
    if (skipIntroBtn) {
      skipIntroBtn.classList.remove('is-active');
    }
    if (vinylWrap) {
      vinylWrap.classList.add('is-visible');
    }
    document.body.classList.remove('is-locked');
  }

  function runOpeningChoreography() {
    if (invitationOpened) return;
    invitationOpened = true;

    window.scrollTo(0, 0);
    startMusic();

    // Tampilkan ikon piringan hitam berputar setelah undangan dibuka
    if (vinylWrap) {
      vinylWrap.classList.add('is-visible');
    }

    // Fallback cepat & ringan untuk perangkat lemah / reduced-motion
    if (isLiteMode) {
      if (coverScreen) coverScreen.classList.add('is-sliding-away');
      if (frenchDoors) frenchDoors.classList.add('doors-opening');
      if (heroStage) heroStage.classList.add('phase-camera-walk');
      introTimers.push(
        setTimeout(function () {
          finishOpeningSequence();
        }, 1200)
      );
      return;
    }

    // Step A (0ms): Sampul foto bergeser ke atas, menyingkap Pintu Kaca Ganda rose-gold + cahaya putih menyilaukan
    if (coverScreen) {
      coverScreen.classList.add('is-sliding-away');
    }
    if (skipIntroBtn) {
      skipIntroBtn.classList.add('is-active');
    }

    // Step B (850ms): Kedua daun pintu kaca TERBUKA KE LUAR secara perlahan -> jalan taman & Mansion Klasik Putih
    introTimers.push(
      setTimeout(function () {
        if (coverScreen) coverScreen.classList.add('is-hidden');
        if (frenchDoors) frenchDoors.classList.add('doors-opening');
      }, 850)
    );

    // Step C (2250ms): Kamera maju menyusuri jalan, menembus pintu; pohon hijau tumbuh dari kiri-kanan atas,
    //                  hamparan mawar tumbuh di bawah, & Air Mancur dua tingkat muncul naik di depan mansion
    introTimers.push(
      setTimeout(function () {
        if (frenchDoors) frenchDoors.classList.add('doors-zoom-through');
        if (heroStage) heroStage.classList.add('phase-camera-walk');
      }, 2250)
    );

    // Step D (4450ms): Mansion memudar jadi watermark samar, bingkai Renda Putih muncul mengelilingi layar,
    //                  teks "The Wedding of Riani & Rafly" + "22 . 08 . 2027" + "SAVE THE DATE" muncul, scroll dibuka
    introTimers.push(
      setTimeout(function () {
        finishOpeningSequence();
      }, 4450)
    );
  }

  if (openBtn) {
    openBtn.addEventListener('click', runOpeningChoreography);
  }

  if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', finishOpeningSequence);
  }

  /* ========================================================================
     SCROLL REVEAL: FADE-UP & BLUR-TO-FOCUS DI TIAP SECTION
     ======================================================================== */
  const revealTargets = document.querySelectorAll('.reveal-blur, .stagger-group');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -36px 0px' }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ========================================================================
     5. LIVE COUNTDOWN MENUJU 22 AGUSTUS 2027 08.00 WIB
     ======================================================================== */
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const targetTimestamp = new Date(WEDDING_CONFIG.weddingDateISO).getTime();

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetTimestamp - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = pad2(days);
    if (cdHours) cdHours.textContent = pad2(hours);
    if (cdMinutes) cdMinutes.textContent = pad2(minutes);
    if (cdSeconds) cdSeconds.textContent = pad2(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ========================================================================
     8. GALERI FOTO LIGHTBOX (TAP UNTUK MEMPERBESAR)
     ======================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  let activePhotoIndex = 0;

  function showLightbox(index) {
    const photos = WEDDING_CONFIG.galleryPhotos;
    activePhotoIndex = (index + photos.length) % photos.length;
    const item = photos[activePhotoIndex];
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = (activePhotoIndex + 1) + ' / ' + photos.length;
    }
    if (lightboxModal) {
      lightboxModal.classList.add('is-open');
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('is-open');
    }
  }

  document.querySelectorAll('.gallery-item').forEach(function (card) {
    card.addEventListener('click', function () {
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      showLightbox(idx);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(card.getAttribute('data-index') || '0', 10);
        showLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      showLightbox(activePhotoIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      showLightbox(activePhotoIndex + 1);
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightboxModal || !lightboxModal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(activePhotoIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(activePhotoIndex + 1);
  });

  /* ========================================================================
     TOAST HELPER & CLIPBOARD COPY
     ======================================================================== */
  const toastEl = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-shown');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-shown');
    }, 2400);
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /* ========================================================================
     10. WEDDING GIFT TOGGLE & COPY BUTTONS ON ATM CARDS
     ======================================================================== */
  const btnToggleGift = document.getElementById('btn-toggle-gift');
  const giftDrawer = document.getElementById('gift-drawer');

  if (btnToggleGift && giftDrawer) {
    btnToggleGift.addEventListener('click', function () {
      const isOpen = giftDrawer.classList.toggle('is-open');
      btnToggleGift.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.btn-copy-atm, .btn-copy-address').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const value = btn.getAttribute('data-copy') || '';
      const labelSpan = btn.querySelector('span');
      const originalText = labelSpan ? labelSpan.textContent : 'Copy';

      copyTextToClipboard(value).then(function () {
        btn.classList.add('is-copied');
        if (labelSpan) labelSpan.textContent = 'Tersalin ✓';
        showToast('Nomor berhasil disalin: ' + value);

        setTimeout(function () {
          btn.classList.remove('is-copied');
          if (labelSpan) labelSpan.textContent = originalText;
        }, 2200);
      });
    });
  });

  /* ========================================================================
     11. UCAPAN SESUATU (RSVP & DAFTAR DOA)
     ======================================================================== */
  const defaultWishes = [
    {
      name: 'Keluarga Besar Karangsembung',
      message: 'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khair. Semoga Riani & Rafly menjadi keluarga sakinah, mawaddah, warahmah.',
      attendance: 'Hadir',
      createdAt: 'Baru saja'
    },
    {
      name: 'Sahabat Riani & Rafly',
      message: 'Selamat menempuh hidup baru Riani & Rafly! Semoga dilancarkan segala persiapan hingga hari H dan bahagia selalu dunia akhirat.',
      attendance: 'Hadir',
      createdAt: 'Hari ini'
    }
  ];

  function loadWishes() {
    try {
      const saved = localStorage.getItem(WEDDING_CONFIG.storageKeyWishes);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {
      // Ignore storage error in private mode
    }
    return defaultWishes.slice();
  }

  function saveWishes(list) {
    try {
      localStorage.setItem(WEDDING_CONFIG.storageKeyWishes, JSON.stringify(list));
    } catch (_) {
      // Ignore storage error
    }
  }

  let wishesData = loadWishes();

  const statComments = document.getElementById('stat-comments');
  const statHadir = document.getElementById('stat-hadir');
  const statTidakHadir = document.getElementById('stat-tidak-hadir');
  const wishesListEl = document.getElementById('wishes-list');
  const rsvpForm = document.getElementById('rsvp-form');

  function renderWishes() {
    if (!wishesListEl) return;

    let countHadir = 0;
    let countTidakHadir = 0;

    wishesListEl.innerHTML = '';

    wishesData.forEach(function (item) {
      if (item.attendance === 'Hadir') {
        countHadir++;
      } else if (item.attendance === 'Tidak Hadir') {
        countTidakHadir++;
      }

      const card = document.createElement('article');
      card.className = 'wish-card';

      const header = document.createElement('div');
      header.className = 'wish-header';

      const author = document.createElement('span');
      author.className = 'wish-author';
      author.textContent = item.name;

      const badge = document.createElement('span');
      badge.className = 'wish-badge ' + (item.attendance === 'Hadir' ? 'hadir' : 'tidak-hadir');
      badge.textContent = item.attendance;

      header.appendChild(author);
      header.appendChild(badge);

      const msg = document.createElement('p');
      msg.className = 'wish-message';
      msg.textContent = item.message;

      const time = document.createElement('span');
      time.className = 'wish-time';
      time.textContent = item.createdAt || 'Baru saja';

      card.appendChild(header);
      card.appendChild(msg);
      card.appendChild(time);

      wishesListEl.appendChild(card);
    });

    if (statComments) statComments.textContent = String(wishesData.length);
    if (statHadir) statHadir.textContent = String(countHadir);
    if (statTidakHadir) statTidakHadir.textContent = String(countTidakHadir);
  }

  renderWishes();

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameInput = document.getElementById('rsvp-name');
      const msgInput = document.getElementById('rsvp-message');
      const attInput = document.getElementById('rsvp-attendance');

      const nameVal = (nameInput ? nameInput.value : '').trim();
      const msgVal = (msgInput ? msgInput.value : '').trim();
      const attVal = (attInput ? attInput.value : '').trim();

      if (!nameVal || !msgVal || !attVal) {
        showToast('Mohon lengkapi nama, ucapan, dan konfirmasi kehadiran.');
        return;
      }

      const now = new Date();
      const formattedTime = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      wishesData.unshift({
        name: nameVal,
        message: msgVal,
        attendance: attVal,
        createdAt: formattedTime
      });

      saveWishes(wishesData);
      renderWishes();

      if (msgInput) msgInput.value = '';
      if (attInput) attInput.selectedIndex = 0;

      showToast('Terima kasih atas doa & konfirmasi kehadirannya!');
    });
  }
})();
