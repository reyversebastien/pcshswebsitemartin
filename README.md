# PCSHS Website - Team Collaboration Guide

This guide will help you set up and contribute to the Pasig City Science High School (PCSHS) website project.

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
1. **[VS Code](https://code.visualstudio.com/)**: Our primary code editor.
2. **[Node.js](https://nodejs.org/)**: Required for Firebase tools.
3. **[Git](https://git-scm.com/)**: (Optional) For version control.

## 🚀 How to Run the Project
You don't need a complex server. Follow these steps:

1. **Install "Live Server" Extension**: 
   - Open VS Code.
   - Go to the **Extensions** view (`Ctrl+Shift+X`).
   - Search and install **"Live Server"**.
2. **Open the Project**:
   - `File > Open Folder...` and select the `PCSHS HTML` folder.
3. **Run it**:
   - Right-click `index.html` and select **"Open with Live Server"**.
   - Your browser will open at `http://127.0.0.1:5500`.

---

## 🛠️ Development & Collaboration

### 1. Database (Firebase vs. LocalStorage)
The project is built to work in two modes. You can toggle this in **`db.js`**:
*   **LocalStorage Mode (`useFirebase = false`)**: Data is saved only in YOUR browser. Good for quick testing.
*   **Firebase Mode (`useFirebase = true`)**: Data is synced to the cloud. You need to ask Reyver for access to the Firebase Console.

### 2. Admin Panel
To add News, Events, and Achievers without touching code:
1.  Go to `admin.html` in your browser.
2.  Login with:
    - **Username**: `admin`
    - **Password**: `pcshs2025`
3.  Any data added here will reflect on the main site immediately (if using Firebase or on your local machine).

### 3. Email Notifications
We use **EmailJS** to send automated emails.
- Keys are located in `admin.html` (init) and `admin.js` (templates).
- To test actual sending, ensure the `Service ID` and `Template ID` in `admin.js` match the active EmailJS account.

---

## 📂 Key Files
- `index.html`: Homepage structure.
- `style.css`: All designs (Careful: it's a large file!).
- `admin.js`: Portal logic and EmailJS integration.
- `db.js`: Database connector.
- `enroll.html`: The online application form.

## ☁️ Deployment (Going Live)
If you want to push changes to the live website:
1.  Open your terminal in VS Code (`Ctrl+``).
2.  Install Firebase tools: `npm install -g firebase-tools`.
3.  Login: `firebase login`.
4.  Deploy: `firebase deploy`.
