from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.blacklist import BlacklistOut, BlacklistCreate, BlacklistDeleteResponse
from app.services.blacklist_service import (
    get_all_blacklist,
    create_blacklist_entry,
    delete_blacklist_entry
)
from app.api.deps import get_optional_operator
from app.models.operator import Operator

router = APIRouter(prefix="/blacklist", tags=["blacklist"])

@router.get("", response_model=List[BlacklistOut])
async def list_blacklist(db: AsyncSession = Depends(get_db)):
    return await get_all_blacklist(db)

@router.post("", response_model=BlacklistOut, status_code=status.HTTP_201_CREATED)
async def add_to_blacklist(
    payload: BlacklistCreate,
    current_operator: Operator = Depends(get_optional_operator),
    db: AsyncSession = Depends(get_db)
):
    try:
        operator_id = current_operator.id if current_operator else None
        return await create_blacklist_entry(
            session=db,
            entry=payload,
            operator_id=operator_id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )

@router.delete("/{entry_id}", response_model=BlacklistDeleteResponse)
async def remove_from_blacklist(
    entry_id: int,
    current_operator: Operator = Depends(get_optional_operator),
    db: AsyncSession = Depends(get_db)
):
    success = await delete_blacklist_entry(session=db, item_id=entry_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blacklist entry not found")
    return BlacklistDeleteResponse(detail="Removed from restricted list")
