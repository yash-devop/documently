from sqlalchemy.ext.asyncio import create_async_engine
from app.config.settings import settings
DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(DATABASE_URL)
