# Check all your key files exist and have content
files = [
    'app/main.py',
    'app/config.py',
    'app/database.py',
    'app/core/security.py',
    'app/core/limiter.py',
    'app/schemas/user.py',
    'app/schemas/listing.py',
    'app/crud/user.py',
    'app/crud/listing.py',
    'app/utils/slugify.py',
    'app/utils/category_templates.py',
    'app/routers/auth.py',
    'app/routers/listings.py',
    'app/dependencies/auth.py',
    'app/middleware/error_handler.py',
]
import os
print('FILE SIZE CHECK:')
for f in files:
    exists = os.path.exists(f)
    size = os.path.getsize(f) if exists else 0
    status = '✅' if size > 50 else '❌ EMPTY/MISSING'
    print(f'{status}  {f:45s}  ({size} bytes)')