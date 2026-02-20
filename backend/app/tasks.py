from app.core.validation import is_in_domain
from app.core.llm import SYSTEM_PROMPT
import json
import redis
from app.celery_app import celery_app
from app.core.config import settings
from openai import OpenAI

r_client = redis.from_url(f"{settings.REDIS_URL}/2", decode_responses=True)
openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

@celery_app.task(name="process_chat")
def process_chat_task(client_id: str, query: str):
    # 1️⃣ Validation
    if not is_in_domain(query):
        r_client.publish("chat_responses", json.dumps({
            "client_id": client_id,
            "message": "من فقط می‌تونم درباره رزومه و تجربه‌های کاری آرش پاسخ بدم.",
            "status": "error"
        }))
        return

    # 2️⃣ History
    history_key = f"chat:{client_id}"
    history_data = r_client.get(history_key)
    history = json.loads(history_data) if history_data else []

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history[-6:])
    messages.append({"role": "user", "content": query})

    try:
        response = openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            temperature=0.6,
            max_tokens=600
        )

        answer = response.choices[0].message.content

        history.extend([
            {"role": "user", "content": query},
            {"role": "assistant", "content": answer}
        ])

        r_client.setex(
            history_key,
            settings.SESSION_TTL,
            json.dumps(history[-10:])
        )

        r_client.publish("chat_responses", json.dumps({
            "client_id": client_id,
            "message": answer,
            "status": "success"
        }))

    except Exception:
        r_client.publish("chat_responses", json.dumps({
            "client_id": client_id,
            "message": "خطا در ارتباط با مدل.",
            "status": "error"
        }))
