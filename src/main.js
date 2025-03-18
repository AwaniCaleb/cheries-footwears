// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
	// Mobile menu toggle
	setupMobileMenu();

	// Contact form handling
	setupContactForm();

	// Newsletter subscription
	setupNewsletterForm();

	// Smooth scrolling for navigation links
	setupSmoothScrolling();

	// Initialize Google Maps
	initializeMap();

	// Product filter functionality
	setupProductFilters();

	// Add animation on scroll
	setupScrollAnimations();

	// FAQ accordion functionality
	setupFaqAccordions();
});

/**
 * Mobile menu toggle functionality
 */
function setupMobileMenu() {
	const menuButton = document.querySelector('button');
	const mobileMenu = document.createElement('div');
	mobileMenu.className = 'mobile-menu hidden fixed top-16 left-0 w-full bg-white shadow-md p-4 z-20';
	mobileMenu.innerHTML = `
    <div class="flex flex-col space-y-4">
      <a href="#about" class="text-gray-600 hover:text-gray-900 p-2">About</a>
      <a href="#collections" class="text-gray-600 hover:text-gray-900 p-2">Collections</a>
      <a href="#featured" class="text-gray-600 hover:text-gray-900 p-2">Featured</a>
      <a href="#contact" class="text-gray-600 hover:text-gray-900 p-2">Contact</a>
    </div>
  `;

	document.body.appendChild(mobileMenu);

	menuButton.addEventListener('click', function () {
		mobileMenu.classList.toggle('hidden');
	});

	// Close mobile menu when clicking outside
	document.addEventListener('click', function (event) {
		if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
			mobileMenu.classList.add('hidden');
		}
	});
}

/**
 * Contact Form with Formspree Integration
 */
function setupContactForm() {
	const contactForm = document.querySelector('#contact form');

	if (contactForm) {
		// Add Formspree endpoint
		contactForm.setAttribute('action', 'https://formspree.io/f/xanenlnl');
		contactForm.setAttribute('method', 'POST');

		// Form submission handler
		contactForm.addEventListener('submit', async function (event) {
			event.preventDefault();

			// Get form data
			const formData = new FormData(contactForm);

			// Validate form before submission
			const errors = validateContactForm(formData);

			if (Object.keys(errors).length === 0) {
				// Show loading state
				const submitButton = contactForm.querySelector('button[type="submit"]');
				const originalButtonText = submitButton.innerHTML;
				submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
				submitButton.disabled = true;

				try {
					// Send form data to Formspree
					const response = await fetch(contactForm.action, {
						method: 'POST',
						body: formData,
						headers: {
							'Accept': 'application/json'
						}
					});

					const result = await response.json();

					if (response.ok) {
						// Success message
						showAlert('Thank you for your message! We will get back to you soon.', 'success');
						contactForm.reset();
					} else {
						// Error from Formspree
						showAlert('Oops! There was a problem submitting your form. ' + (result.error || ''), 'error');
					}
				} catch (error) {
					// Network or other error
					showAlert('Oops! There was a problem submitting your form. Please try again later.', 'error');
				} finally {
					// Reset button state
					submitButton.innerHTML = originalButtonText;
					submitButton.disabled = false;
				}
			} else {
				// Display validation errors
				showFormErrors(contactForm, errors);
				showAlert('Please check the form for errors.', 'error');
			}
		});
	}
}

/**
 * FAQ Accordion Functionality
 */
function setupFaqAccordions() {
	const faqToggles = document.querySelectorAll('.faq-toggle');

	faqToggles.forEach(toggle => {
		toggle.addEventListener('click', function () {
			// Get the content element that follows this toggle button
			const content = this.nextElementSibling;
			const icon = this.querySelector('.faq-icon i');

			// Toggle the visibility of the content
			content.classList.toggle('hidden');

			// Toggle the icon between plus and minus
			if (content.classList.contains('hidden')) {
				icon.classList.remove('fa-minus');
				icon.classList.add('fa-plus');
			} else {
				icon.classList.remove('fa-plus');
				icon.classList.add('fa-minus');
			}

			// Close other open FAQ items (optional - for accordion behavior)
			faqToggles.forEach(otherToggle => {
				if (otherToggle !== toggle) {
					const otherContent = otherToggle.nextElementSibling;
					const otherIcon = otherToggle.querySelector('.faq-icon i');

					if (!otherContent.classList.contains('hidden')) {
						otherContent.classList.add('hidden');
						otherIcon.classList.remove('fa-minus');
						otherIcon.classList.add('fa-plus');
					}
				}
			});
		});
	});
}

/**
 * Validate contact form fields
 */
function validateContactForm(formData) {
	const errors = {};

	// Check name
	const name = formData.get('name');
	if (!name || name.trim() === '') {
		errors.name = 'Name is required';
	}

	// Check email
	const email = formData.get('email');
	if (!email || !isValidEmail(email)) {
		errors.email = 'Valid email is required';
	}

	// Check subject
	const subject = formData.get('subject');
	if (!subject || subject.trim() === '') {
		errors.subject = 'Subject is required';
	}

	// Check message
	const message = formData.get('message');
	if (!message || message.trim() === '') {
		errors.message = 'Message is required';
	}

	return errors;
}

/**
 * Display form errors under each input
 */
function showFormErrors(form, errors) {
	// First, remove any existing error messages
	const existingErrors = form.querySelectorAll('.error-message');
	existingErrors.forEach(el => el.remove());

	// Remove error classes from inputs
	form.querySelectorAll('input, textarea').forEach(input => {
		input.classList.remove('border-red-500');
	});

	// Add new error messages
	for (const field in errors) {
		const input = form.querySelector(`[name="${field}"]`);
		if (input) {
			// Add error class to input
			input.classList.add('border-red-500');

			// Create and append error message
			const errorDiv = document.createElement('div');
			errorDiv.className = 'error-message text-red-500 text-sm mt-1';
			errorDiv.textContent = errors[field];
			input.parentNode.appendChild(errorDiv);
		}
	}
}

/**
 * Newsletter subscription form
 */
function setupNewsletterForm() {
	const newsletterForm = document.querySelector('footer form');

	if (newsletterForm) {
		newsletterForm.addEventListener('submit', function (event) {
			event.preventDefault();

			const emailInput = newsletterForm.querySelector('input[type="email"]');
			const email = emailInput.value.trim();

			if (isValidEmail(email)) {
				// Simulate form submission
				showAlert('Thank you for subscribing to our newsletter!', 'success');
				newsletterForm.reset();
			} else {
				showAlert('Please enter a valid email address.', 'error');
			}
		});
	}
}

/**
 * Form validation helper
 */
function validateForm(formData) {
	const errors = {};

	if (!formData.name || formData.name.trim() === '') {
		errors.name = 'Name is required';
	}

	if (!formData.email || !isValidEmail(formData.email)) {
		errors.email = 'Valid email is required';
	}

	if (!formData.message || formData.message.trim() === '') {
		errors.message = 'Message is required';
	}

	return errors;
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
	const alertDiv = document.createElement('div');
	alertDiv.className = `fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${type === 'success' ? 'bg-green-500' :
		type === 'error' ? 'bg-red-500' :
			'bg-blue-500'
		} text-white`;

	alertDiv.innerHTML = `
	  <div class="flex items-center">
		<div class="flex-shrink-0 mr-2">
		  ${type === 'success' ? '<i class="fas fa-check-circle"></i>' :
			type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
				'<i class="fas fa-info-circle"></i>'}
		</div>
		<div>${message}</div>
		<button class="ml-4 text-white hover:text-gray-200 focus:outline-none" aria-label="Close">
		  <i class="fas fa-times"></i>
		</button>
	  </div>
	`;

	document.body.appendChild(alertDiv);

	// Close button functionality
	const closeButton = alertDiv.querySelector('button');
	closeButton.addEventListener('click', function () {
		alertDiv.remove();
	});

	// Auto-remove after 5 seconds
	setTimeout(() => {
		if (alertDiv.parentNode) {
			alertDiv.remove();
		}
	}, 5000);
}

/**
 * Smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
	const links = document.querySelectorAll('a[href^="#"]');

	links.forEach(link => {
		link.addEventListener('click', function (event) {
			// Only prevent default if the href is not just "#"
			if (this.getAttribute('href') !== '#') {
				event.preventDefault();

				const targetId = this.getAttribute('href');
				const targetElement = document.querySelector(targetId);

				if (targetElement) {
					// Close mobile menu if open
					const mobileMenu = document.querySelector('.mobile-menu');
					if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
						mobileMenu.classList.add('hidden');
					}

					// Scroll to the target element
					window.scrollTo({
						top: targetElement.offsetTop - 80, // Adjust for fixed header
						behavior: 'smooth'
					});
				}
			}
		});
	});
}

/**
 * Initialize Google Maps
 */
function initializeMap() {
	const mapContainer = document.querySelector('#contact .h-64');

	if (mapContainer) {
		// This is a placeholder - in a real implementation, you would use the Google Maps API
		mapContainer.innerHTML = `
      <div class="w-full h-full bg-gray-800 flex items-center justify-center">
        <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3975.7893156126665!2d6.983825074979969!3d4.806199995169243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNMKwNDgnMjIuMyJOIDbCsDU5JzExLjAiRQ!5e0!3m2!1sen!2sng!4v1742278128537!5m2!1sen!2sng" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    `;

		// To implement actual Google Maps:
		// 1. Load the Google Maps JavaScript API
		// 2. Initialize the map with your API key
		// 3. Add a marker for the store location

		// Example:
		/*
		function initMap() {
		  const storeLocation = { lat: 40.7128, lng: -74.0060 }; // New York City coordinates
		  const map = new google.maps.Map(mapContainer, {
			zoom: 15,
			center: storeLocation,
			styles: [
			  // Custom map styles for a luxury look
			]
		  });
		  
		  const marker = new google.maps.Marker({
			position: storeLocation,
			map: map,
			title: "Cherie's Footwears"
		  });
		}
		*/
	}
}

/**
 * Product filter functionality
 */
function setupProductFilters() {
	// This would be implemented if you have a dedicated products page
	// For now, it's just a placeholder for future implementation

	// Example implementation:
	/*
	const filterButtons = document.querySelectorAll('.filter-button');
	const productItems = document.querySelectorAll('.product-card');
    
	filterButtons.forEach(button => {
	  button.addEventListener('click', function() {
		const filterValue = this.getAttribute('data-filter');
	    
		// Remove active class from all buttons
		filterButtons.forEach(btn => btn.classList.remove('active'));
	    
		// Add active class to current button
		this.classList.add('active');
	    
		// Filter products
		productItems.forEach(item => {
		  if (filterValue === 'all' || item.classList.contains(filterValue)) {
			item.style.display = 'block';
		  } else {
			item.style.display = 'none';
		  }
		});
	  });
	});
	*/
}

/**
 * Add animation on scroll
 */
function setupScrollAnimations() {
	const animatedElements = document.querySelectorAll('.collection-card, .product-card');

	// Simple animation on scroll
	function checkScroll() {
		animatedElements.forEach(element => {
			const elementTop = element.getBoundingClientRect().top;
			const elementVisible = 150;

			if (elementTop < window.innerHeight - elementVisible) {
				element.classList.add('animate-fadeIn');
			}
		});
	}

	// Add CSS for animation
	const style = document.createElement('style');
	style.textContent = `
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out forwards;
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    .collection-card, .product-card {
      opacity: 0;
    }
  `;
	document.head.appendChild(style);

	// Check elements on load
	window.addEventListener('load', checkScroll);

	// Check elements on scroll
	window.addEventListener('scroll', checkScroll);
}