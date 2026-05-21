// firebase-config.js
// Central initialization configuration for Firebase Auth, Realtime Database, and Storage

// Default configuration. Hardcoded with the user's credentials.
let firebaseConfig = {
    apiKey: "AIzaSyDcas4JHCS1kQ5P1DA-LEDjpqKtTf9WFrY",
    authDomain: "ezyship-ca164.firebaseapp.com",
    databaseURL: "https://ezyship-ca164-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ezyship-ca164",
    storageBucket: "ezyship-ca164.firebasestorage.app",
    messagingSenderId: "175667938863",
    appId: "1:175667938863:web:f2d7960680a4945af0a8da",
    measurementId: "G-TYNM5ZVK3L"
};

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

// Determine path to index.html dynamically based on subdirectory depth
function getMainUrl() {
    const isSubdir = window.location.pathname.includes('/prints/');
    return isSubdir ? '../index.html' : 'index.html';
}

// Global sign out helper
async function handleLogout(e) {
    if (e) e.preventDefault();
    if (firebaseInitialized && firebaseAuth) {
        try {
            await firebaseAuth.signOut();
        } catch (err) {
            console.error("Sign out failed", err);
        }
    }
    window.location.href = getMainUrl();
}
