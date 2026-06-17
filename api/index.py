import sys
sys.path.insert(0, '.')

from backend.main import app

# Vercel serverless handler
handler = app
