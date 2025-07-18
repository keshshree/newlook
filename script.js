document.addEventListener('DOMContentLoaded', function() {
    const welcomeContainer = document.getElementById('welcome-container');
    const welcomeNameInput = document.getElementById('welcome-name');
    const welcomeEmailInput = document.getElementById('welcome-email');
    const welcomeSubmitButton = document.getElementById('welcome-submit');
    const welcomeError = document.getElementById('welcome-error');

    const emailVerificationContainer = document.getElementById('email-verification-container');
    const verificationCodeInput = document.getElementById('verification-code');
    const verifyCodeButton = document.getElementById('verify-code-button');
    const verificationError = document.getElementById('verification-error');
    const verificationSuccess = document.getElementById('verification-success');
    const verificationLoader = document.getElementById('verification-loader');

    const mainContent = document.getElementById('main-content');
    const mainWrapper = document.getElementById('main-wrapper');
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.querySelector('.openbtn');
    const closeBtn = document.querySelector('.closebtn');
    const servicesToggle = document.querySelector('.services-toggle');
    const submenu = document.querySelector('.submenu');

    let userEmail = '';

    // Sidebar functions
    function openNav() {
        if (sidebar) {
            sidebar.style.width = "250px";
        }
        if (mainWrapper) {
            mainWrapper.style.marginLeft = "250px";
        }
    }

    function closeNav() {
        if (sidebar) {
            sidebar.style.width = "0";
        }
        if (mainWrapper) {
            mainWrapper.style.marginLeft = "0";
        }
    }

    // Toggle services submenu
    if (servicesToggle && submenu) {
        servicesToggle.addEventListener('click', function(event) {
            event.preventDefault();
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            servicesToggle.classList.toggle('active');
        });
    }

// ✅ Attach listeners
if (openBtn) {
  openBtn.addEventListener("click", openNav);
  console.log("openBtn found and event listener added.");
} else {
  console.error("openBtn not found!");
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeNav);
  console.log("closeBtn found and event listener added.");
} else {
  console.error("closeBtn not found!");
}

    // Function to validate email domain
    function isValidEmail(email) {
        const allowedDomains = ['@gmail.com', '@yahoo.com'];
        return allowedDomains.some(domain => email.endsWith(domain));
    }

    // Welcome screen submit handler
    welcomeSubmitButton.addEventListener('click', function() {
        const name = welcomeNameInput.value.trim();
        const email = welcomeEmailInput.value.trim();

        welcomeError.style.display = 'none';

        if (!name || !email) {
            welcomeError.innerText = 'Name and Email cannot be empty.';
            welcomeError.style.display = 'block';
            return;
        }

        if (!isValidEmail(email)) {
            welcomeError.innerText = 'Invalid email domain. Only @gmail.com and @yahoo.com are allowed.';
            welcomeError.style.display = 'block';
            return;
        }

        userEmail = email;
        welcomeContainer.style.display = 'none';
        emailVerificationContainer.style.display = 'block';
        // In a real application, you would send the verification email here
        console.log(`Sending verification code to ${userEmail}`);
    });

    // Email verification code handler
    verifyCodeButton.addEventListener('click', async function() {
        const verificationCode = verificationCodeInput.value.trim();
        verificationError.style.display = 'none';
        verificationSuccess.style.display = 'none';
        verificationLoader.style.display = 'block';

        if (!verificationCode) {
            verificationError.innerText = 'Please enter the 7-digit code.';
            verificationError.style.display = 'block';
            verificationLoader.style.display = 'none';
            return;
        }

        // Simulate verification (replace with actual API call)
        if (verificationCode === '1234567') { // Example valid code
            verificationSuccess.innerText = 'Verification successful! Redirecting...';
            verificationSuccess.style.display = 'block';
            emailVerificationContainer.style.display = 'none';
            mainContent.style.display = 'block'; // Show main content
        } else {
            verificationError.innerText = 'Invalid verification code.';
            verificationError.style.display = 'block';
        }
        verificationLoader.style.display = 'none';
    });

    // Initial state: show welcome screen
    welcomeContainer.style.display = 'block';
    emailVerificationContainer.style.display = 'none';
    mainContent.style.display = 'none';
    mainWrapper.style.display = 'block'; // Ensure mainWrapper is visible
});