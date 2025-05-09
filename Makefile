# Makefile

.PHONY: migrate lint makemigrations lint-fix help

ALEMBIC_CMD=alembic

help:
	@echo "Makefile commands:"
	@echo "  make migrate           Apply Alembic migrations"
	@echo "  make makemigrations    Autogenerate Alembic migration scripts"
	@echo "  make lint              Run linting"
	@echo "  make lint-fix          Auto-fix code style and remove unused imports"

migrate:
	$(ALEMBIC_CMD) upgrade head

makemigrations:
	$(ALEMBIC_CMD) revision --autogenerate -m "auto migration"

lint:
	ruff check .

lint-fix:
	ruff check . --fix
