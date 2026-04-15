# 📋 TODO — Unified Club Portal (BAUET)

> Last updated: April 2026 | Track progress across backend, frontend, security, database & deployment.

---

## 🖥️ Project Setup

- [x] Organize project folders (HTML, CSS, JS, Backend)
- [x] Initialize Node.js project
- [x] Install required packages (Mongoose, Express, bcrypt,jwt)
- [x] Connect MongoDB Atlas database
- [ ] Create basic server using Node.js + Express (`backend/server.js`)

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
- [ ] Event registration for members — `backend/routes/eventRoutes.js`
- [ ] isAdmin middleware — `backend/middleware/isAdmin.js`
- [x] JWT auth middleware — `backend/middleware/auth.js`[Tahsina]
- [x] Rate limiter on login + register — `backend/server.js`[Rafikun]
- [ ] **[URGENT]** Certificate routes — `backend/routes/certificateRoutes.js`
- [ ] **[URGENT]** Club join route (member joins a club) — `backend/routes/ (missing)`
- [ ] **[URGENT]** Notice / announcement route — `backend/routes/ (missing)`
- [ ] **[URGENT]** Admin model in MongoDB — `backend/models/Admin.js (missing)`

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
- [ ] **[URGENT]** Navbar Admin link → admin-login.html — `html code/index.html (all navbars)`
- [ ] **[WIP]** Events page — `html code/events.html` + `java script/events.js`
- [X]  About page — `html code/about.html` + `css/about.css`[Rafikun]
- [ ] Connect frontend with backend APIs
- [ ] Improve navigation between club pages

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
- [ ] Allow students to register for events

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
- [ ] **[URGENT]** BCS Certificates page — `html code/bcsCertificates.html` + `java script/bcsCertificates.js`

---

## 🏛️ Other Club Pages

- [x] Cultural / Photography club page — `html code/cultural.html` + `css/cultural.css`
- [x] Debate club page — `html code/debate.html` + `css/debate.css`
- [x] Language & Literature club (LLCB) — `html code/llcb.html` + `css/llcb.css`
- [ ] **[URGENT]** Nature & Environment club page — `html code/nature.html (missing)`
- [ ] **[URGENT]** Connect all club pages to club.html cards — `java script/clubs.js`
- [ ] **[WIP]** Photography club (separate) — `html code/pthotography.html` + `css/photography.css`
- [ ] Show club members list
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
- [ ] **[URGENT]** Admin welcome name display — `html code/admin.html (add id=adminWelcomeName)`
- [ ] **[URGENT]** Admin logout button — `html code/admin.html (add onclick=adminLogout())`
- [ ] **[WIP]** Event create from admin panel — `java script/admin.js` + `/api/events/create`
- [ ] **[WIP]** View + manage registered members — `java script/admin.js` + `/api/members/all`
- [ ] Mark event as completed — `java script/admin.js` + `/api/events/complete/:id`

---

## 🔔 Notification System

- [ ] Show latest notices on student dashboard
- [ ] Real-time notification updates
- [ ] Email notifications for events
- [ ] Push notifications for mobile

---

## 🗄️ Database / Models

- [x] Member model — `backend/models/member.js`
- [x] Event model — `backend/models/events.js`[Rafikun]
- [x] Registration model — `backend/models/registration.js`
- [x] Participation model — `backend/models/participation.js`
- [x] MongoDB Atlas connected — `backend/.env (MONGO_URI)`[Tahsina]
- [ ] **[URGENT]** Admin model (separate collection) — `backend/models/Admin.js (missing)`
- [ ] **[URGENT]** Certificate schema — `backend/models/Certificate.js (missing)`
- [ ] Club schema — `backend/models/Club.js (missing)`
- [ ] Notice / Announcement schema — `backend/models/Notice.js (missing)`
- [ ] Connect all APIs with database

---

## 🔒 Security & Auth

- [x] bcrypt password hashing (admin) — `backend/server.js`[Rafikun]
- [x] JWT for member auth — `backend/middleware/auth.js`[Tahsina]
- [x] Session-based admin auth — `backend/server.js`
- [x] OTP email verification — `backend/utils/sendOTP.js`
- [x] Rate limiting on login routes — `backend/server.js`
- [x] Admin route protection (isAdmin middleware) — `backend/middleware/isAdmin.js`
- [ ] **[URGENT]** SESSION_SECRET in .env — `backend/.env`
- [ ] **[URGENT]** bcrypt + express-session installed — `backend/package.json (npm install)`
- [ ] Two-factor authentication (2FA)
- [ ] Data encryption at rest

---

## 🧪 Testing

- [ ] **[URGENT]** Test admin login end-to-end — `html code/admin-login.html → admin.html`
- [ ] **[URGENT]** Fix pthotography.html typo — rename to `photography.html`
- [ ] **[WIP]** Test member register + OTP flow — `html code/cse.html register modal`
- [ ] Test event registration — `html code/bcsEventsUpcoming.html`
- [ ] Test admin panel functionality
- [ ] Test database operations
- [ ] Fix UI/UX issues
- [ ] Debug backend APIs

---

## 🚀 Deployment

- [ ] Deploy frontend (Netlify / Vercel) — `html code/` folder
- [ ] Deploy backend (Render / Railway) — `backend/server.js`
- [ ] Use MongoDB Atlas for production database
- [ ] Update BASE_URL for production — `backend/config.js` + all JS files
- [ ] Add environment variables (.env)

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
| Project Setup | 4 | 5 |
| Backend | 12 | 16 |
| Frontend Main | 5 | 8 |
| Student Panel | 10 | 12 |
| CSE Club (BCS) | 9 | 10 |
| Other Clubs | 3 | 6 |
| Admin Panel | 8 | 11 |
| Notification System | 0 | 4 |
| Database / Models | 5 | 9 |
| Security & Auth | 6 | 8 |
| Testing | 0 | 8 |
| Deployment | 0 | 5 |
| Future | 0 | 5 |
| **Total** | **62** | **107** |

> ✅ **Done:** 62 &nbsp;&nbsp; ❗ **Urgent:** 15 &nbsp;&nbsp; 🔄 **WIP:** 7 &nbsp;&nbsp; ⬜ **Pending:** 45
