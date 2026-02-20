import json
import asyncio
import redis.asyncio as aioredis
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request
from pydantic import BaseModel

from app.core.config import settings
from app.tasks import process_chat_task
from app.core.llm import SYSTEM_PROMPT, client, stream_openai_response
from app.utils.logger import get_logger


logger = get_logger(__name__)
router = APIRouter()

# -----------------------
# POST /chat for Swagger
# -----------------------
class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: Request, body: ChatRequest):
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": body.message}
        ]
    )
    return {"response": response.choices[0].message.content}


# -----------------------
# WebSocket /ws/chat with Worker + Redis Rate Limit
# -----------------------
RATE_WINDOW = 60
MAX_MESSAGES = 5 

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    client_ip = websocket.client.host if websocket.client else "unknown"
    client_id = f"{client_ip}_{id(websocket)}"

    redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

    pubsub = redis.pubsub()
    await pubsub.subscribe("chat_responses")

    async def listen_worker():
        async for message in pubsub.listen():
            if message["type"] == "message":
                data = json.loads(message["data"])
                if data["client_id"] == client_id:
                    await websocket.send_text(data["message"])

    listener = asyncio.create_task(listen_worker())

    try:
        while True:
            query = await websocket.receive_text()

            # ---------- Redis-based Rate Limit ----------
            rate_key = f"ws_rate:{client_ip}"
            count = await redis.incr(rate_key)
            if count == 1:
                await redis.expire(rate_key, RATE_WINDOW)
            if count > MAX_MESSAGES:
                await websocket.send_text("Rate limit exceeded. Try later.")
                continue
            # --------------------------------------------

            process_chat_task.delay(client_id, query)  # type: ignore

    except WebSocketDisconnect:
        listener.cancel()
    finally:
        await pubsub.unsubscribe("chat_responses")
        await redis.close()


