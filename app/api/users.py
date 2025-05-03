from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..models.user import User, UserUpdate
from ..core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[User])
async def read_users(current_user: User = Depends(get_current_user)):
    # TODO: Implement user listing
    pass

@router.get("/{user_id}", response_model=User)
async def read_user(user_id: str, current_user: User = Depends(get_current_user)):
    # TODO: Implement user retrieval
    pass

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    # TODO: Implement user update
    pass

@router.delete("/{user_id}")
async def delete_user(user_id: str, current_user: User = Depends(get_current_user)):
    # TODO: Implement user deletion
    pass 