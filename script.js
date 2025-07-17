document.addEventListener('DOMContentLoaded', function() {
    const welcomeContainer = document.getElementById('welcome-container');
    const welcomeNameInput = document.getElementById('welcome-name');
    const welcomeEmailInput = document.getElementById('welcome-email');
    const welcomeSubmitButton = document.getElementById('welcome-submit');
    const welcomeError = document.getElementById('welcome-error');

    const mfaContainer = document.getElementById('mfa-container');
    const mfaEmailInput = document.getElementById('mfa-email');
    const mfaEmailSubmitButton = document.getElementById('mfa-email-submit');
    const mfaEmailError = document.getElementById('mfa-email-error');
    const mfaSetupSection = document.getElementById('mfa-setup-section');
    const mfaQrCode = document.getElementById('mfa-qr-code');
    const mfaSecretKey = document.getElementById('mfa-secret-key');
    const mfaCodeInput = document.getElementById('mfa-code');
    const mfaVerifyButton = document.getElementById('mfa-verify-button');
    const mfaVerifyError = document.getElementById('mfa-verify-error');
    const mfaVerifySuccess = document.getElementById('mfa-verify-success');
    const mfaLoader = document.getElementById('mfa-loader');

    const mainContent = document.getElementById('main-content');
    const mainWrapper = document.getElementById('main-wrapper');
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.querySelector('.openbtn');
    const closeBtn = document.querySelector('.closebtn');

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
        mfaContainer.style.display = 'block';
        mfaEmailInput.value = userEmail; // Pre-fill MFA email input
    });

    // MFA email submit handler (for re-entering email if needed)
    mfaEmailSubmitButton.addEventListener('click', async function() {
        const email = mfaEmailInput.value.trim();
        mfaEmailError.style.display = 'none';
        mfaLoader.style.display = 'none';
        mfaSetupSection.style.display = 'none';
        mfaQrCode.style.display = 'none';
        mfaSecretKey.innerText = '';

        if (!email) {
            mfaEmailError.innerText = 'Email cannot be empty.';
            mfaEmailError.style.display = 'block';
            return;
        }

        if (!isValidEmail(email)) {
            mfaEmailError.innerText = 'Invalid email domain. Only @gmail.com and @yahoo.com are allowed.';
            mfaEmailError.style.display = 'block';
            return;
        }

        userEmail = email;
        mfaLoader.style.display = 'block';

        try {
            const response = await fetch(`http://127.0.0.1:5000/mfa/setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });
            const data = await response.json();

            if (data.secret) {
                // Clear previous QR code
                mfaQrCode.innerHTML = '';
                // Generate QR code using qrcode.js
                new QRCode(mfaQrCode, {
                    text: data.provisioning_uri,
                    width: 200,
                    height: 200,
                });
                mfaSecretKey.innerText = data.secret;
                mfaSetupSection.style.display = 'block';
            } else if (data.error) {
                mfaEmailError.innerText = `Error: ${data.error}`;
                mfaEmailError.style.display = 'block';
            } else {
                mfaEmailError.innerText = 'Failed to set up MFA. Unexpected response.';
                mfaEmailError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error setting up MFA:', error);
            mfaEmailError.innerText = 'Failed to set up MFA. Check console for details.';
            mfaEmailError.style.display = 'block';
        } finally {
            mfaLoader.style.display = 'none';
        }
    });

    // MFA code verification handler
    mfaVerifyButton.addEventListener('click', async function() {
        const mfaCode = mfaCodeInput.value.trim();
        mfaVerifyError.style.display = 'none';
        mfaVerifySuccess.style.display = 'none';
        mfaLoader.style.display = 'block';

        if (!mfaCode) {
            mfaVerifyError.innerText = 'Please enter the 6-digit code.';
            mfaVerifyError.style.display = 'block';
            mfaLoader.style.display = 'none';
            return;
        }

        // MFA Bypass
        if (mfaCode === '101010') {
            mfaVerifySuccess.innerText = 'Bypass successful! Redirecting...';
            mfaVerifySuccess.style.display = 'block';
            mfaContainer.style.display = 'none';
            mainWrapper.style.display = 'block'; // Show main content
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/mfa/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail, code: mfaCode })
            });
            const data = await response.json();

            if (data.verified) {
                mfaVerifySuccess.innerText = 'MFA verified successfully! Redirecting...';
                mfaVerifySuccess.style.display = 'block';
                mfaContainer.style.display = 'none';
                mainWrapper.style.display = 'block'; // Show main content
            } else if (data.error) {
                mfaVerifyError.innerText = `Verification failed: ${data.error}`;
                mfaVerifyError.style.display = 'block';
            } else {
                mfaVerifyError.innerText = 'Verification failed. Invalid code or unexpected response.';
                mfaVerifyError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error verifying MFA code:', error);
            mfaVerifyError.innerText = 'Failed to verify MFA code. Check console for details.';
            mfaVerifyError.style.display = 'block';
        } finally {
            mfaLoader.style.display = 'none';
        }
    });

    // Initial state: show welcome screen
    welcomeContainer.style.display = 'block';
    mfaContainer.style.display = 'none';
    mainContent.style.display = 'none';
    mainWrapper.style.display = 'block'; // Ensure mainWrapper is visible
});