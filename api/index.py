from mangum import Mangum
from backend.app.main import app

# Create the Mangum handler for Vercel
handler = Mangum(app)