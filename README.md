# Birthday Messaging Service

This service is designed to send a birthday greeting to users via an email. It is created using Node.js, Express, Sequelize ORM, PostgreSQL, Docker, and Bull for job queuing. The service automatically sends birthday greetings to users at 9 AM in their local time zone. It uses cron jobs and job queues to distribute the task and ensure reliability and scalability. The service also includes a simple API to create, update or delete users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

- Docker
- Docker-compose

### Installation

1. Clone this repository
```bash
git clone <repository_url>
```
2. Navigate into the directory
```bash
cd <directory>
```
3. Use Docker Compose to build and start the services
```bash
docker-compose up --build
```
This will create and start all the services from your configuration. The app service uses nodemon, so it will automatically restart the server when file changes in the directory are detected.

After all services are up, you can run the database migrations:
```bash
npx sequelize db:migrate
```
This will create necessary tables in your PostgreSQL database.

## API Endpoints

- Create a user: POST /user
- Delete a user: DELETE /user

## Running the tests

Coming soon...

## Built With

- [Node.js](https://nodejs.org) - JavaScript runtime
- [Express.js](https://expressjs.com) - Web framework
- [Sequelize](https://sequelize.org) - Promise-based Node.js ORM
- [PostgreSQL](https://www.postgresql.org) - Open-source relational database
- [Docker](https://www.docker.com) - Platform to develop, ship, and run applications
- [Bull](https://optimalbits.github.io/bull/) - Premium Queue package for handling distributed jobs

## Authors

- Dhimas Yudha
