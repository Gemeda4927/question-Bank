
# 📚 Question-Bank
[![Status](https://img.shields.io/badge/status-in%20progress-yellow)]()
[![License](https://img.shields.io/badge/license-Commercial--Restricted-blue)]()
[![GitHub stars](https://img.shields.io/github/stars/your-username/Question-Bank?style=social)]()

> A modular, all-in-one **Question-Bank system** with Mobile App, Backend API, Public Website, and Admin Dashboard — designed for education, exams, and learning platforms.



---

## 🎯 Project Overview

**Question-Bank** is a monorepo designed to provide a complete ecosystem for managing, accessing, and testing question banks. It includes:  

- **Mobile App:** For students to take quizzes, review questions, and track progress.  
- **Backend API:** Provides secure REST/GraphQL endpoints, authentication, and database management.  
- **Website:** Public-facing frontend for browsing, practice, and learning resources.  
- **Admin Dashboard:** Allows admins to manage questions, categories, exams, and analytics.  

This repository is designed for **modular development**, so each component can run independently while sharing resources.



---

## 🚀 Quick Start (Developer)

1. **Clone the repository**

```bash
git clone https://github.com/Gemeda4927/question-Bank
````

2. **Start components**

* **Backend:**

```bash
cd backend && npm install && npm run dev
```

* **Website:**

```bash
cd website && npm install && npm run dev
```

* **Admin Dashboard:**

```bash
cd admin-dashboard && npm install && npm run dev
```

* **Mobile App:**

```bash
cd mobile && flutter pub get && flutter run
```

> You can also use `scripts/start-all.sh` to start all components at once.

---

## 🛠️ Tech Stack

| Component       | Technology Stack            |
| --------------- | --------------------------- |
| Mobile App      | Flutter / React Native      |
| Backend         | Node.js / Express / GraphQL |
| Website         | React / Next.js             |
| Admin Dashboard | React / Next.js             |
| Database        | PostgreSQL / MongoDB        |
| CI/CD           | GitHub Actions, Docker      |
| Design          | Figma                       |

---

## 🌟 Features

* Role-based access (Students, Admins)
* Question CRUD with categories & tags
* Quiz & exam creation
* Analytics and reporting
* Offline support for mobile
* API-first architecture for easy integration

---

## 📚 Documentation

All important docs are in `/docs`:

* Architecture overview
* Database ERD & migrations
* API contract (OpenAPI / GraphQL)
* Deployment & CI/CD guides
* Testing strategy & QA checklists

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a branch: `feature/<short-description>` or `fix/<short-description>`.
3. Write tests and update docs.
4. Open a PR against `develop` branch.
5. PR must pass CI checks before merge.

> See `.github/CONTRIBUTING.md` for detailed guidelines.

---

## ⚖️ License

This project uses a **Commercial-Restricted MIT License**.

* Free for **personal, educational, or evaluation use**.
* **Commercial use requires explicit permission** from the copyright holder.
  See `LICENSE` for details.

---

## 📞 Contact

**Author:** Gemeda Tamiru
**Email:** [gemedatma@gmail.com](mailto:gemedatma@gmail.com)
**Telegram:** [@Abbaabiyyaa2](https://t.me/Abbaabiyyaa2)

---

Made with  by Gemeda Tamiru







