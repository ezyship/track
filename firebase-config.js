// firebase-config.js
// Central initialization configuration for Firebase Auth, Realtime Database, and Storage

// Default empty config. Users can edit this directly or paste their config into the login page UI.
let firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Attempt to load credentials from localStorage if not configured above
try {
    const savedConfig = localStorage.getItem('firebaseConfig');
    if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.apiKey) {
            firebaseConfig = parsed;
        }
    }
} catch (e) {
    console.error("Failed to load Firebase configuration from localStorage", e);
}

let firebaseInitialized = false;
if (firebaseConfig.apiKey) {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebaseInitialized = true;
    } catch (e) {
        console.error("Firebase Initialization Failed", e);
    }
}

// Global handles
const firebaseAuth = firebaseInitialized ? firebase.auth() : null;
const firebaseDb = firebaseInitialized ? firebase.database() : null;
const firebaseStorage = firebaseInitialized ? firebase.storage() : null;

// Determine path to login.html dynamically based on subdirectory depth
function getLoginUrl() {
    const isSubdir = window.location.pathname.includes('/prints/');
    return isSubdir ? '../login.html' : 'login.html';
}

// Enforces user session, redirects if not authenticated
function enforceAuth() {
    if (!firebaseInitialized) {
        console.warn("Firebase not configured. Redirecting to login for setup.");
        window.location.href = getLoginUrl();
        return;
    }
    
    firebaseAuth.onAuthStateChanged((user) => {
        if (!user) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = getLoginUrl();
        } else {
            // User is authenticated, remove the style tag hiding the body (if present)
            const guard = document.getElementById('auth-guard-style');
            if (guard) {
                guard.remove();
            } else {
                // If script ran before body, remove style on DOMContentLoaded
                document.addEventListener("DOMContentLoaded", () => {
                    const g = document.getElementById('auth-guard-style');
                    if (g) g.remove();
                });
            }
        }
    });
}
