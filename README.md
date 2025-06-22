<h1 align="center">
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/agile/agile.png" width="48" />
  Signdoc - PDF Editor - Save in Cloud
</h1>

<p align="center">
  <b>Edit, Sign, and Annotate PDFs with Ease, Save in Cloud and Share</b>
</p>


<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-4-black?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-6-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-live-brightgreen?logo=socket.io" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
</p>

---
## Overview
Signdoc is a powerful PDF editor that allows you to edit, sign, and annotate PDFs with ease. With its intuitive interface and robust features, Signdoc is the perfect tool for individuals and businesses looking to streamline their document workflow.

## Features
* **Edit PDFs**: Edit text, images, and layouts with ease
* **Sign PDFs**: Add digital signatures to your PDFs
* **Annotate PDFs**: Add comments, highlights, and notes to your PDFs
* **Fill Forms**: Fill out PDF forms with ease
* **Export Options**: Export your edited PDFs to various formats, including PDF, JPEG, and PNG

---

## 📸 Screenshots

<p align="center">
  <img src="https://user-images.githubusercontent.com/6190356/273420237-8e7e2c6e-2e8c-4b2e-9e3b-2e2e6e7e2e2e.png" width="700" alt="Dashboard" />
  <br>
  <i>Dashboard - Kanban Board</i>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/6190356/273420238-9e7e2c6e-2e8c-4b2e-9e3b-2e2e6e7e2e2e.png" width="700" alt="Workspace Settings" />
  <br>
  <i>Workspace Settings - Customization & Members</i>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/6190356/273420239-ae7e2c6e-2e8c-4b2e-9e3b-2e2e6e7e2e2e.png" width="700" alt="Dark Mode" />
  <br>
  <i>Dark Mode - Beautiful and Accessible</i>
</p>

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sachin-fsd/sign-document.git
cd sign-document
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

- Copy `.env.example` to `.env` in both `backend` and `frontend` folders.
- Fill in your MongoDB URI, JWT secret, email credentials, and frontend URL.

### 4. Run the app

```bash
# In one terminal (backend)
cd backend
npm run dev

# In another terminal (frontend)
cd ../frontend
npm run dev
```

- Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Query, Socket.IO-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO
- **Auth:** JWT, bcrypt, email verification
- **Email:** Nodemailer (Gmail/SMTP)
- **Real-time:** Socket.IO for live comments and updates

---

## 🧩 Project Structure

```
/frontend
  /app
    /components
    /hooks
    /routes
    /provider
  ...
/backend
  /controllers
  /models
  /routes
  /libs
  ...
```

---

## 📝 API Highlights

- `POST /api-v1/auth/register` - Register a new user
- `POST /api-v1/auth/login` - Login
- `POST /api-v1/files/upload` - Upload file to AWS s3
- `PUT /api-v1/files/:id` - Delete files
- `POST /api-v1/files/`  - Get Files
- ...and many more!

---

## 💡 Customization

- Upload Pdf And Edit Text
- Customize **text**
- Place Any number of **text**

---

## 🤝 Contributing

Contributions are welcome!  
Please open issues or pull requests for improvements, bug fixes, or new features.

---

## 📬 Contact

- [GitHub Issues](https://github.com/yourusername/orbit-agile-task-management/issues)
- Email: your@email.com

---

<p align="center">
  <b>Made with ❤️ for Agile teams</b>
</p>