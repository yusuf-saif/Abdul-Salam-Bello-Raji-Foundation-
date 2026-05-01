(() => {
  const mobileNav = document.getElementById('mobileNav');

  const openMenu = () => {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.js-open-menu').forEach((button) => {
    button.addEventListener('click', openMenu);
  });

  document.querySelectorAll('.js-close-menu').forEach((button) => {
    button.addEventListener('click', closeMenu);
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  const donateBtn = document.getElementById('donateBtn');
  const customAmount = document.getElementById('customAmount');
  let selectedAmount = document.querySelector('.amount.active')?.dataset.amount || '₦15,000';
  let selectedFreq = document.querySelector('.freq-toggle button.active')?.dataset.freq || 'Monthly';

  const updateDonateBtn = () => {
    if (!donateBtn) return;
    const freqLabel = selectedFreq === 'Monthly' ? ' monthly' : '';
    donateBtn.innerHTML = `Give ${selectedAmount}${freqLabel} <span class="arrow">→</span>`;
  };

  document.querySelectorAll('.freq-toggle button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.freq-toggle button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      selectedFreq = button.dataset.freq || 'Monthly';
      updateDonateBtn();
    });
  });

  document.querySelectorAll('.amount').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.amount').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      selectedAmount = button.dataset.amount || button.textContent.trim();
      if (customAmount) customAmount.value = '';
      updateDonateBtn();
    });
  });

  customAmount?.addEventListener('input', () => {
    document.querySelectorAll('.amount').forEach((button) => button.classList.remove('active'));
    const digits = customAmount.value.replace(/[^0-9]/g, '');

    if (digits) {
      selectedAmount = '₦' + Number(digits).toLocaleString();
    } else {
      const defaultAmount = document.querySelectorAll('.amount')[1];
      selectedAmount = defaultAmount?.dataset.amount || '₦15,000';
      defaultAmount?.classList.add('active');
    }

    updateDonateBtn();
  });

  donateBtn?.addEventListener('click', () => {
    alert(`Thank you for your generosity!\n\nAmount: ${selectedAmount}\nFrequency: ${selectedFreq}\n\nYou'll be redirected to our secure payment page.`);
  });

  document.querySelectorAll('.nl-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button');
      const input = form.querySelector('input');
      if (button) button.textContent = 'Subscribed ✓';
      if (input) input.disabled = true;
      form.classList.add('is-subscribed');
    });
  });

  document.querySelectorAll('.tier-cta').forEach((button) => {
    button.addEventListener('click', () => {
      const plan = button.dataset.plan;
      const amount = button.dataset.amount;
      alert(`Thank you for choosing the ${plan} Plan!\n\nMonthly gift: ${amount}\n\nYou'll be redirected to our secure payment page to complete your recurring gift setup.`);
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach((element) => observer.observe(element));
  } else {
    revealEls.forEach((element) => element.classList.add('visible'));
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
      });

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    });
  }
})();
