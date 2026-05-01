(() => {
  const PAYSTACK_PUBLIC_KEY = 'pk_test_replace_with_your_paystack_public_key';
  const PAYSTACK_MONTHLY_PLANS = {
    '₦5,000': '',
    '₦15,000': '',
    '₦30,000': '',
    '₦50,000': '',
    '₦100,000': '',
    '₦250,000': '',
  };
  const mobileNav = document.getElementById('mobileNav');

  const parseNairaAmount = (amount) => Number(String(amount).replace(/[^0-9]/g, ''));

  const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

  const makeReference = () => `ABRF-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPaystackEmail = () => {
    const emailInput = document.getElementById('donorEmail');

    if (emailInput) {
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        emailInput.focus();
        alert('Please enter a valid email address for your Paystack receipt.');
        return '';
      }

      return email;
    }

    const email = prompt('Enter your email address for your Paystack receipt:')?.trim() || '';
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address before continuing.');
      return '';
    }

    return email;
  };

  const startPaystackCheckout = ({ amount, email, label, frequency = 'One-time', plan = '' }) => {
    const nairaAmount = parseNairaAmount(amount);

    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('replace_with_your_paystack_public_key')) {
      alert('Paystack is almost ready. Replace PAYSTACK_PUBLIC_KEY in js/main.js with your Paystack public key.');
      return;
    }

    if (!window.PaystackPop) {
      alert('Paystack could not load. Please check your internet connection and try again.');
      return;
    }

    if (!nairaAmount) {
      alert('Please choose or enter a valid donation amount.');
      return;
    }

    if (frequency === 'Monthly' && !plan) {
      alert('Monthly Paystack donations need a Paystack plan code. Add a plan code in js/main.js or choose One-time.');
      return;
    }

    const config = {
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: nairaAmount * 100,
      currency: 'NGN',
      ref: makeReference(),
      label: label || 'AbdulSalam Bello Raji Foundation Donation',
      metadata: {
        custom_fields: [
          {
            display_name: 'Giving Frequency',
            variable_name: 'giving_frequency',
            value: frequency,
          },
          {
            display_name: 'Program',
            variable_name: 'program',
            value: label || 'General Donation',
          },
        ],
      },
      callback(response) {
        alert(`Thank you for supporting AbdulSalam Bello Raji Foundation. Payment reference: ${response.reference}`);
      },
      onClose() {
        alert('Payment window closed. You can try again whenever you are ready.');
      },
    };

    if (plan) config.plan = plan;

    window.PaystackPop.setup(config).openIframe();
  };

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
      selectedAmount = formatNaira(digits);
    } else {
      const defaultAmount = document.querySelectorAll('.amount')[1];
      selectedAmount = defaultAmount?.dataset.amount || '₦15,000';
      defaultAmount?.classList.add('active');
    }

    updateDonateBtn();
  });

  donateBtn?.addEventListener('click', () => {
    const email = getPaystackEmail();
    if (!email) return;

    startPaystackCheckout({
      amount: selectedAmount,
      email,
      frequency: selectedFreq,
      label: 'General Donation',
      plan: selectedFreq === 'Monthly' ? PAYSTACK_MONTHLY_PLANS[selectedAmount] || '' : '',
    });
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
      const email = getPaystackEmail();
      if (!email) return;

      startPaystackCheckout({
        amount,
        email,
        frequency: 'Monthly',
        label: `${plan} Plan`,
        plan: button.dataset.paystackPlan || '',
      });
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
