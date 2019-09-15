# oura-challenge
Oura challenge test app

The **frontend** folder holds an Angular application as a web client and the
**backend** folder holds a Python backend server.


## NOTES:
### activating the venv

```bash
cd backend && virtualenv .env && source .env/bin/activate && pip install -r requirements.txt
```

### deploying the frontend
```bash
cd frontend/oura-app && ng deploy
```