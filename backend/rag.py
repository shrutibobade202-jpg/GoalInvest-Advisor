
from pathlib import Path

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / "chroma_db"

# Load the embedding model only when it is needed.
_embeddings = None


def get_embeddings():
    global _embeddings

    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

    return _embeddings


def get_vector_store():
    """Load the existing ChromaDB database."""
    if not DB_DIR.exists() or not any(DB_DIR.iterdir()):
        raise RuntimeError(
            f"ChromaDB database not found or empty at: {DB_DIR}"
        )

    return Chroma(
        persist_directory=str(DB_DIR),
        embedding_function=get_embeddings(),
    )


def remove_duplicate_documents(documents):
    """Remove duplicate or empty documents."""
    unique_documents = []
    seen = set()

    for doc in documents:
        text = " ".join(doc.page_content.split()).strip()
        metadata = doc.metadata or {}

        key = (
            metadata.get("source", ""),
            metadata.get("page", ""),
            text,
        )

        if not text or key in seen:
            continue

        seen.add(key)
        unique_documents.append(doc)

    return unique_documents


def answer_question(question: str):
    """Retrieve relevant financial information."""
    if not question or not question.strip():
        return "Please enter a question.", []

    vector_store = get_vector_store()

    documents = vector_store.similarity_search(
        question.strip(),
        k=5,
    )

    documents = remove_duplicate_documents(documents)

    documents = [
        doc for doc in documents
        if len(doc.page_content.strip()) >= 60
    ][:3]

    if not documents:
        return (
            "I couldn't find relevant information in the "
            "available financial documents. Please try another question."
        ), []

    context = "\n\n".join(
        doc.page_content.strip() for doc in documents
    )

    answer = (
        "Based on your reference documents:\n\n"
        f"{context}\n\n"
        "Note: This information is for educational purposes only, "
        "not personalized financial advice."
    )

    return answer, documents


def retrieve_context(question: str, k: int = 3):
    """Retrieve relevant documents without generating an answer."""
    if not question or not question.strip():
        return []

    vector_store = get_vector_store()

    documents = vector_store.similarity_search(
        question.strip(),
        k=k,
    )

    return remove_duplicate_documents(documents)


if __name__ == "__main__":
    store = get_vector_store()

    results = store.similarity_search(
        "What is a mutual fund?",
        k=5,
    )

    results = remove_duplicate_documents(results)

    for i, doc in enumerate(results, start=1):
        print(f"\n--- RESULT {i} ---")
        print("SOURCE:", doc.metadata.get("source"))
        print("PAGE:", doc.metadata.get("page"))
        print(doc.page_content[:1000])
