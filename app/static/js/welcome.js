document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll & Active Nav Link
    const navLinks = document.querySelectorAll('.main-nav a.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    function changeLinkState() {
        let currentSectionId = '';
        const offset = window.innerHeight * 0.4; // Trigger when 40% of the section is visible

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - offset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', changeLinkState);
        changeLinkState();
    }

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });

                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                         mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    const pricingPlans = document.querySelectorAll('.pricing-plan');

    pricingPlans.forEach(plan => {
        const billingToggles = plan.querySelectorAll('.billing-toggle .toggle-option');
        const priceAmountEl = plan.querySelector('.price-tag .amount');
        const pricePeriodEl = plan.querySelector('.price-tag .period');

        if (!priceAmountEl || !pricePeriodEl || billingToggles.length === 0) return;

        const monthlyPrice = priceAmountEl.dataset.monthlyPrice;
        const yearlyPrice = priceAmountEl.dataset.yearlyPrice;
        const monthlyPeriod = pricePeriodEl.dataset.monthlyPeriod;
        const yearlyPeriod = pricePeriodEl.dataset.yearlyPeriod;


        billingToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {

                billingToggles.forEach(t => t.classList.remove('active'));

                toggle.classList.add('active');

                const selectedPeriod = toggle.dataset.period;

                if (selectedPeriod === 'monthly') {
                    priceAmountEl.textContent = monthlyPrice;
                    pricePeriodEl.textContent = monthlyPeriod;
                } else if (selectedPeriod === 'yearly') {
                    priceAmountEl.textContent = yearlyPrice;
                    pricePeriodEl.textContent = yearlyPeriod;
                }
            });
        });
    });

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const testimonialSliderContainer = document.querySelector('.testimonial-slider-container');
    if (testimonialSliderContainer) {
        const scrollWrapper = testimonialSliderContainer.querySelector('.testimonial-scroll-wrapper');
        const testimonialsGrid = testimonialSliderContainer.querySelector('.testimonials-grid');
        const prevArrow = testimonialSliderContainer.querySelector('.prev-arrow');
        const nextArrow = testimonialSliderContainer.querySelector('.next-arrow');

        if (scrollWrapper && testimonialsGrid && prevArrow && nextArrow) {
            const cardGap = parseFloat(getComputedStyle(testimonialsGrid).gap) || 32;
            
            const getScrollAmount = () => {

                const firstCard = testimonialsGrid.querySelector('.testimonial-card');
                if (firstCard) {
                    return firstCard.offsetWidth + cardGap;
                }
                return 340 + cardGap;
            };


            const updateArrowState = () => {
                if (!scrollWrapper) return;
                const scrollLeft = scrollWrapper.scrollLeft;
                const scrollWidth = scrollWrapper.scrollWidth;
                const clientWidth = scrollWrapper.clientWidth;

                prevArrow.disabled = scrollLeft <= 10;
                nextArrow.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
            };

            prevArrow.addEventListener('click', () => {
                scrollWrapper.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });

            nextArrow.addEventListener('click', () => {
                scrollWrapper.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });

            // Обновляем состояние стрелок при загрузке и после каждого скролла (включая скролл пальцем)
            scrollWrapper.addEventListener('scroll', updateArrowState);
            
            // Инициализация состояния стрелок
            // Небольшая задержка, чтобы DOM успел полностью отрисоваться и размеры были корректны
            setTimeout(updateArrowState, 100);
            
            // Обновление состояния стрелок при изменении размера окна
            window.addEventListener('resize', () => {
                setTimeout(updateArrowState, 100);
            });
        }
    }
});