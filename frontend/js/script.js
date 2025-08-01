// Global variables
let token = localStorage.getItem('token');
let user = null;
let stripe = null;
let elements = null;
let cardElement = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setMinDate();
    checkAuthStatus();
    
    // Initialize Stripe if available
    if (window.Stripe) {
        initializeStripe();
    }
});

function setupEventListeners() {
    // Form submissions
    document.getElementById('appointmentForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        bookAppointment();
    });

    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });

    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });

    document.getElementById('registerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

    // Payment form submission
    document.getElementById('submit-payment')?.addEventListener('click', handlePaymentForm);
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.min = today;
    }
}

function checkAuthStatus() {
    if (token) {
        loadUserProfile();
        showAuthUI();
    } else {
        showGuestUI();
    }
}

async function loadUserProfile() {
    try {
        const response = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            user = await response.json();
            updateUIWithUser(user);
        } else {
            logout();
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function showAuthUI() {
    const authButtons = document.querySelectorAll('.auth-btn');
    const userMenu = document.getElementById('userMenu');
    
    authButtons.forEach(btn => btn.style.display = 'none');
    if (userMenu) userMenu.style.display = 'block';
}

function showGuestUI() {
    const authButtons = document.querySelectorAll('.auth-btn');
    const userMenu = document.getElementById('userMenu');
    
    authButtons.forEach(btn => btn.style.display = 'block');
    if (userMenu) userMenu.style.display = 'none';
}

function updateUIWithUser(user) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }

    if (user.role === 'admin') {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) adminLink.style.display = 'block';
    }
}

async function register() {
    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        phone: document.getElementById('registerPhone').value
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('token', result.token);
            token = result.token;
            user = result.user;
            showAuthUI();
            updateUIWithUser(result.user);
            closeModal('registerModal');
            alert('Registration successful!');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        alert('Error registering. Please try again.');
        console.error('Error:', error);
    }
}

async function login() {
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('token', result.token);
            token = result.token;
            user = result.user;
            showAuthUI();
            updateUIWithUser(result.user);
            closeModal('loginModal');
            alert('Login successful!');
            
            if (result.user.role === 'admin') {
                window.location.href = 'admin/index.html';
            }
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        alert('Error logging in. Please try again.');
        console.error('Error:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    user = null;
    showGuestUI();
    window.location.href = 'index.html';
}

async function bookAppointment() {
    const formData = {
        patientName: document.getElementById('patientName').value,
        email: document.getElementById('patientEmail').value,
        phone: document.getElementById('patientPhone').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        service: document.getElementById('service').value,
        message: document.getElementById('appointmentMessage').value
    };

    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Appointment booked successfully!');
            document.getElementById('appointmentForm').reset();
            closeModal('appointmentModal');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        alert('Error booking appointment. Please try again.');
        console.error('Error:', error);
    }
}

async function sendMessage() {
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        alert('Error sending message. Please try again.');
        console.error('Error:', error);
    }
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Stripe Payment Integration
function initializeStripe() {
    stripe = Stripe('pk_test_your_stripe_publishable_key_here');
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');
}

async function handlePaymentForm() {
    // This would be called when user wants to pay
    // You would pass appointmentId and amount here
    // await handlePayment(appointmentId, amount);
}

// Placeholder for payment handling
async function handlePayment(appointmentId, amount) {
    try {
        // Create payment intent
        const { clientSecret } = await createPaymentIntent(appointmentId, amount);
        
        // Confirm payment
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: user.name,
                    email: user.email
                }
            }
        });

        if (result.error) {
            document.getElementById('payment-errors').textContent = result.error.message;
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                // Confirm payment on backend
                await confirmPayment(appointmentId, result.paymentIntent.id);
                alert('Payment successful!');
                closeModal('paymentModal');
            }
        }
    } catch (error) {
        console.error('Payment error:', error);
        document.getElementById('payment-errors').textContent = 'Payment failed. Please try again.';
    }
}

async function createPaymentIntent(appointmentId, amount) {
    try {
        const response = await fetch('/api/payment/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId: appointmentId,
                amount: amount
            })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
}

async function confirmPayment(appointmentId, paymentIntentId) {
    try {
        const response = await fetch('/api/payment/confirm-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId: appointmentId,
                paymentIntentId: paymentIntentId
            })
        });

        return await response.json();
    } catch (error) {
        console.error('Error confirming payment:', error);
        throw error;
    }
}
