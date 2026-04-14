from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Jarvis Backend Gateway")

# Serve static files (HTML, CSS, JS)
app.mount("/", StaticFiles(directory=".", html=True), name="static")

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login(req: LoginRequest):
    # This is where the Agno Agent would eventually validate or route
    return {"status": "success", "message": f"Login received for {req.email}"}

if __name__ == "__main__":
    print("🚀 JARVIS COMMAND CENTER: Servidor iniciado em http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
