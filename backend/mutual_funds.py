
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = (
    BASE_DIR
    / "data"
    / "structure"
    / "comprehensive_mutual_funds_data.csv"
)


def load_mutual_funds():
    """Load the existing mutual fund CSV dataset safely."""
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATASET_PATH}"
        )

    df = pd.read_csv(DATASET_PATH)

    # Convert columns to object type before replacing missing values.
    # This ensures NaN values become None for valid JSON responses.
    df = df.astype(object).where(pd.notna(df), None)

    return df


def get_mutual_funds(
    category=None,
    risk_level=None,
    search=None,
):
    """Filter mutual funds using the existing CSV dataset."""
    df = load_mutual_funds()

    if category:
        df = df[
            df["category"].astype(str).str.contains(
                category,
                case=False,
                na=False,
                regex=False,
            )
        ]

    if risk_level is not None:
        df = df[
            df["risk_level"].astype(str).str.fullmatch(
                str(risk_level),
                case=False,
                na=False,
            )
        ]

    if search:
        df = df[
            df["scheme_name"].astype(str).str.contains(
                search,
                case=False,
                na=False,
                regex=False,
            )
        ]

    # Return at most 100 matching records.
    return df.head(100).to_dict(orient="records")
