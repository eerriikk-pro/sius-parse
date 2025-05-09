import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    ENV: str = "dev"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    _BASE_URL: str = f"https://{HOST}:{PORT}"
    # quantity of workers for uvicorn
    WORKERS_COUNT: int = 1
    # Enable uvicorn reloading
    RELOAD: bool = False
    # Database settings
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASS: str = "postgres"
    _DB_BASE: str = "postgres"
    DB_ECHO: bool = False

    @property
    def DB_BASE(self):
        return self._DB_BASE

    @property
    def BASE_URL(self) -> str:
        return self._BASE_URL if self._BASE_URL.endswith("/") else f"{self._BASE_URL}/"

    @property
    def DB_URL(self) -> str:
        """
        Assemble Database URL from settings.

        :return: Database URL.
        """

        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_BASE}"

    @property
    def SYNC_DB_URL(self) -> str:
        """
        Assemble sync Database URL for use with Alembic.

        :return: Sync-compatible Database URL.
        """
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_BASE}"

    JWT_SECRET_KEY: str
    BCRYPT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = {
        "env_file": os.path.expanduser("~/.envs/rrgc.env"),
        "env_file_encoding": "utf-8",
        "populate_by_name": True,
    }


settings = Settings()
