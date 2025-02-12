<h1>My-BookCase</h1> <br>
A simple full-stack application that fetches book details from the Open Library API, stores them in a PostgreSQL database, and allows users to log in, sign up, and view the books. <br>
**Features**: <br>
Fetches Book Data: Retrieves book details for predefined ISBNs (e.g., "The Alchemist" and "Ikigai") from the Open Library API. <br>
User Authentication: Allows users to sign up and log in securely. <br>
Database Integration: Stores book details and user data in a PostgreSQL database. <br>
Responsive UI: Displays book information (title, author, cover) and allows users to interact with the application. <br>
**Tech Stack**<br>
Backend: Node.js, Express.js <br>
Database: PostgreSQL <br>
Frontend: EJS, HTML, CSS <br>
API: Open Library API <br>
Environment Variables: dotenv <br>
**Installation**
Clone the repository: git clone https://github.com/your-username/book-management-system.git
cd book-management-system
<br>
Install the required dependencies: npm install <br>
Set up your PostgreSQL database. You need to create a database and a book and userdata table.
<br>
Create a .env file in the root directory and add your PostgreSQL credentials: 
database=your-database-name
password=your-database-password

Start the application:
npm start

