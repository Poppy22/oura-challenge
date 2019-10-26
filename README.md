# oura-challenge
Oura challenge app

![homepage](./images/homepage.png?raw=true)

# Requirements
The proposed requirements at the beginning of the project are:
- Python backend: user authentication, account management
- Backend communication with OuraAPI
- Frontend user login
- Data visualisation interface
- Friendly UI

# Structure

The **frontend** folder holds an Angular application as a web client and the
**backend** folder holds a Python backend server.

## environment variables
Environment variables' basic structure is in `.envrc.example` (we recommend using the package direnv for
easily setting/unsetting them). Just duplicate the file to `.envrc` to make it work.

More than this, in `frontend/oura-app/src/environments/` you can find base url settings for the Angular
communication with the backend server.

## activating the venv
```bash
cd backend && virtualenv .env && source .env/bin/activate # set a new virtual environment
pip install -r requirements.txt # install backend dependencies
```


## deploying the frontend
```bash
cd frontend/oura-app && npm install # install frontend dependencies
ng serve # run the angular server locally
ng deploy # deploy to github pages
```

# Backend stack
- Flask for REST API
- flask-jwt-extended for Oauth user authentication
- shelve for database mocking
- marshmallow for User schema
- sha256 encryption

# Frontend stack
- Angular 7 framework
- Angular Material UI for components
- Angular Reactive forms
- RxJS Observers
- ng2-charts
- angular-cli-ghpages for deployment

# User stories
- create an account, login, logout, edit my account
- access an Oura ring dataset
- see last night’s sleep stats
- find out the best day of the week in terms of sleep in the last 30 days
- check your sleep performance from previous months
- compare recorded parameters to find correlations

## Example usage
![usage](./images/usage.gif?raw=true)

# Interface preview

![login](./images/login.png?raw=true)
![edit](./images/edit.png?raw=true)
![graph](./images/graph.png?raw=true)
