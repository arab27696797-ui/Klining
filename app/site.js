
    /* ==========================================================
       ЛИПКАЯ ШАПКА — тень при прокрутке
       ========================================================== */
    const header = document.getElementById('siteHeader');
    const progressBar = document.getElementById('progressBar');
    addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', scrollY > 8);
      const max = document.documentElement.scrollHeight - innerHeight;
      progressBar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    }, { passive: true });

    /* ==========================================================
       СЛАЙДЕР «ДО / ПОСЛЕ»
       ========================================================== */
    const ba = document.getElementById('baSlider');
    if (ba) {
      const before = ba.querySelector('.ba-img--before');
      const handle = ba.querySelector('.ba-handle');
      const range = ba.querySelector('.ba-range');
      range.addEventListener('input', () => {
        const v = range.value;
        before.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
        handle.style.left = v + '%';
      });
    }

    /* ==========================================================
       МОБИЛЬНОЕ МЕНЮ
       ========================================================== */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('mainNav');
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );

    /* ==========================================================
       SCROLLSPY — подсветка активного пункта навигации
       ========================================================== */
    const navLinks = [...nav.querySelectorAll('a')];
    const spySections = navLinks
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a =>
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spySections.forEach(s => spy.observe(s));

    /* ==========================================================
       REVEAL-АНИМАЦИИ при прокрутке
       ========================================================== */
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ==========================================================
       FAQ-АККОРДЕОН (один открытый пункт)
       ========================================================== */
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-item__btn');
      const panel = item.querySelector('.faq-item__panel');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item.is-open').forEach(o => {
          o.classList.remove('is-open');
          o.querySelector('.faq-item__panel').style.maxHeight = null;
          o.querySelector('.faq-item__btn').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* ==========================================================
       HERO-КАЛЬКУЛЯТОР: комнаты + санузлы → цена со скидкой 15%
       EDIT: ставки должны совпадать с блоком «Цены»
       ========================================================== */
    const HERO_RATES = {
      support:    { base: 2900, room: 1400, bath: 1100 },  // поддерживающая разовая
      general:    { base: 4900, room: 2700, bath: 1700 },  // генеральная
      renovation: { base: 5900, room: 3100, bath: 1900 }   // после ремонта
    };
    const DISCOUNT = 0.85; // −15% на первую уборку
    let heroRooms = 2, heroBaths = 1;

    const heroService = document.getElementById('heroService');
    const heroPrice = document.getElementById('heroPrice');
    const heroPriceOld = document.getElementById('heroPriceOld');
    const roomsVal = document.getElementById('roomsVal');
    const bathsVal = document.getElementById('bathsVal');

    function plural(n, one, few, many) {
      const m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return one;
      if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
      return many;
    }

    function updateHeroPrice() {
      const r = HERO_RATES[heroService.value];
      const full = r.base + r.room * heroRooms + r.bath * heroBaths;
      const disc = Math.round(full * DISCOUNT / 50) * 50;
      heroPrice.textContent = disc.toLocaleString('ru-RU') + ' ₽';
      heroPriceOld.textContent = full.toLocaleString('ru-RU') + ' ₽';
      roomsVal.textContent = heroRooms + ' ' + plural(heroRooms, 'комната', 'комнаты', 'комнат');
      bathsVal.textContent = heroBaths + ' ' + plural(heroBaths, 'санузел', 'санузла', 'санузлов');
    }

    document.querySelectorAll('.stepper__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = +btn.dataset.dir;
        if (btn.dataset.step === 'rooms') heroRooms = Math.min(6, Math.max(1, heroRooms + dir));
        if (btn.dataset.step === 'baths') heroBaths = Math.min(4, Math.max(1, heroBaths + dir));
        document.querySelectorAll('.stepper__btn').forEach(b => {
          const s = b.dataset.step;
          const v = s === 'rooms' ? heroRooms : heroBaths;
          const max = s === 'rooms' ? 6 : 4;
          b.disabled = (b.dataset.dir === '-1' && v <= 1) || (b.dataset.dir === '1' && v >= max);
        });
        updateHeroPrice();
      });
    });
    heroService.addEventListener('change', updateHeroPrice);
    updateHeroPrice();
    // Начальное состояние: 1 санузел — кнопка «−» выключена
    document.querySelector('.stepper__btn[data-step="baths"][data-dir="-1"]').disabled = true;

    /* ==========================================================
       ТАБЫ «Что входит в уборку»
       ========================================================== */
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('is-active');
      });
    });

    /* ==========================================================
       КАЛЬКУЛЯТОР В БЛОКЕ «ЦЕНЫ» (по площади)
       ========================================================== */
    const RATES = {
      support:    { rate: 100, min: 5400 },   // поддерживающая, ₽/м²
      general:    { rate: 160, min: 8200 },   // генеральная, ₽/м²
      renovation: { rate: 190, min: 10900 }   // после ремонта, ₽/м²
    };
    const EXTRAS = { oven: 800, fridge: 800, microwave: 500, balcony: 1500 }; // допы, ₽
    const calcService = document.getElementById('calcService');
    const calcArea = document.getElementById('calcArea');
    const calcResult = document.getElementById('calcResult');

    function updateCalc() {
      const { rate, min } = RATES[calcService.value];
      const area = Math.max(parseInt(calcArea.value, 10) || 0, 0);
      let price = Math.max(area * rate, min);
      document.querySelectorAll('.extra-check:checked').forEach(c => {
        price += EXTRAS[c.value] || 0;
      });
      calcResult.textContent = price.toLocaleString('ru-RU') + ' ₽';
    }
    calcService.addEventListener('change', updateCalc);
    calcArea.addEventListener('input', updateCalc);
    document.querySelectorAll('.extra-check').forEach(c =>
      c.addEventListener('change', updateCalc));
    updateCalc();

    /* ==========================================================
       КНОПКИ «ЗАКАЗАТЬ» В КАРТОЧКАХ УСЛУГ
       Прокручивают к форме и подставляют тип уборки
       ========================================================== */
    const SERVICE_KEY = {
      'Поддерживающая уборка': 'support',
      'Генеральная уборка': 'general',
      'Уборка после ремонта': 'renovation'
    };
    document.querySelectorAll('[data-service]').forEach(btn => {
      btn.addEventListener('click', () => {
        const service = btn.dataset.service;
        const mainSel = document.getElementById('mainService');
        if (mainSel) mainSel.value = service;
        // В hero-калькуляторе — только типы квартирной уборки
        const key = SERVICE_KEY[service];
        if (key && heroService) {
          heroService.value = key;
          updateHeroPrice();
        }
        document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
      });
    });

    /* ==========================================================
       ФОРМЫ: валидация + отправка
       EDIT: подключите здесь реальную отправку —
       fetch на ваш backend / CRM / Telegram-бот
       ========================================================== */
    function isValidPhone(value) {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 12;
    }

    document.querySelectorAll('.lead-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;

        const phone = form.querySelector('input[name="phone"]');
        const name = form.querySelector('input[name="name"]');

        if (!isValidPhone(phone.value)) {
          phone.closest('.field').classList.add('field--error');
          valid = false;
        } else {
          phone.closest('.field').classList.remove('field--error');
        }

        if (name && name.value.trim().length === 1) {
          name.closest('.field').classList.add('field--error');
          valid = false;
        } else if (name) {
          name.closest('.field').classList.remove('field--error');
        }

        if (!valid) return;

        /* ЗДЕСЬ — ТОЧКА ИНТЕГРАЦИИ:
           отправьте данные формы на сервер, например:
           fetch('/api/lead', { method: 'POST', body: new FormData(form) }); */

        const success = form.parentElement.querySelector('.form-success');
        form.hidden = true;
        success.hidden = false;
      });

      form.querySelectorAll('input, select, textarea').forEach(el =>
        el.addEventListener('input', () =>
          el.closest('.field').classList.remove('field--error'))
      );
    });

    /* Текущий год в подвале */
    document.getElementById('year').textContent = new Date().getFullYear();
  