from fastapi import FastAPI
from app.api.endpoints import router as api_router
from app.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(title="Pro Chatbot")
app.include_router(api_router, prefix="/api")


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("Backend and Redis PubSub Bridge Started")