// Universal Enter key handler for both Login and Register pages
// Works on both pages by detecting which elements exist

document.addEventListener('DOMContentLoaded', function() {
    // Handle Enter key press on form inputs
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            // Check if we're on the login page
            const loginButton = document.getElementById('loginButton');
            if (loginButton) {
                event.preventDefault();
                loginButton.click();
                return;
            }
            
            // Check if we're on the register page
            const registerForm = document.getElementById('registerForm');
            if (registerForm) {
                // Find the submit button in the register form
                const registerButton = registerForm.querySelector('button[type="submit"]');
                if (registerButton) {
                    event.preventDefault();
                    registerButton.click();
                    return;
                }
            }
        }
    });
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();
                const loginButton = document.getElementById('loginButton');
                if (loginButton) {
                    loginButton.click();
                }
            }
        });
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();
                const registerButton = registerForm.querySelector('button[type="submit"]');
                if (registerButton) {
                    registerButton.click();
                }
            }
        });
    }
});