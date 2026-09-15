from fastapi import Depends, HTTPException, status
from app.dependencies.auth import get_current_user


async def require_admin(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Dependency that ensures the caller is an admin.
    Add to any route: admin: dict = Depends(require_admin)
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user