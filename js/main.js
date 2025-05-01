/**
 * Main JavaScript file for Ven Perov Photography Website
 * Includes common functionality and page-specific initializations.
 * Ensure external libraries (Isotope, imagesLoaded, PhotoSwipe) are loaded before this script.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Debug log

    // --- Common Functionality ---

    /**
     * Mobile Menu Toggle Functionality
     */
    const initMobileMenu = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinksMobile = mobileMenu ? mobileMenu.querySelectorAll('.nav-link') : [];

        if (mobileMenuButton && mobileMenu) {
            console.log('Initializing mobile menu'); // Debug log
            const menuIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
            const closeIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

            const toggleMenu = (show) => {
                const isExpanded = show;
                mobileMenu.classList.toggle('hidden', !isExpanded);
                mobileMenuButton.setAttribute('aria-expanded', String(isExpanded)); // Use string for attribute
                mobileMenuButton.innerHTML = isExpanded ? closeIcon : menuIcon;
            };

            mobileMenuButton.addEventListener('click', () => {
                const isCurrentlyExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                toggleMenu(!isCurrentlyExpanded);
            });

            // Close mobile menu when a link inside it is clicked
            navLinksMobile.forEach(link => {
                link.addEventListener('click', () => {
                    toggleMenu(false); // Close menu
                });
            });
        } else {
            console.warn("Mobile menu elements (#mobile-menu-button or #mobile-menu) not found.");
        }
    };

    /**
     * Active Navigation Link Highlighting
     */
    const initActiveNav = () => {
        console.log('Initializing active navigation highlighting'); // Debug log
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length === 0) {
            console.warn("No elements with class 'nav-link' found for highlighting.");
            return;
        }

        try {
            const path = window.location.pathname;
            // Handle potential trailing slash and default to index
            const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
            const currentPageIdentifier = pageName.replace('.html', '');

            console.log(`Current page identifier: ${currentPageIdentifier}`); // Debug log

            navLinks.forEach(link => {
                const linkDataPage = link.getAttribute('data-page');
                // Remove active state initially
                link.classList.remove('nav-active');
                link.removeAttribute('aria-current');

                // Add active state if data-page matches
                if (linkDataPage === currentPageIdentifier) {
                    link.classList.add('nav-active');
                    link.setAttribute('aria-current', 'page');
                     console.log(`Activating link for page: ${linkDataPage}`); // Debug log
                }
            });
        } catch (error) {
             console.error("Error during active navigation highlighting:", error);
        }
    };

    /**
     * Update Footer Copyright Year
     */
    const initFooterYear = () => {
        console.log('Initializing footer year'); // Debug log
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        } else {
             console.warn("Element with ID 'current-year' not found.");
        }
    };

    /**
     * Fade-in Animation on Scroll using Intersection Observer
     */
    const initFadeInAnimation = () => {
        console.log('Initializing fade-in animations'); // Debug log
        const fadeSections = document.querySelectorAll('.fade-in-section');
        if (fadeSections.length > 0) {
            if ('IntersectionObserver' in window) {
                const sectionObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target); // Stop observing once visible
                        }
                    });
                }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

                fadeSections.forEach(section => {
                    sectionObserver.observe(section);
                });
            } else {
                // Fallback for older browsers: just make sections visible immediately
                console.warn("IntersectionObserver not supported, showing all fade-in sections.");
                fadeSections.forEach(section => section.classList.add('is-visible'));
            }
        } else {
             console.log("No elements with class 'fade-in-section' found."); // Info log
        }
    };


    // --- Page-Specific Initializations ---

    /**
     * Initializes Portfolio Functionality (Isotope Filtering & PhotoSwipe Lightbox)
     */
    const initPortfolio = () => {
        console.log('Attempting to initialize Portfolio JS'); // Debug log
        const portfolioContainer = document.getElementById('portfolio-container');
        const filterButtons = document.querySelectorAll('.portfolio-filter-button');

        // Check if necessary elements and libraries exist
        const isotopeExists = typeof Isotope !== 'undefined';
        const imagesLoadedExists = typeof imagesLoaded !== 'undefined';
        const photoSwipeExists = typeof PhotoSwipeLightbox !== 'undefined';

        if (!portfolioContainer) {
             console.warn("Portfolio container (#portfolio-container) not found.");
             return;
        }
        if (!isotopeExists) {
             console.error("Isotope library not found. Filtering/Layout will not work.");
             // Optionally provide fallback layout styles or message
        }
         if (!imagesLoadedExists) {
             console.warn("imagesLoaded library not found. Masonry layout might be imperfect initially.");
        }
        if (!photoSwipeExists) {
             console.warn("PhotoSwipeLightbox library not found. Lightbox will not work.");
        }

        let iso; // Isotope instance

        // Initialize Isotope only if library and container exist
        if (isotopeExists) {
            // Use imagesLoaded to ensure layout is correct after images load
            const imgLoad = imagesLoaded( portfolioContainer );

            imgLoad.on( 'always', function() {
                console.log('imagesLoaded complete, initializing Isotope'); // Debug log
                try {
                    iso = new Isotope(portfolioContainer, {
                        itemSelector: '.portfolio-item',
                        layoutMode: 'masonry',
                        percentPosition: true,
                        masonry: {
                            // columnWidth: '.portfolio-item', // Let Isotope determine
                            gutter: 0 // Gutter handled by margin in CSS
                        },
                        transitionDuration: '0.6s'
                    });

                    // Add filter button listeners only if Isotope initialized
                    if (filterButtons.length > 0) {
                        filterButtons.forEach(button => {
                            button.addEventListener('click', () => {
                                const filterValue = button.getAttribute('data-filter');
                                console.log(`Filtering by: ${filterValue}`); // Debug log
                                iso.arrange({ filter: filterValue });

                                // Update active button state
                                filterButtons.forEach(btn => btn.classList.remove('active'));
                                button.classList.add('active');
                            });
                        });
                    } else {
                        console.warn("No filter buttons found.");
                    }
                } catch (error) {
                     console.error("Error initializing Isotope:", error);
                }
            });
            imgLoad.on( 'fail', function() {
                console.error( 'imagesLoaded failed, Isotope layout might be incorrect.' );
                // Still try to initialize Isotope as a fallback
                 try {
                    iso = new Isotope(portfolioContainer, { itemSelector: '.portfolio-item', layoutMode: 'masonry' });
                 } catch (error) {
                     console.error("Fallback Isotope initialization failed:", error);
                 }
            });

        }

        // Initialize PhotoSwipe only if library exists
        if (photoSwipeExists) {
            console.log('Initializing PhotoSwipe'); // Debug log
            try {
                const lightbox = new PhotoSwipeLightbox({
                    gallery: '#portfolio-container',
                    children: 'a', // Links wrapping the images
                    // Ensure PhotoSwipe core module is loaded (adjust path/method as needed)
                    pswpModule: PhotoSwipe
                    // Example using dynamic import (if PhotoSwipe loaded async):
                    // pswpModule: () => import('/path/to/photoswipe.esm.js')
                });

                // Optional: Enhance captions using figcaption or alt text
                lightbox.on('uiRegister', function() {
                    lightbox.pswp.ui.registerElement({
                        name: 'custom-caption',
                        order: 9,
                        isButton: false,
                        appendTo: 'root', // Append caption to the root PhotoSwipe element
                        html: '', // Start empty
                        onInit: (el, pswp) => {
                            pswp.on('change', () => {
                                const currSlideElement = pswp.currSlide?.data?.element; // Safely access element
                                let captionHTML = '';
                                if (currSlideElement) {
                                    const figcaption = currSlideElement.querySelector('figcaption');
                                    if (figcaption) {
                                        captionHTML = figcaption.innerHTML;
                                    } else {
                                        // Fallback to image alt text
                                        const img = currSlideElement.querySelector('img');
                                        captionHTML = img ? img.getAttribute('alt') : '';
                                    }
                                }
                                // Use class for styling PhotoSwipe captions
                                el.innerHTML = captionHTML ? `<div class="pswp__caption--custom">${captionHTML}</div>` : '';
                            });
                        }
                    });
                });

                lightbox.init();
            } catch (error) {
                 console.error("Error initializing PhotoSwipe:", error);
            }
        }
    };

    /**
     * Initializes Contact Form Functionality (Validation & Service Pre-select)
     */
    const initContactForm = () => {
        console.log('Attempting to initialize Contact Form JS'); // Debug log
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        const serviceSelect = document.getElementById('service');

        // --- Pre-select Service Dropdown ---
        if (serviceSelect) {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const serviceParam = urlParams.get('service');
                if (serviceParam) {
                    const optionToSelect = Array.from(serviceSelect.options).find(option => option.value.toLowerCase() === serviceParam.toLowerCase());
                    if (optionToSelect) {
                        serviceSelect.value = optionToSelect.value;
                        console.log(`Pre-selected service: ${serviceSelect.value}`); // Debug log
                    } else {
                        console.warn(`Service parameter "${serviceParam}" not found in dropdown.`);
                    }
                }
            } catch (error) {
                console.error("Error processing service selection from URL:", error);
            }
        } else {
             console.log("Service select dropdown not found."); // Info log
        }

        // --- Form Validation ---
        if (contactForm && formStatus) {
            console.log('Setting up form validation'); // Debug log
            const formElements = Array.from(contactForm.elements).filter(el => ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

            const isRequired = value => value.trim() !== '';
            const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const isPhone = value => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value); // Basic check

            const validateField = (field) => {
                const value = field.value;
                const errorElement = document.getElementById(`${field.id}-error`);
                let isValid = true;
                let errorMessage = '';

                field.setAttribute('aria-invalid', 'false');
                if (errorElement) errorElement.textContent = '';

                if (field.required && !isRequired(value)) {
                    isValid = false;
                    errorMessage = 'This field is required.';
                } else if (field.type === 'email' && value && !isEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                } else if (field.type === 'tel' && value && !isPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number format.';
                }

                if (!isValid) {
                    field.setAttribute('aria-invalid', 'true');
                    if (errorElement) errorElement.textContent = errorMessage;
                     console.log(`Validation failed for ${field.id}: ${errorMessage}`); // Debug log
                }
                return isValid;
            };

            // Add blur listeners
            formElements.forEach(field => {
                if (field.type !== 'hidden' && field.name !== 'bot-field') {
                    field.addEventListener('blur', () => validateField(field));
                }
            });

            // Add submit listener
            contactForm.addEventListener('submit', (e) => {
                formStatus.textContent = ''; // Clear previous status
                let isFormValid = true;

                // Validate all fields on submit
                formElements.forEach(field => {
                    if (field.type !== 'hidden' && field.name !== 'bot-field') {
                        if (!validateField(field)) {
                            isFormValid = false; // Mark form as invalid if any field fails
                        }
                    }
                });

                if (!isFormValid) {
                    e.preventDefault(); // Stop Netlify/backend submission
                    formStatus.textContent = 'Please correct the errors highlighted above.';
                    formStatus.className = 'mt-4 text-left text-sm font-medium text-red-600'; // Use variables? --color-error-text
                     console.log('Form submission prevented due to validation errors.'); // Debug log
                    // Optionally find and focus the first invalid field
                    const firstInvalidField = formElements.find(el => el.getAttribute('aria-invalid') === 'true');
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                    }
                } else {
                    // Form is valid according to JS, allow submission
                    formStatus.textContent = 'Sending your message...';
                    formStatus.className = 'mt-4 text-left text-sm font-medium text-blue-600'; // Style for sending
                     console.log('Form validation passed, allowing submission.'); // Debug log
                    // Netlify (or backend) will handle the actual submission and redirect/response
                }
            });

             // Handle potential success message display after redirect (optional)
             try {
                 const urlParams = new URLSearchParams(window.location.search);
                 if (urlParams.get('submission') === 'success') { // Example parameter
                     formStatus.textContent = 'Thank you! Your message has been sent successfully. I\'ll be in touch soon.';
                     formStatus.className = 'mt-4 text-left text-sm font-medium text-green-600 p-4 bg-green-50 border border-green-200 rounded-md'; // Success styling
                     // Optionally clear the form if needed, though redirect usually handles this
                     // contactForm.reset();
                 }
             } catch(error) {
                 console.error("Error checking for submission status in URL:", error);
             }

        } else {
             console.warn("Contact form (#contact-form) or status element (#form-status) not found.");
        }
    };


    // --- Initialize Common Functionality ---
    initMobileMenu();
    initActiveNav();
    initFooterYear();
    initFadeInAnimation();

    // --- Initialize Page-Specific Functionality Conditionally ---
    if (document.getElementById('portfolio-container')) {
        initPortfolio();
    }
    if (document.getElementById('contact-form')) {
        initContactForm();
    }

}); // End DOMContentLoaded
