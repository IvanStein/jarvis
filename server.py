import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
import uvicorn

# Load Environment Variables
load_dotenv()

# Supabase Setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("⚠️  AVISO: Credenciais do Supabase não encontradas no .env")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

app = FastAPI(title="Jarvis Backend Gateway")

# Serve static files (HTML, CSS, JS) from root
app.mount("/static", StaticFiles(directory="."), name="static")

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login(req: LoginRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase connection not configured.")
    
    try:
        # Tenta autenticar via Supabase Auth
        res = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        
        return {
            "status": "success", 
            "user_id": res.user.id,
            "session": res.session.access_token
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Erro de Autenticação: {str(e)}")

@app.get("/")
async def root():
    # Retorna o index.html na raiz para facilitar o deploy na Vercel
    with open("index.html", "r", encoding="utf-8") as f:
        from fastapi.responses import HTMLResponse
        return HTMLResponse(content=f.read())

if __name__ == "__main__":
    print("🚀 JARVIS COMMAND CENTER: Servidor local iniciado em http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
