from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SubscriptionBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    duration_days: int
    features: list[str]

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(SubscriptionBase):
    name: Optional[str] = None
    price: Optional[float] = None
    duration_days: Optional[int] = None
    features: Optional[list[str]] = None

class SubscriptionInDB(SubscriptionBase):
    id: str
    created_at: datetime
    updated_at: datetime

class Subscription(SubscriptionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 