from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..models.subscription import Subscription, SubscriptionCreate, SubscriptionUpdate
from ..core.security import get_current_user
from ..models.user import User

router = APIRouter()

@router.get("/", response_model=List[Subscription])
async def read_subscriptions(current_user: User = Depends(get_current_user)):
    # TODO: Implement subscription listing
    pass

@router.post("/", response_model=Subscription)
async def create_subscription(
    subscription: SubscriptionCreate,
    current_user: User = Depends(get_current_user)
):
    # TODO: Implement subscription creation
    pass

@router.get("/{subscription_id}", response_model=Subscription)
async def read_subscription(
    subscription_id: str,
    current_user: User = Depends(get_current_user)
):
    # TODO: Implement subscription retrieval
    pass

@router.put("/{subscription_id}", response_model=Subscription)
async def update_subscription(
    subscription_id: str,
    subscription_update: SubscriptionUpdate,
    current_user: User = Depends(get_current_user)
):
    # TODO: Implement subscription update
    pass

@router.delete("/{subscription_id}")
async def delete_subscription(
    subscription_id: str,
    current_user: User = Depends(get_current_user)
):
    # TODO: Implement subscription deletion
    pass 