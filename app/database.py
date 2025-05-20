from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client: AsyncIOMotorClient = None

async def init_db():
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
async def get_database():
    return client[settings.MONGODB_DB_NAME]

async def close_db():
    if client:
        client.close()