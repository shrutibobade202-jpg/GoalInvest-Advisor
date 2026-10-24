
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field

from mutual_funds import get_mutual_funds

app = FastAPI(
    title="GoalInvest Advisor",
    version="1.0.0",
    description="Educational personal finance assistant",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://shrutibobade202-jpg.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GoalRequest(BaseModel):
    goal: str
    target_amount: float = Field(gt=0)
    months: int = Field(gt=0)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)


@app.get("/")
def home():
    return {
        "message": "GoalInvest Advisor backend is running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/calculate-goal")
def calculate_goal(data: GoalRequest):
    monthly_saving = data.target_amount / data.months

    return {
        "goal": data.goal,
        "target_amount": data.target_amount,
        "months": data.months,
        "monthly_saving_required": round(monthly_saving, 2),
        "message": (
            f"You need to save approximately "
            f"₹{monthly_saving:,.2f} per month."
        ),
        "note": (
            "This estimate excludes investment returns "
            "and inflation."
        ),
    }


@app.post("/goal-advice")
def goal_advice(data: GoalRequest):
    monthly_saving = data.target_amount / data.months

    return {
        "goal": data.goal,
        "advice": (
            f"For your goal of {data.goal}, plan to save "
            f"approximately ₹{monthly_saving:,.2f} per month. "
            "Consider your time horizon and risk tolerance "
            "before making investment decisions."
        ),
        "note": (
            "Educational information only, "
            "not personalized financial advice."
        ),
    }


@app.post("/chat")
def chat(data: ChatRequest):
    print("CHAT: Request received", flush=True)

    try:
        print("CHAT: Loading RAG module", flush=True)
        from rag import answer_question

        print("CHAT: Calling answer_question", flush=True)
        answer, documents = answer_question(data.message)

        print("CHAT: Answer generated", flush=True)

        sources = []
        for doc in documents:
            metadata = doc.metadata or {}
            sources.append({
                "source": metadata.get(
                    "source_file",
                    metadata.get("source", "Reference document"),
                ),
                "page": metadata.get("page", "unknown"),
            })

        return jsonable_encoder({
            "answer": answer,
            "sources": sources,
        })

    except Exception as exc:
        import traceback

        traceback.print_exc()
        print(
            f"CHAT ERROR: {type(exc).__name__}: {exc}",
            flush=True,
        )

        raise HTTPException(
            status_code=503,
            detail=(
                f"AI service error: {type(exc).__name__}: {exc}"
            ),
        ) from exc


@app.get("/mutual-funds")
def mutual_funds(
    category: str | None = None,
    risk_level: int | None = Query(default=None, ge=1, le=5),
    search: str | None = None,
):
    try:
        funds = get_mutual_funds(
            category=category,
            risk_level=risk_level,
            search=search,
        )

        return jsonable_encoder({
            "total_returned": len(funds),
            "funds": funds,
            "note": (
                "Historical data is for educational comparison "
                "only and does not guarantee future returns."
            ),
        })

    except FileNotFoundError as exc:
        print(
            f"MUTUAL FUNDS ERROR: {type(exc).__name__}: {exc}",
            flush=True,
        )
        raise HTTPException(
            status_code=500,
            detail=(
                "Mutual fund CSV dataset was not found. "
                "Check the dataset path."
            ),
        ) from exc

    except Exception as exc:
        print(
            f"MUTUAL FUNDS ERROR: {type(exc).__name__}: {exc}",
            flush=True,
        )
        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to load mutual fund data: "
                f"{type(exc).__name__}: {exc}"
            ),
        ) from exc
