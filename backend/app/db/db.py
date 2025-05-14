from sqlmodel import Session, create_engine

from app.config import settings

sync_engine = create_engine(settings.SYNC_DB_URL, echo=True)


def get_sync_session():
    return Session(sync_engine)
