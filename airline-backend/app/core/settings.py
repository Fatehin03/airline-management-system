import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkyLink Airlines"
    
    # --- Database Settings ---
    # Using Field(validation_alias) is the modern Pydantic way to link to ENV vars.
    # The default is provided as a fallback for local development.
    DATABASE_URL: str = Field(
        "postgresql://user:pass@localhost:5432/dbname", 
        validation_alias="DATABASE_URL"
    )
    
    # --- Security Settings ---
    SECRET_KEY: str = Field(
        "super-secret-key-change-this", 
        validation_alias="SECRET_KEY"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # --- Frontend/CORS ---
    FRONTEND_URL: str = Field(
        "https://airline-frontend2.onrender.com", 
        validation_alias="FRONTEND_URL"
    )
    
    # --- SMTP Settings ---
    SMTP_HOST: str = Field("", validation_alias="SMTP_HOST")
    SMTP_PORT: int = Field(587, validation_alias="SMTP_PORT")
    SMTP_USERNAME: str = Field("", validation_alias="SMTP_USERNAME")
    SMTP_PASSWORD: str = Field("", validation_alias="SMTP_PASSWORD")
    SMTP_FROM_EMAIL: str = Field("no-reply@skylink.com", validation_alias="SMTP_FROM_EMAIL")
    SMTP_USE_TLS: bool = True

    # --- Pydantic Configuration ---
    # We use SettingsConfigDict in Pydantic V2 instead of 'class Config'
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"  # Prevents crashing if extra env vars are in Render
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_postgres_protocol(cls, v: str) -> str:
        """
        Fixes the 'postgres://' vs 'postgresql://' issue and 
        removes pgbouncer flags that crash psycopg2.
        """
        if v and v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql://", 1)
        
        # Remove any ?pgbouncer=true because psycopg2 (SQLAlchemy) doesn't recognize it
        return v.split("?")[0]

# Initialize settings
settings = Settings()
