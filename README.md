# CONEXA Frontend Client

A digital B2B Matchmaking and Logistics Platform designed for the Capricorn Bioceanic Corridor, connecting carriers, businesses, and communities in a single application.

## 🚀 Overview

The CONEXA frontend client is a Single Page Application (SPA) responsible for presenting the user interface and handling all state management and business logic related to the B2B marketplace.

This application strictly adheres to the **Separation of Concerns Principle**, isolating API communication, global state, and UI presentation.

## ⚙️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React** (via Vite) | Main UI library for building components. |
| **Tailwind CSS** (v4) | Utility-first CSS framework for rapid, responsive styling. |
| **React Router DOM** | Client-side routing and protected route management. |
| **React Hook Form** | Declarative form management and validation. |
| **Axios** | HTTP client configured for secure cookie-based API interaction. |
| **Modern JS (ES6+)** | Code structure emphasizes functional components and clean, semicolon-free syntax. |

---

## 🔒 Security & Architecture

The application uses an isolated services layer to communicate with the backend.

* **Authentication:** Managed via **HTTP-only Cookies** issued by the backend.
* **Axios Configuration:** The `apiClient` is configured with `withCredentials: true` to automatically send and receive the JWT token stored in the cookie.
* **Global State:** The `AuthContext` provides the necessary state (`isAuthenticated`, `user`, `loading`) to the entire application.
* **Protected Routes:** The `<ProtectedRoute>` component ensures that unauthorized users are redirected away from private dashboards (`/mercado`, `/perfil`).

---

## 🛠️ Getting Started

### Prerequisites

You must have the following installed:

* Node.js (LTS version)
* **pnpm** (as used in this project)

### Installation and Run

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd conexa-front
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will typically be available at `http://localhost:5173`.

---

## 📁 Key File Structure

| Path | Purpose | Lead Developer Notes |
| :--- | :--- | :--- |
| `src/App.jsx` | Main application layout and theme toggling logic. |
| `src/context/` | Contains `AuthContext.jsx` for global authentication state. |
| `src/services/` | Contains `apiClient.js`, `auth.service.js`, and `mercado.service.js`. **(Core Logic)** |
| `src/hooks/` | Contains custom hooks like `useMercado.js` for data fetching logic. |
| `src/pages/` | All application views (`HomePage`, `LoginPage`, `RegisterPage`). |
| `src/pages/mercado/` | Private dashboards and market-specific forms (Offers/Requests). |
| `src/components/auth/` | Contains the essential `<ProtectedRoute.jsx>`. |

---

## 🧑‍💻 Contributing & Workflow

This project uses the **GitHub Flow** branching strategy.

### Workflow:

1.  **Pull:** Always start by pulling the latest changes from `main`.
    ```bash
    git pull origin main
    ```
2.  **Branch:** Create a new feature branch for your task.
    ```bash
    git switch -C feature/task-description
    ```
3.  **Develop:** Work on isolated tasks (e.g., creating a new form, styling a card). **Do not modify files in `src/context` or `src/services` unless explicitly authorized.**
4.  **Commit:** Use clear, English commit messages.
5.  **Push:** Push your feature branch.
6.  **Pull Request (PR):** Open a PR to merge into the `develop` branch. The PR will be reviewed and approved by the Lead before merging.

### Naming Convention:

* **Branches:** `feature/new-form-name`, `fix/bug-description`
* **Components:** PascalCase (`OfferCard.jsx`, `Navbar.jsx`)****