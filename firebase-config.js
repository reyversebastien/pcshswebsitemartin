





const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBBsNF3Zks43axsmE7vhLp48lnwmOXDr2w",
    authDomain: "pasig-city-science-high-school.firebaseapp.com",
    projectId: "pasig-city-science-high-school",
    storageBucket: "pasig-city-science-high-school.firebasestorage.app",
    messagingSenderId: "604791961129",
    appId: "1:604791961129:web:1a80ce1e2e2fa508060e38",
    measurementId: "G-8JT40JEVGW"
};


try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        window._PCSHS_FIREBASE_INIT = true;
        console.log(
            '%c✅ Firebase connected → ' + FIREBASE_CONFIG.projectId,
            'color:#2E7D32;font-weight:bold;font-size:13px;'
        );
    } else {
        
        window._PCSHS_FIREBASE_INIT = false;
        console.warn('Firebase SDK not found. Ensure firebase-app-compat.js is loaded before this script.');
    }
} catch (e) {
    window._PCSHS_FIREBASE_INIT = false;
    console.error('Firebase initialization error:', e);
}
