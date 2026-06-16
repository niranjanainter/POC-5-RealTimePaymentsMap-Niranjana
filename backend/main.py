from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Crucial: The variable must be named 'app' exactly so 'uvicorn main:app' runs perfectly
app = FastAPI(title="Real-Time Payments Map Intelligence Engine")

# Enable CORS so your Next.js frontend can securely fetch this data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schema data model matching all required telemetry layers
class PaymentRail(BaseModel):
    id: str
    name: str
    region: str
    country_code: str
    efficiency: str
    integrity: str
    volume_trend: str
    why_this_matters: str
    who_controls: str
    coordinates: list[float]
    launch_year: str

# Structured database entries modeled directly from institutional specifications
RAILS_DB = {
    "fednow": {
        "id": "fednow",
        "name": "FedNow",
        "region": "United States",
        "country_code": "US",
        "efficiency": "Instant (< 2 seconds)",
        "integrity": "24/7/365 continuous uptime",
        "volume_trend": "Exponential growth stage",
        "why_this_matters": "Provides immediate interbank settlement across the US, mitigating counterparty risk and freeing up trapped liquidity.",
        "who_controls": "The Federal Reserve System (US Central Bank Administration).",
        "coordinates": [38.8951, -77.0364],
        "launch_year": "2023"
    },
    "sepa": {
        "id": "sepa",
        "name": "SEPA Instant Credit Transfer",
        "region": "Eurozone",
        "country_code": "EU",
        "efficiency": "Instant (< 10 seconds)",
        "integrity": "99.99% operational reliability",
        "volume_trend": "High / Stable adoption",
        "why_this_matters": "Unifies cross-border Euro transactions across dozens of member states under a singular, standardized legal rulebook.",
        "who_controls": "The European Payments Council (EPC).",
        "coordinates": [50.8503, 4.3517],
        "launch_year": "2017"
    },
    "upi": {
        "id": "upi",
        "name": "UPI (Unified Payments Interface)",
        "region": "India",
        "country_code": "IN",
        "efficiency": "Real-time instant settlement",
        "integrity": "High-throughput fault-tolerant matrix",
        "volume_trend": "World-leading transaction velocity",
        "why_this_matters": "Drives massive retail financial inclusion by abstracting complex bank layers into an open source, smartphone-native alias system.",
        "who_controls": "National Payments Corporation of India (NPCI).",
        "coordinates": [19.0760, 72.8777],
        "launch_year": "2016"
    }
}

@app.get("/api/v1/rails")
async def get_all_rails():
    return list(RAILS_DB.values())

@app.get("/api/v1/rails/{rail_id}")
async def get_rail_by_id(rail_id: str):
    return RAILS_DB.get(rail_id.lower())