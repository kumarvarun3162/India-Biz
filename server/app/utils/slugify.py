import re
import secrets
import string


def slugify(text: str) -> str:
    """
    Convert a business name to a URL-safe slug with a unique suffix.

    'Varun Hardware Store' → 'varun-hardware-store-k8x2p1'
    """
    # Lowercase everything
    slug = text.lower()

    # Replace spaces and underscores with hyphens
    slug = re.sub(r"[\s_]+", "-", slug)

    # Remove anything that's not a letter, digit, or hyphen
    slug = re.sub(r"[^a-z0-9-]", "", slug)

    # Collapse multiple consecutive hyphens into one
    slug = re.sub(r"-+", "-", slug)

    # Strip leading/trailing hyphens
    slug = slug.strip("-")

    # Append a 6-character alphanumeric suffix for uniqueness
    alphabet = string.ascii_lowercase + string.digits
    suffix = "".join(secrets.choice(alphabet) for _ in range(6))

    return f"{slug}-{suffix}"