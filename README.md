# Cafe Fausse

This repository holds the software artifacts for Cafe Fausse, a Quantic School of Business and Technology towards the Master of Science in Software Engineering degree.

This was developed using MacOS and as such the instructions that follow demonstrate MacOS.

## Backend Design & Postgres Setup

The backend of our web app is hosted via Flask, a lightweight web framework written in Python that helps build websites and web applications. Our web app uses packages that extend the functionality of Flask, such as `Flask-CORS` and `flask_sqlalchemy`.

Flask-SQLAlchemy is a tool that helps the Flask use a database such as the one used by our web app, PostgreSQL. To set up a PostgreSQL database on your machine, run the following commands in your terminal. For demonstration purposes, the username for the user that accesses the PostgreSQL has been set to `cafefausse` and the password for that user has been has been randomly generated and saved in a `.env` file. An example of what is necessary is stored as `.env.example` in this repo. For this technique, we use `dotenv` and set the db as follows in lines 16-18 of `app.py`:

```python
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)
```

To get started, we'll begin with PostgreSQL.

```bash
psql -U postgres
```

Enter these one line at a time:

```SQL
CREATE DATABASE cafefausse;
CREATE USER cafefausse WITH PASSWORD 'password-here';
GRANT ALL PRIVILEGES ON DATABASE cafefausse TO cafefausse;
```

To test that the user has read and write privileges for the new database, run the following in your terminal, then enter the password when prompted:

`psql -U myuser -d cafefausse -h localhost -W`

## Frontend Design

The frontend is hosted via a React app, and the React Router DOM, using Vite. The front end is further
bootstrapped with `Bootstrap`, `React Bootstrap` for styling and `Axios` for a front-end RESTful API.

## Running Development

### Backend

- Complete the steps above with PostgreSQL.
- `cp .env.example .env` and update the file with your PostgreSQL User password.
- Start a virtual env in the `Flask-backend` directory by `python -m venv .venv`.
- Activate the virtual env with `source .venv/bin/activate`.
- Install the requirements with `pip install -r requirements.txt`
- Run your Flask app with Gunicorn using `python app.py` to serve the API for the React app.*
- Once that is successful you can switch to using a production server with Gunicorn by `gunicorn app:app -b 127.0.0.1:5000`.

### Frontend

- Navigate to `reactjsx-client`
- Run `npm install` in this directory.
- Run `npm start` in reactjsx-client for development with hot reloading.
- Open `http://localhost:8080` in your favorite browser.

### Troubleshooting

*Note: Sometimes you will still get a permission error for the new user you created even if you successfully granted them permission earlier. You'll need to follow:

- go to postgres as postgres `psql -U postgres`

Enter the following commands one by one.

```SQL
ALTER DATABASE cafefausse OWNER TO cafefausse;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cafefausse;
GRANT USAGE, CREATE ON SCHEMA public TO cafefausse;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cafefausse;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cafefausse;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cafefausse;
```


https://github.com/jasencarroll/CafeFausse