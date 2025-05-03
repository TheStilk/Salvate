from fastapi import APIRouter, Depends
from ..core.security import get_current_user
from ..models.user import User
from ..database import get_database
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    db = await get_database()
    
    # Get total users count
    total_users = await db.users.count_documents({})
    
    # Get active subscriptions count
    active_subscriptions = await db.subscriptions.count_documents({
        "status": "active",
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    # Calculate total revenue from active subscriptions
    active_subscriptions_cursor = db.subscriptions.find({
        "status": "active",
        "expires_at": {"$gt": datetime.utcnow()}
    })
    revenue = 0.0
    async for subscription in active_subscriptions_cursor:
        revenue += subscription.get("price", 0)
    
    return {
        "total_users": total_users,
        "active_subscriptions": active_subscriptions,
        "revenue": revenue
    }

@router.get("/recent-activity")
async def get_recent_activity(current_user: User = Depends(get_current_user)):
    db = await get_database()
    
    # Get recent subscriptions
    recent_subscriptions = []
    async for subscription in db.subscriptions.find({
        "created_at": {"$gte": datetime.utcnow() - timedelta(days=7)}
    }).sort("created_at", -1).limit(10):
        subscription["id"] = str(subscription["_id"])
        del subscription["_id"]
        recent_subscriptions.append(subscription)
    
    # Get recent user registrations
    recent_users = []
    async for user in db.users.find({
        "created_at": {"$gte": datetime.utcnow() - timedelta(days=7)}
    }).sort("created_at", -1).limit(10):
        user["id"] = str(user["_id"])
        del user["_id"]
        del user["hashed_password"]
        recent_users.append(user)
    
    return {
        "recent_subscriptions": recent_subscriptions,
        "recent_users": recent_users
    } 