# 📚 Alexis – AI-Powered Learning Companion

Alexis is an intelligent, curriculum-aware educational assistant built to support university students preparing for high-stakes exams. The platform provides personalized academic help using real-time AI chat, resource filtering, and contextual Q&A powered by students' own materials.

> ✅ Developed during a 6-month internship at [CodeCooperation](https://www.codecooperation.com/) as part of a final year engineering project.

🎥 **[Watch Demo on YouTube](https://youtu.be/AzM8jTL0nrk?si=PL290Kzjos3R1YUa)**

---

## 🛠 Tech Stack

| Frontend         | Backend              | AI & DevOps              |
| ---------------- | -------------------- | ------------------------ |
| React            | Node.js              | DIFY (LLMOps platform)   |
| Next.js          | NestJS               | Docker & Dozzle          |
| Tailwind CSS     | Prisma ORM (MySQL)   | GitHub Actions (CI/CD)   |
| React Markdown   | Passport.js + Resend | Vector DB + RAG pipeline |
| Axios, Socket.IO | Konnect (Payments)   | Sentry (Error tracking)  |

---

## ✨ Features

- 🔐 Secure user authentication via email (Magic Link)
- 🧑‍🎓 Personalized onboarding & profile management
- 💬 AI-powered Q&A using student-uploaded content
- 📚 Markdown & scientific formatting support
- 🕒 Chat history: rename, delete, resume sessions
- 💸 Payment integration for subscription tiers
- 🔁 Real-time streaming, feedback, and answer regeneration
- 🧠 Context-aware responses using RAG pipeline and AI orchestration

---

## 🧱 Architecture Overview

## 🧱 Architecture Overview

- 🖥️ **Frontend**: Built using React + Next.js with Tailwind CSS for styling and Socket.IO for real-time features.
- ⚙️ **Backend**: Structured using NestJS with an MSC (Model-Service-Controller) architecture and Prisma for data persistence.
- 🧠 **AI Layer**: Powered by [DIFY](https://dify.ai/) with prompt engineering, workflow orchestration, and Retrieval-Augmented Generation (RAG).
- 🚀 **Deployment**: Dockerized apps with GitHub Actions for CI/CD and Dozzle for container log monitoring.


---

## 📁 Repository Structure

This project is split into two repositories:

- [`alexis-frontend`](https://github.com/Oslt-amira/AlexisAI-frontend/) – Frontend implementation 
- [`alexis-backend`](https://github.com/Oslt-amira/AlexisAI-backend/) – Backend services 

---

## 🤝 Internship & Collaboration

This project was built as part of an engineering internship inside **CodeCooperation** — a global innovation lab with offices in Berlin and Tunisia.

> The project followed an Agile Scrum methodology and consisted of multiple sprints, feature branches, and production-ready releases.

---
## 🧾 Why There’s Only One Commit?

> ⚠️ The commit history was reset for cleanup purposes, so the repository currently shows a single commit.

Despite this, Alexis was built over a 6-month Agile process involving multiple sprints, feature branches, internal reviews, and production-ready releases. The current state reflects the finalized MVP, tested and documented throughout the internship.
