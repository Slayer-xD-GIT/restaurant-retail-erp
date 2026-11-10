from decimal import Decimal
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Ranna ERP API", version="0.1.0")

class JournalLine(BaseModel):
    account: str
    debit: Decimal = Field(default=Decimal("0"), ge=0)
    credit: Decimal = Field(default=Decimal("0"), ge=0)
    outlet_id: str

class JournalDraft(BaseModel):
    source_type: str
    source_id: str
    idempotency_key: str
    lines: list[JournalLine]

@app.get("/health")
async def health():
    return {"status": "ok", "service": "erp-api"}

@app.post("/api/v1/journals/validate")
async def validate_journal(journal: JournalDraft):
    debit = sum((line.debit for line in journal.lines), Decimal("0"))
    credit = sum((line.credit for line in journal.lines), Decimal("0"))
    if debit != credit or debit == 0:
        raise HTTPException(422, "Journal must be non-zero and balanced")
    if any(line.debit and line.credit for line in journal.lines):
        raise HTTPException(422, "A line cannot contain both debit and credit")
    return {"balanced": True, "debit": str(debit), "credit": str(credit)}
