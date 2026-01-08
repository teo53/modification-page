"""
QueenAlba Credentials Management

This module loads credentials from environment variables.
DO NOT hardcode any passwords or sensitive information in this file.

Setup:
1. Copy .env.example to .env
2. Fill in your credentials in .env
3. Never commit .env to version control
"""

import os
from pathlib import Path
from typing import Optional, TypedDict


class QueenAlbaCredentials(TypedDict):
    site: str
    username: str
    password: str
    notes: str


def load_credentials() -> Optional[QueenAlbaCredentials]:
    """
    Load credentials from environment variables.

    Environment variables:
    - QUEENALBA_USERNAME: Your login username
    - QUEENALBA_PASSWORD: Your login password

    Returns:
        QueenAlbaCredentials dict or None if not configured
    """
    username = os.getenv("QUEENALBA_USERNAME")
    password = os.getenv("QUEENALBA_PASSWORD")

    if not username or not password:
        return None

    return {
        "site": "queenalba.net",
        "username": username,
        "password": password,
        "notes": "Loaded from environment variables"
    }


def validate_credentials(username: str, password: str) -> bool:
    """
    Validate that credentials meet basic requirements.

    Args:
        username: The username to validate
        password: The password to validate

    Returns:
        True if credentials are valid format, False otherwise
    """
    if not username or not isinstance(username, str):
        return False
    if not password or not isinstance(password, str):
        return False
    if len(username) < 3:
        return False
    if len(password) < 4:
        return False
    return True


# Load credentials from environment on import
QUEENALBA_CREDENTIALS = load_credentials()


# Support for loading from .env file using python-dotenv
def load_dotenv_credentials() -> Optional[QueenAlbaCredentials]:
    """
    Attempt to load credentials from .env file using python-dotenv.
    Falls back to environment variables if python-dotenv is not installed.
    """
    try:
        from dotenv import load_dotenv

        # Look for .env file in scraper directory or project root
        scraper_dir = Path(__file__).parent
        project_root = scraper_dir.parent

        env_paths = [
            scraper_dir / ".env",
            project_root / ".env",
        ]

        for env_path in env_paths:
            if env_path.exists():
                load_dotenv(env_path)
                break

    except ImportError:
        pass  # python-dotenv not installed, use system env vars

    return load_credentials()


# Reload credentials with dotenv support
QUEENALBA_CREDENTIALS = load_dotenv_credentials()
