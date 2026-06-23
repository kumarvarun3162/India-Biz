from pwdlib import PasswordHash

# .recommended() picks Argon2id — the strongest default available
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a plaintext password before storing it in MongoDB."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare a login attempt's plaintext password against the stored hash."""
    return password_hash.verify(plain_password, hashed_password)