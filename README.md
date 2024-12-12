## Fake Reddit (Phreddit) Application 
This application is inspired by the actual reddit.com. The application will be developed using the
React framework for the front end. For the backend, the application will use MongoDB, a non-
relational database. The web server will be in Nodejs using the Express framework for server-
side routing. The application stores and uses passwords hashes (or digests) for authentication,
using the bcrypt library in Node.

The outline of Phreddit follows the instructor specifications given during the course.

## Instructions to setup and run project
Server Setup:
1. Initialize the Database:
    $ node init.js mongodb://127.0.0.1:27017/phreddit email username password
    example: $ node init.js mongodb://127.0.0.1:27017/phreddit admin@gmail.com admin1 123
2. Install Server Dependencies:
    $ npm install
3. Start the Server:
    $ nodemon server.js

Client Setup:
1. Install Client Dependencies:
    $ npm install
2. Start the Client:
    $ npm start

## Running all Tests:
1. Navigate to root directory containing client and server
2. Run: npm test

## Running the Test (express and mongoDB):
1. Navigate to the server directory.
2. Run the tests with: npm test

## Running the Test (react):
1. Navigate to the client directory.
2. Run the tests with: npm test