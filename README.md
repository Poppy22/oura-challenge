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
