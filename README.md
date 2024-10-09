# TODO List App

This is a simple TODO list application built with React (TypeScript), Node.js (TypeScript), and PostgreSQL.

## Features

- **View TODOs:** Display a list of TODO items with their names and statuses.
- **Add TODOs:** Add new TODO items to the list.
- **Update TODOs:** Edit the name and status of existing TODO items.
- **Delete TODOs:** Remove TODO items from the list.

## Technologies Used

- **Frontend:** React with TypeScript, Ant Design
- **Backend:** Node.js with TypeScript, Express.js, pg (PostgreSQL client)
- **Database:** PostgreSQL

## Prerequisites

- Node.js and npm (or yarn)
- PostgreSQL

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [URL inválido removido]
    ```

2.  **Install dependencies:**

    ```bash
    cd todo-list-app
    cd frontend
    npm install
    cd ..
    cd backend
    npm install
    ```

3.  **Set up the database:**

    - Install PostgreSQL.
    - Create a new database (e.g., `todo_db`).
    - Create a database user and grant privileges.
    - Connect to the database using `psql` or a database client.
    - Run the following SQL command to create the `todos` table:

    ```sql
    CREATE TABLE todos (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'pending'
    );
    ```

4.  **Configure database connection:**

    - Update the `backend/index.ts` file with your PostgreSQL database credentials:

    ```typescript
    const pool = new Pool({
      user: "db_user",
      host: "db_host",
      database: "db_name",
      password: "db_password",
      port: 5432,
    });
    ```

## Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**

    ```bash
    cd frontend
    npm start
    ```

    This will open the app in your web browser.

## Testing

- **Run tests:**

  ```bash
  npm run test:frontend  // Frontend tests
  npm run test:backend   // Backend tests
  ```

## Screenshots

## Contributing

- Fork the repository.
- Create a new branch for your feature.
- Make your changes and commit them.
- Push your changes to your fork.
- Submit a pull request.

## License

- This project is licensed under the MIT License.
