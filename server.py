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

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login(req: LoginRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase connection not configured.")
    
    try:
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

@app.post("/api/register")
async def register(req: LoginRequest):
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not SUPABASE_URL or not SERVICE_KEY:
        raise HTTPException(status_code=500, detail="Service Role Key não configurada.")
    
    admin_supabase = create_client(SUPABASE_URL, SERVICE_KEY)
    
    try:
        res = admin_supabase.auth.admin.create_user({
            "email": req.email,
            "password": req.password,
            "email_confirm": True,
            "user_metadata": {"role": "member", "access": ["dashboard"]}
        })
        
        return {
            "status": "success", 
            "message": "Usuário criado e confirmado com sucesso!",
            "user_id": res.user.id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro no Cadastro Admin: {str(e)}")

@app.get("/api/users")
async def list_users():
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    admin_supabase = create_client(SUPABASE_URL, SERVICE_KEY)
    
    try:
        # Lista todos os usuários (limite de 50 para teste)
        res = admin_supabase.auth.admin.list_users()
        users_data = []
        for user in res:
            users_data.append({
                "id": user.id,
                "email": user.email,
                "last_login": user.last_sign_in_at,
                "role": user.user_metadata.get("role", "member"),
                "access": user.user_metadata.get("access", ["dashboard"])
            })
        return users_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar usuários: {str(e)}")

class PermissionUpdate(BaseModel):
    user_id: str
    role: str
    access: list[str]

@app.post("/api/users/update")
async def update_user_permissions(req: PermissionUpdate):
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    admin_supabase = create_client(SUPABASE_URL, SERVICE_KEY)
    
    try:
        admin_supabase.auth.admin.update_user_by_id(
            req.user_id,
            {"user_metadata": {"role": req.role, "access": req.access}}
        )
        return {"status": "success", "message": "Permissões atualizadas."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar: {str(e)}")

@app.get("/api/history")
async def get_history():
    # Por enquanto, retorna um histórico simulado para evitar erros de log
    # Em breve conectaremos ao banco de dados Supabase
    return [
        {"role": "system", "content": "Sistema Jarvis Inicializado."},
        {"role": "user", "content": "Olá Jarvis."},
        {"role": "assistant", "content": "Bem-vindo ao Command Center. Como posso ajudar hoje?"}
    ]

# MONTAR ESTÁTICOS NA RAIZ (DEVE SER A ÚLTIMA ROTA)
# Isso permite que / e /style.css funcionem perfeitamente.
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    print("🚀 JARVIS COMMAND CENTER: Servidor local iniciado em http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
