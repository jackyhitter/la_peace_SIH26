from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, OperatorOut, LogoutResponse
from app.services.auth_service import authenticate_operator, create_access_token
from app.api.deps import get_current_operator
from app.models.operator import Operator

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(
    req: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    operator = await authenticate_operator(db, username=req.username, password=req.password)
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": operator.username, "id": operator.id})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        operator=OperatorOut(
            id=operator.id,
            username=operator.username,
            display_name=operator.display_name
        )
    )

@router.post("/logout", response_model=LogoutResponse)
async def logout(
    current_operator: Operator = Depends(get_current_operator)
):
    return LogoutResponse(detail="Logged out")
