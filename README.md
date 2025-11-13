# TaskFlow: A Full-Stack Kanban Board

A Trello-like Kanban board application built as a full-stack portfolio project. It features a **Laravel 10** REST API backend, a **React (Vite)** frontend, and **MySQL**, all fully containerized with **Docker Compose**.

---

## 🚀 Technology Stack

* **Backend:** PHP 8.3, Laravel 12
* **Frontend:** React 18, Vite.js
* **Database:** MySQL 8.0
* **Web Server:** Nginx
* **Containerization:** Docker & Docker Compose

## ✨ Key Features

* User authentication (Registration, Login).
* Create, Read, Update, Delete (CRUD) operations for Boards.
* CRUD operations for Task Cards.
* Drag-and-drop functionality for tasks between columns (To-Do, In Progress, Done).
* RESTful API.

---

## 📦 Getting Started (Manual Setup)

This project is containerized, but requires a few manual setup steps after the first launch.

### Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* [Git](https://git-scm.com/) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/viktortoman/portfolio-fullstack-kanban-laravel-react.git](https://github.com/viktortoman/portfolio-fullstack-kanban-laravel-react.git)
    cd portfolio-fullstack-kanban-laravel-react
    ```

2.  **Create the Docker Environment File:**
    Create a file named `.env` in the project's root directory:
    ```ini
    MYSQL_ROOT_PASSWORD=root_secret
    ```

3.  **Create the Laravel `.env` File:**
    The backend needs its own configuration.
    ```bash
    cp backend/.env.example backend/.env
    ```
    Now, edit the `backend/.env` file. Make sure the database settings match the `docker-compose.yml` file:
    ```ini
    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=kanban_db
    DB_USERNAME=kanban_user
    DB_PASSWORD=kanban_password
    ```

4.  **Build and Run the Containers:**
    ```bash
    docker-compose up -d --build
    ```
    **Wait** about 30-60 seconds for the database container to initialize. You can check its status with `docker-compose logs -f db`.

5.  **Run Manual Setup Commands:**
    Now that the containers are running, you must run the following setup commands **one by one**:

    ```bash
    # 1. Install laravel extensions
    docker-compose exec app composer install

    # 2. Generate application key
    docker-compose exec app php artisan key:generate

    # 3. Run migrations
    docker-compose exec app php artisan migrate
    ```

That's it! The services are now running and configured.

## 🌐 Environment & Access Points

Once `docker-compose up` is complete, the environment is ready:

### 1. Frontend (React Client)

* **Access:** `http://localhost:5173`
* **Location:** `/frontend` directory
* **Details:** This is the Vite development server. It features Hot Module Replacement (HMR), so any changes you make to the React code will be reflected instantly in your browser.
* **API Proxy:** The Vite server is configured to proxy all requests starting with `/api` to the backend Nginx server (`http://localhost:8080`), avoiding any CORS issues during development.

### 2. Backend (Laravel API)

* **Access:** `http://localhost:8080`
* **Location:** `/backend` directory
* **Details:** This is the Nginx server, which routes API requests to the `php-fpm` (Laravel) container. You can access all your API routes here (e.g., `http://localhost:8080/api/users`).
* **Automation:** The container's entrypoint script (`entrypoint.sh`) handles all setup (composer, migrations, keys).

### 3. Database (MySQL)

* **Access (Host):** `localhost:3306`
* **Access (Container):** The Laravel app connects to it via the service name `db`.
* **Credentials:** As defined in `docker-compose.yml` and `backend/.env`:
    * **Database:** `kanban_db`
    * **User:** `kanban_user`
    * **Password:** `kanban_password`
* **Persistence:** Database data is stored in a Docker volume (`kanban_db_data`) so it persists even when you stop or remove the containers.

---

### Useful Docker Commands

* **To stop the containers:**
    ```bash
    docker-compose down
    ```
* **To see the logs (e.g., for the 'app' service):**
    ```bash
    docker-compose logs -f app
    ```
* **To run an Artisan command:**
    ```bash
    docker-compose exec app php artisan <your-command>
    ```
  *(Example: `docker-compose exec app php artisan make:controller TaskController --api`)*