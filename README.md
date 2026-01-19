# QuickNote Desktop 📝

A sleek, high-performance note-taking application designed for desktop web browsers. Built with React and Vite, it focuses on a clean user experience.

## 🔗 Live Demo
[🚀 View Live Demo](https://gabrielvizcainomusiced-coder.github.io/QuickNote-Desktop/)

---

## ✨ Features
* **Create Notes** – Capture thoughts instantly with a title and content.
* **Edit & Refine** – Seamlessly update existing notes.
* **Delete with Ease** – Keep your workspace clean by removing old notes.
* **Persistent Storage** – Your notes stay saved even if you refresh the page.
* **Responsive Layout** – Optimized for desktop and tablet viewports.
* **Dynamic UI** – Notes use a masonry-style adjustment based on content length.

---

## 🛠️ Tech Stack
* **React 19** – Modern UI library for a component-based architecture.
* **Vite** – Ultra-fast development and optimized production bundling.
* **JavaScript (ES6+)** – Clean, functional logic.
* **CSS3** – Custom styling with Flexbox and Grid for a modern look.

---

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. **Clone the repository**
```bash
   git clone https://github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop.git
```

2. **Navigate to the project directory**
```bash
   cd QuickNote-Desktop
```

3. **Install dependencies**
```bash
   npm install
```

4. **Start the development server**
```bash
   npm run dev
```

---

## 📁 Project Structure
```
QuickNote-Desktop/
├── .github/workflows/ # Automated deployment settings
├── hooks/             # Custom React hooks (useNotes)
├── src/               # Main application logic
│   ├── components/    # Modular UI elements (Header, NoteList, etc.)
│   ├── config/        # API configuration
│   ├── services/      # Backend API service layer
│   ├── main.jsx       # React entry point
│   └── styles.css     # Main application styles
├── utils/             # LocalStorage & helper logic
├── index.html         # Main entry page
├── vite.config.js     # Build & Base Path configurations
└── package.json       # Project dependencies & scripts
```

---

## 🔌 Backend Integration

This app supports two modes:

### Demo Mode (localStorage)
Perfect for GitHub Pages deployment - no backend needed.
```env
VITE_USE_BACKEND=false
```

### Full-Stack Mode (with API)
Uses the QuickNote API for persistent storage across devices.
```env
VITE_USE_BACKEND=true
VITE_API_URL=http://localhost:3001/api
```

### Running Full-Stack Locally

**Terminal 1 - Start Backend:**
```bash
cd quicknote-api
docker-compose up
```

**Terminal 2 - Start Frontend:**
```bash
# Make sure .env has VITE_USE_BACKEND=true
npm run dev
```

---

## 📚 Related Repositories

- [QuickNote API](https://github.com/gabrielvizcainomusiced-coder/quicknote-api) - Backend REST API

---

## 👤 Author
**Gabriel Vizcaino**
- GitHub: [@gabrielvizcainomusiced-coder](https://github.com/gabrielvizcainomusiced-coder)

---

## 📝 License
This project is open source and available under the MIT License.