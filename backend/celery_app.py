from celery import Celery
import os

# For Windows local dev without Docker, we use SQLite as the broker and backend.
# In a real Docker deployment, this would be: 
# broker_url = 'redis://redis:6379/0'
db_path = os.path.join(os.path.dirname(__file__), 'celerydb.sqlite')
broker_url = f'sqla+sqlite:///{db_path}'
result_backend = f'db+sqlite:///{db_path}'

celery_app = Celery(
    "detect_ai_tasks",
    broker=broker_url,
    backend=result_backend,
    include=['image.tasks']
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    worker_concurrency=2, # Limit concurrency on local dev
)
