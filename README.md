# compaign_tracker# 🎯 Campaign Tracker

A complete **Campaign Tracker** web application built using **HTML, CSS, JavaScript (Frontend)** and **Node.js + Express + JSON Database (Backend)**.  
It allows users to **Sign up, Log in, and Manage Campaigns** with a simple, modern dashboard interface.

---

Prerequisites
Node.js and npm installed: Download Node.js
Modern browser (Chrome, Firefox, Edge)

## 🚀 Features

### 👩‍💻 User Authentication
- Secure **Login and Signup** using backend API.
- Stores session using **localStorage** for fast access.
- Redirects users automatically if not logged in.

### 📊 Dashboard Management
- Displays **summary statistics**:
  - Total campaigns
  - Active, Pending, and Completed campaigns
- Add, update, delete campaigns easily.
- Live **search/filter** feature for quick navigation.
- Clean, modern, and responsive interface.

### ⚙️ Backend Functionality
- Node.js + Express server.
- RESTful API routes for all campaign and user operations.
- JSON file-based storage (`campaigns.json` & `users.json`).
- CORS-enabled for frontend communication.
- Handles signup, login, add, update, delete operations.

---

## 🗂️ Project Structure
campaign-tracker/
│
├── backend/
│ ├── server.js # Main Express server
│ ├── campaigns.json # Stores campaign data
│ ├── users.json # Stores user data
│ ├── package.json # Dependencies and scripts
│ └── README.md # (optional backend-only docs)
│
├── frontend/
│ ├── index.html # Main page with login/signup toggle
│ ├── login.html # Login page
│ ├── signup.html # Signup form page
│ ├── dashboard.html # Dashboard page
│ ├── script.js # Frontend logic
│ ├── style.css # Stylesheet
│ └── README.md # (optional frontend-only docs)
│
└── README.md # Main combined documentation

## 🧩 Technologies Used

### 🖥️ Frontend
- HTML5  
- CSS3  
- JavaScript (Vanilla)  
- Fetch API  
- LocalStorage  

### ⚙️ Backend
- Node.js  
- Express.js  
- CORS  
- File System (for JSON storage)

- 
## ⚙️ Setup & Installation

Install Backend Dependencies
cd backend
npm install
node server.js
Start Backend Server
node server.js

Run the Frontend
cd frontend
npx live-server


Usage
1.Open index.html in a browser.
2.Signup or Login using username and password.
3.After login, the dashboard will appear:
4.Add new campaigns using the form
5.Update campaign status from the dropdown
6.Delete campaigns using the delete button
7.Search campaigns by name or client
8.Logout using the Logout button at the bottom.


Notes
All data is stored in local JSON files (campaigns.json and users.json) in the backend folder.
Passwords are stored in plain text in this demo; for production, always hash passwords.
he backend runs on port 3000 by default. Update API_URL in script.js if changed.


# Campaign Tracker

## Screenshots

### Login Page
![Login Page](images/login.png)

### Signup Page
![Signup Page](images/signup.png)

### Dashboard
![Dashboard](images/dashboard.png)

### Search Campaign
![Search Campaign](images/search.png)
