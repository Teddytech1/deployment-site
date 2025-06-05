document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeDarkRed = document.getElementById('themeDarkRed');
    const themeWhiteRed = document.getElementById('themeWhiteRed');
    const themeBlackRed = document.getElementById('themeBlackRed');
    const body = document.body;

    themeDarkRed.addEventListener('click', function() {
        body.className = 'dark-red-theme';
        setActiveThemeButton(this);
    });

    themeWhiteRed.addEventListener('click', function() {
        body.className = 'white-red-theme';
        setActiveThemeButton(this);
    });

    themeBlackRed.addEventListener('click', function() {
        body.className = 'black-red-theme';
        setActiveThemeButton(this);
    });

    function setActiveThemeButton(button) {
        document.querySelectorAll('.theme-toggle button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    // Form elements
    const loginForm = document.getElementById('loginFormInner');
    const registerForm = document.getElementById('regForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    // Modal elements
    const modal = document.getElementById('successModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Form toggle functionality
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        animateFormSwitch();
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
        animateFormSwitch();
    });

    function animateFormSwitch() {
        const activeForm = document.querySelector('.form-wrapper.active');
        activeForm.classList.remove('animate__fadeIn');
        activeForm.classList.add('animate__fadeIn');
    }

    // Modal close functionality
    function closeModalFunc() {
        modal.style.display = 'none';
    }

    modalCloseBtn.addEventListener('click', closeModalFunc);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        
        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showModal('ERROR', 'Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showModal('ERROR', 'Passwords do not match');
            return;
        }
        
        if (localStorage.getItem(email)) {
            showModal('ERROR', 'Email already registered');
            return;
        }
        
        // Save user data
        const user = {
            name,
            email,
            phone,
            password,
            orders: []
        };
        
        localStorage.setItem(email, JSON.stringify(user));
        
        // Update users list
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(email);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success and switch to login
        showModal('SUCCESS', 'Account created successfully!');
        registerForm.reset();
        setTimeout(() => {
            closeModalFunc();
            document.getElementById('registerForm').classList.remove('active');
            document.getElementById('loginForm').classList.add('active');
        }, 2000);
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = JSON.parse(localStorage.getItem(email));
        
        if (user && user.password === password) {
            localStorage.setItem('currentUser', email);
            // Animate before redirect
            document.querySelector('.auth-container').classList.add('animate__fadeOut');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            showModal('LOGIN FAILED', 'Invalid email or password');
        }
    });

    // Modal display function
    function showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        modal.style.display = 'flex';
        
        // Add animation class
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.remove('animate__zoomIn');
        void modalContent.offsetWidth; // Trigger reflow
        modalContent.classList.add('animate__zoomIn');
    }

    // Add float-up animation to form inputs
    const inputs = document.querySelectorAll('.input-group');
    inputs.forEach((input, index) => {
        input.style.opacity = '0';
        input.style.transform = 'translateY(20px)';
        input.style.animation = `floatUp 0.5s ease-out ${index * 0.1}s forwards`;
    });
});
