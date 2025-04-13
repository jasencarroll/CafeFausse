# Cafe Fausse

This repository holds the software artifacts for Cafe Fausse, a Quantic School of Business and Technology towards the Master of Science in Software Engineering degree.

## Backend

The backend of our web app is hosted via Flask, a lightweight web framework written in Python that helps build websites and web applications. Our web app uses packages that extend the functionality of Flask, such as `Flask-CORS`, `WTForms`, and `flask_sqlalchemy`.

Flask-SQLAlchemy is a tool that helps the Flask use a database such as the one used by our web app, PostgreSQL. To set up a PostgreSQL database on your machine, run the following commands in your terminal. For demonstration purposes, the username for the user that accesses the PostgreSQL has been set to `cafefausse` and the password for that user has been set to `aedj12sda`.

`pip install flask-sqlalchemy psycopg2-binary`
`createdb cafefausse`
`psql -U postgres`
`CREATE USER cafefausse WITH PASSWORD 'aedj12sda';`
`GRANT ALL PRIVILEGES ON DATABASE cafefausse TO myuser;`

To test that the user has read and write privileges for the new database, run the following in your terminal, then enter the password when prompted:

`psql -U myuser -d cafefausse -h localhost -W`

In the code used by the Flask web application, `app.py`, ensure that the row below contains credentials that match the credentials that are needed for authentication into the PostgreSQL database:

`postgresql://cafefausse:aedj12sda@localhost/mydatabase' db = SQLAlchemy(app)`

## Frontend

The frontend is hosted via a React app, and the React Router DOM, using Vite. The front end is further
bootstrapped with `Bootstrap`, `React Bootstrap` for styling and `Axious` for a front-end RESTful API.

## Running Development

- Run your Flask app with `python app.py` to serve the built React app.
- Run `npm start` in reactjsx-client for development with hot reloading.
- Open `http://localhost:8080` in your favorite browser.
