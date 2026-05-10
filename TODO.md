# 📋 TODO — Unified Club Portal (BAUET)

> Last updated: April 2026 | Track progress across backend, frontend, security, database & deployment.

---

## 🖥️ Project Setup

- [x] Organize project folders (HTML, CSS, JS, Backend)
- [x] Initialize Node.js project
- [x] Install required packages (Mongoose, Express, bcrypt,jwt)
- [x] Connect MongoDB Atlas database
- [x] Create basic server using Node.js + Express (`backend/server.js`)

---

## 🔧 Backend

- [x] Admin login route (bcrypt + session) — `backend/server.js`[Nishat]
- [x] Admin session check + logout routes — `backend/server.js`[Rafikun]
- [x] seedAdmin.js — create admin in MongoDB — `backend/seedAdmin.js`[Rafikun]
- [x] Member register + OTP verify — `backend/routes/memberRoutes.js`[Tahsina]
- [x] Member login (JWT) — `backend/controllers/memberController.js`[Tahsina]
- [x] Profile photo upload — `backend/routes/memberRoutes.js`[Tahsina]
- [x] Change password route — `backend/routes/memberRoutes.js`[Tahsina]
- [x] Event create / complete (admin only) — `backend/routes/eventRoutes.js`[Rafikun]
- [X] Event registration for members — `backend/routes/eventRoutes.js`[Nishat]
- [X] isAdmin middleware — `backend/middleware/isAdmin.js`[Tahsina]
- [x] JWT auth middleware — `backend/middleware/auth.js`[Tahsina]
- [x] Rate limiter on login + register — `backend/server.js`[Rafikun]
- [X] Certificate routes — `backend/routes/certificateRoutes.js`[Tahsina]
- [x] Club join route (member joins a club) — `backend/routes/ (missing)`[Tahsina]
- [X]  Notice / announcement route — `backend/routes/ (missing)`[Rafikun]
- [x] Admin model in MongoDB — `backend/models/Admin.js `[Rafikun]

---

## 🌐 Frontend — Main Portal Pages

- [x] Home page full redesign — `html code/index.html` + `css/index.css`[Rafikun]
- [x] Club listing page with search + filter — `html code/club.html` + `java script/clubs.js`[Rafikun]
- [x]Computer club `html code/cse.html` + `java script/cse.js`[Tahsina]
- [x] Photography club `html code/photo.html` + `java script/photo.js`[Nishat]
- [x]Debate club `html code/debate.html` + `java script/debate.js`[Tahsina]
- [x]cultural club `html code/cultural.html` + `java script/cultural.js`[Nishat]
- [x]Nature club `html code/nature.html` + `java script/nature.js`[Arobe]
- [x] Admin login page (floating label, toast) — `html code/admin-login.html` + `css/login.css`[Nishat]
- [x] Admin guard (session check) — `java script/admin-guard.js`[Rafikun]
- [x] Feature cards link to correct sections — `html code/index.html`[Rafikun]
- [X] Navbar Admin link → admin-login.html — `html code/index.html (all navbars)`
- [X] Events page — `html code/events.html` + `java script/events.js`
- [X]  About page — `html code/about.html` + `css/about.css`[Rafikun]
- [X] Connect frontend with backend APIs[Tahsina]


---

## 👤 Student Panel [Tahsina]

- [x] Create student registration system
- [x] Create student login system
- [x] Build student dashboard
- [x] Show club announcements
- [x] Show upcoming events
- [x] Add club search by category/tags
- [x] Add club rating / review system
- [x] Enable profile picture upload
- [x] Create student profile page
- [x] Show notifications from admin
- [ ] Allow students to join clubs
- [ ] Allow students to register for events after production

---

## 🎓 CSE Club Pages (BCS)

- [x] CSE club main page — `html code/cse.html` + `css/cse.css`
- [x] BCS Dashboard — `html code/bcsDashboard.html` + `java script/bcsDashboard.js`
- [x] BCS Members list — `html code/bcsMembers.html` + `java script/bcsMembers.js`
- [x] BCS Events (upcoming) — `html code/bcsEventsUpcoming.html`
- [x] BCS Events (past) — `html code/bcsEventsPast.html`
- [x] BCS Profile page — `html code/bcsProfile.html` + `java script/bcsProfile.js`
- [x] BCS Achievements page — `html code/bcsAchievements.html`
- [x] BCS About page — `html code/bcsAbout.html`
- [x] BCS Participation page — `html code/bcsParticipation.html`
- [X] BCS Certificates page — `html code/bcsCertificates.html` + `java script/bcsCertificates.js`[Tahsina]

---

## 🏛️ Other Club Pages

- [x] Cultural / Photography club page — `html code/cultural.html` + `css/cultural.css`[Arobe]
- [x] Debate club page — `html code/debate.html` + `css/debate.css`[Tahsina]
- [x] Language & Literature club (LLCB) — `html code/llcb.html` + `css/llcb.css`[Tahsina]
- [X] Nature & Environment club page — `html code/nature.html (missing)`[Arobe]
- [X] Connect all club pages to club.html cards — `java script/clubs.js`[Rafikun]
- [X]Photography club (separate) — `html code/pthotography.html` + `css/photography.css`[Nishat]
- [X] Show club members list
- [ ] Create club gallery page

---

## 🛡️ Admin Panel[Rafikun]

- [x] Admin dashboard UI — `html code/admin.html` + `css/admin.css`
- [x] Admin JS logic — `java script/admin.js`
- [x] Admin session guard script — `java script/admin-guard.js`
- [x] Manage clubs (add/edit/delete)
- [x] Manage events (add/edit/delete)
- [x] Manage notices/announcements
- [x] Manage student members
- [x] Bulk member import via CSV
- [x] Event calendar view
- [x] Analytics dashboard
- [x] Admin welcome name display — `html code/admin.html (add id=adminWelcomeName)`
- [x] Admin logout button — `html code/admin.html (add onclick=adminLogout())`
- [x] Event create from admin panel — `java script/admin.js` + `/api/events/create`
- [x] View + manage registered members — `java script/admin.js` + `/api/members/all`
- [x] Mark event as completed — `java script/admin.js` + `/api/events/complete/:id`

---

## 🔔 Notification System

- [x] Show latest notices on student dashboard[Tahsina]
- [X] Real-time notification updates [Rafikun]
- [ ] Email notifications for events
- [ ] Push notifications for mobile

---

## 🗄️ Database / Models

- [x] Member model — `backend/models/member.js`[Nishat]
- [x] Event model — `backend/models/events.js`[Rafikun]
- [x] Registration model — `backend/models/registration.js`[Tahsina]
- [ ] Participation model — `backend/models/participation.js`
- [x] MongoDB Atlas connected — `backend/.env (MONGO_URI)`[Tahsina]
- [X] Admin model (separate collection) — `backend/models/Admin.js `[Rafikun]
- [ ] **[URGENT]** Certificate schema — `backend/models/Certificate.js `
- [X] Club schema — `backend/models/Club.js `
- [X] Notice / Announcement schema — `backend/models/Notice.js `


---

## 🔒 Security & Auth

- [x] bcrypt password hashing (admin) — `backend/server.js`[Rafikun]
- [x] JWT for member auth — `backend/middleware/auth.js`[Tahsina]
- [x] Session-based admin auth — `backend/server.js`[Rafikun]
- [x] OTP email verification — `backend/utils/sendOTP.js`[Tahsina]
- [x] Rate limiting on login routes — `backend/server.js`
- [x] Admin route protection (isAdmin middleware) — `backend/middleware/isAdmin.js`
- [X] SESSION_SECRET in .env — `backend/.env`
- [X] bcrypt + express-session installed — `backend/package.json (npm install)`[Tahsina]
- [ ] Two-factor authentication (2FA)
- [ ] Data encryption at rest

---

## 🧪 Testing

- [x] Test admin login end-to-end — `html code/admin-login.html → admin.html`[Rafikun]
- [X] Fix pthotography.html typo — rename to `photography.html`
- [X] Test member register + OTP flow — `html code/cse.html register modal`
- [X] Test event registration — `html code/bcsEventsUpcoming.html`
- [X] Test admin panel functionality
- [ ] Test database operations
- [X] Fix UI/UX issues
- [ ] Debug backend APIs

---

## 🚀 Deployment

- [X] Deploy frontend (Netlify / Vercel) — `html code/` folder
- [ ] Deploy backend (Render / Railway) — `backend/server.js`
- [X] Use MongoDB Atlas for production database
- [X] Update BASE_URL for production — `backend/config.js` + all JS files
- [x] Add environment variables (.env)

---

## 🌟 Future Enhancements

- [ ] Mobile application version
- [ ] AI-based event recommendations
- [ ] Real-time chat system
- [ ] Club leaderboard system
- [ ] Multi-university support

---

## 📊 Progress Summary

| Section | Done | Total |
|---|---|---|
| Project Setup | 5 | 5 |
| Backend | 15 | 16 |
| Frontend Main | 14 | 14 |
| Student Panel | 10 | 12 |
| CSE Club (BCS) | 9 | 10 |
| Other Clubs | 7 | 8 |
| Admin Panel | 15 | 15 |
| Notification System | 2 | 4 |
| Database / Models | 7 | 9 |
| Security & Auth | 8 | 10 |
| Testing | 5 | 8 |
| Deployment | 4 | 5 |
| Future | 0 | 5 |
| **Total** | **104** | **121** |

> ✅ **Done:** 104 &nbsp;&nbsp; ❗ **Urgent:** 1 &nbsp;&nbsp; ⬜ **Pending:** 16
