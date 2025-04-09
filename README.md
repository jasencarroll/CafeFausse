# Cafe Fausse

This repository holds the software artifacts for Cafe Fausse, a Quantic Univesity project as part
the MSSE.

## Backend

The backend is hosted via Flask.

## Frontend

The frontend is hosted via a React app, and the React Router DOM, using Vite.

## Development

Development flow:

- Run `npm start` in reactjsx-client for development with hot reloading
- When ready for production, run `npm run` build to build the React app
- Manually move the `index.html` to the `templates` folder from `static/assets/` under flask. 
- Run your Flask app with `python app.py` to serve the built React app

For the development workflow, your React app will run on port 8080 independently. For production, Flask will serve your built React app on its port (5000 by default).
