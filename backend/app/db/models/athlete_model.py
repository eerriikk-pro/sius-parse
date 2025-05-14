from sqlmodel import Field

from app.db.models.common import TimestampModel


class Athletes(TimestampModel, table=True):
    __tablename__ = "athletes"

    id: int = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    active: bool = True

    def __repr__(self):
        return f"<Athletes (id: {self.id}, name: {self.first_name} {self.last_name})>"
