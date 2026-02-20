from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "worker",
    broker=f"{settings.REDIS_URL}/0",
    backend=f"{settings.REDIS_URL}/1"
)

celery_app.conf.update(
    task_track_started=True,
    imports=["app.tasks"],
    worker_concurrency=2
)