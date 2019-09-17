# oura-challenge
Oura challenge test app

The **frontend** folder holds an Angular application as a web client and the
**backend** folder holds a Python backend server.


## NOTES:
### environment variables
Environment variables' basic structure is in `.envrc.example` (we recommend using the package direnv for
easily setting/unsetting them). Just duplicate the file to `.envrc` to make it work.

### activating the venv

```bash
cd backend && virtualenv .env && source .env/bin/activate && pip install -r requirements.txt
```

### deploying the frontend
```bash
cd frontend/oura-app && ng deploy
```