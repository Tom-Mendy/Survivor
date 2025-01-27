from passlib.context import CryptContext
from pydantic import SecretStr

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verifyPassword(plain_password: SecretStr, hashed_password: str):
    return pwd_context.verify(plain_password.get_secret_value(),
                              hashed_password)


def getPasswordHash(password: str):
    return pwd_context.hash(password)
