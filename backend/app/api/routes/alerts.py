from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.alert import AlertOut, AlertListResponse
from app.services.alert_service import get_alerts, resolve_alert
from app.api.deps import get_current_operator, get_optional_operator
from app.models.operator import Operator

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=AlertListResponse)
async def list_alerts(
    status_filter: Optional[str] = Query("active", alias="status", description="Filter by status: 'active', 'resolved', 'all'"),
    severity: Optional[str] = Query(None, description="Filter by severity: 'critical', 'warning'"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=200, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    return await get_alerts(
        session=db,
        status=status_filter,
        severity=severity,
        page=page,
        limit=limit
    )

@router.patch("/{alert_id}/resolve", response_model=AlertOut)
async def resolve_single_alert(
    alert_id: int,
    current_operator: Optional[Operator] = Depends(get_optional_operator),
    db: AsyncSession = Depends(get_db)
):
    try:
        operator_id = current_operator.id if current_operator else None
        return await resolve_alert(session=db, alert_id=alert_id, operator_id=operator_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
