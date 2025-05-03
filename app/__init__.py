from fastapi import FastAPI
from .config import Settings
 
app = FastAPI()
settings = Settings() 