# 🚀 Aerchain AI RFP Management System

## 🖥 Live Deployment Links
| Layer | URL |
|-------|-----|
| Frontend | https://aerchain-ai-rfp-management-system.vercel.app/ |
| Backend | https://aerchain-ai-rfp-management-system.onrender.com |
| Health Check | https://aerchain-ai-rfp-management-system.onrender.com/api/health |

---

## 🔥 Project Description
Aerchain AI RFP Management System is a full-stack AI-powered procurement automation platform that enables organizations to create, manage, and send RFPs (Request for Proposals) to vendors effortlessly. The system uses OpenAI to auto-generate RFPs from natural language input, supports vendor selection & automated emailing, and centralizes procurement workflows.

This project demonstrates real-world procurement SaaS features including AI-generated content, vendor management, email automation, and production deployment.

---

## 🌟 Key Features
### 🧠 AI Powered RFP Creation
- Create RFPs from natural language using OpenAI
- Auto-extract title, requirements, budget, delivery timeline, terms, warranty

### 📦 Manual RFP Form
- Create RFP manually with form inputs

### 👨‍💼 Vendor Management
- Add & manage vendors
- Vendor email identification internally

### ✉️ Send RFP to Vendors
- Select RFP
- Choose vendors
- Automatically send emails with structured RFP details using Mailtrap SMTP

### ✍️ Edit & Delete RFP
- Inline edit UI for updating existing RFPs
- Delete functionality integrated

### 🌍 Fully Deployed & Online
Frontend on **Vercel**, Backend on **Render**, DB on **MongoDB Atlas**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | OpenAI API (GPT-based text processing) |
| Email Service | Mailtrap (SMTP) |
| Deployment | Vercel + Render |
| Package Manager | npm |

---

## 🗂 Folder Structure
aerchain-rfp/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── config/
│ ├── .env (ignored)
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
├── README.md


## ⚙️ Environment Variables (.env)
### Backend `.env` example:
PORT=5000
MONGO_URI=yourmongodbURL
OPENAI_API_KEY=yourKey
OPENAI_PROJECT_ID=yourProjectId

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=xxxxxx
SMTP_PASS=xxxxxx
SMTP_FROM="Aerchain RFP noreply@aerchain.com"

## 🧪 API Endpoints

### **RFP Endpoints**
| Method | Route | Description |
|--------|--------|-------------|
| GET | `/api/rfps` | Get all RFPs |
| POST | `/api/rfps` | Create RFP manually |
| POST | `/api/rfps/from-text` | Create RFP using AI |
| PUT | `/api/rfps/:id` | Update RFP |
| DELETE | `/api/rfps/:id` | Delete RFP |
| POST | `/api/rfps/:id/send` | Send RFP email |

### **Vendor Endpoints**
| Method | Route | Description |
|--------|--------|-------------|
| GET | `/api/vendors` | Get vendor list |
| POST | `/api/vendors` | Create vendor |

---

## 🏗 How to Run Locally

### 1️⃣ Clone repo
```sh
git clone https://github.com/Ashraf-git-projects/Aerchain_Ai-RFP-Management-System.git
2️⃣ Install dependencies
sh
Copy code
cd backend
npm install
cd ../frontend
npm install
3️⃣ Start backend
sh
Copy code
cd backend
npm start
4️⃣ Start frontend
sh
Copy code
cd frontend
npm start

📸 Screenshots (I will add later)

[ UI Screens ]
- Dashboard / RFP List
- Create RFP UI
- AI generation flow
- Send RFP to vendors UI
- Email preview screenshot

🚀 Future Enhancements (Upcoming)
⏳ RFP Status workflow (Sent / Proposal Received / Awarded)

📤 Vendor proposal submission portal

📊 Proposal comparison dashboard

🔐 Role-based authentication (Admin/Vendor login)

📁 Attachments & file upload support

📄 Export RFP as PDF

✍️ Author
👤 Ashraf Hussain Siddiqui
Full Stack MERN Developer |

📧 Email: ashrafhussain2265@gmail.com
🔗 LinkedIn: https://linkedin.com/in/ashraf-hussain-siddiqui

⭐ Support
If you like this project, consider ⭐ starring the repository :)
