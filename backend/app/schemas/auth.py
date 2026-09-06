from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class OperatorOut(BaseModel):
    id: int
    username: str
    display_name: Optional[str] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    operator: OperatorOut

class LogoutResponse(BaseModel):
    detail: str = "Logged out"
