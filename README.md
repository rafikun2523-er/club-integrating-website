
🎓 University Club Management System

A web-based platform that integrates all university clubs into a single digital system where students can explore clubs, receive updates, and participate in events while administrators manage club activities efficiently.

📋 Overview

University clubs are an important part of student life, but managing club information, announcements, and registrations manually can be difficult.

The University Club Management System provides a centralized platform where:

Students can explore clubs

Students can register for clubs

Students receive notifications and event updates

Students can download registration forms

At the same time, administrators can manage clubs, events, notifications, and deadlines through an admin panel.

This system improves communication, transparency, and engagement in university clubs.

✨ Key Features
👨‍🎓 Student Panel

Students can:

Browse all university clubs

View club details and activities

Register for clubs online

Download registration forms

Receive notifications and announcements

View upcoming events and deadlines

🛠️ Admin Panel

Admins can:

Add / Edit / Delete clubs

Post notifications and announcements

Create and manage events

Set registration deadlines

Manage student registrations

Upload club related documents

🏗️ Project Architecture
university-club-management/
│
├── client/                     # Frontend
│   ├── html/
│   │   ├── index.html
│   │   ├── clubs.html
│   │   └── events.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── images/
│
├── server/                     # Node.js Backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── database/
│   └── mongodb.js
│
├── admin-panel/
│
├── student-panel/
│
├── docs/
│   └── system-design.md
│
├── TODO.md
├── .gitignore
└── README.md
🛠️ Technology Stack
Frontend

HTML5

CSS3

JavaScript

Backend

Node.js

Express.js

Database

MongoDB

Tools

Git

GitHub

VS Code

🚀 Getting Started
📌 Prerequisites

Make sure you have installed:

Node.js

MongoDB

Git

VS Code

⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/yourusername/university-club-management.git
2️⃣ Navigate to Project Folder
cd university-club-management
3️⃣ Install Dependencies
npm install
4️⃣ Run the Backend Server
node server/server.js

or

npm run dev
5️⃣ Open Frontend

Open index.html manually

or use VS Code Live Server

🔑 User Roles
👨‍🎓 Student

Students can:

View clubs

Register for clubs

Receive notifications

View events and deadlines

🛠️ Admin

Admins can:

Manage clubs

Post announcements

Manage events

Set deadlines

Manage student registrations

📊 System Workflow
Student → View Clubs → Register → Receive Notifications

Admin → Manage Clubs → Create Events → Post Updates
📸 Screenshots
🏠 Homepage

(Add Screenshot Here)

📋 Club List

(Add Screenshot Here)

🛠️ Admin Dashboard

(Add Screenshot Here)

📅 TODO
✔ Club listing system
✔ Student registration system
✔ Admin notification system
⬜ Email notification system
⬜ Event reminder system
⬜ Mobile responsive UI
⬜ Analytics dashboard
📄 .gitignore Example
node_modules/
.env
.vscode/
dist/
build/
*.log
📈 Future Improvements

Email notification system

Event reminder system

Mobile responsive design

Club activity analytics

Online event registration

🤝 Contributing

Fork the repository

Create feature branch

git checkout -b feature/newFeature

Commit changes

git commit -m "Add new feature"

Push to GitHub

git push origin feature/newFeature

Open a Pull Request

👨‍💻 Author

Rafikun Nesa Hena

🎓 University Project
💻 University Club Management System

⭐ Support

If you like this project, please give it a star ⭐ on GitHub