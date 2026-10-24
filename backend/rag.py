
from pathlib import Path
import re

import chromadb

BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / "chroma_db"


def get_collection():
    if not DB_DIR.exists() or not any(DB_DIR.iterdir()):
        raise RuntimeError(
            f"ChromaDB database not found at: {DB_DIR}"
        )

    client = chromadb.PersistentClient(path=str(DB_DIR))
    collections = client.list_collections()

    if not collections:
        raise RuntimeError("No collections found in ChromaDB.")

    # Use the existing collection created by your project.
    collection = client.get_collection(collections[0].name)

    if collection.count() == 0:
        raise RuntimeError("The ChromaDB collection is empty.")

    return collection


def remove_duplicate_documents(documents):
    unique_documents = []
    seen = set()

    for doc in documents:
        content = " ".join(doc["content"].split()).strip()
        metadata = doc.get("metadata") or {}
        key = (
            metadata.get("source", ""),
            metadata.get("page", ""),
            content,
        )

        if content and key not in seen:
            seen.add(key)
            unique_documents.append(doc)

    return unique_documents


def answer_question(question: str):
    if not question or not question.strip():
        return "Please enter a question.", []

    collection = get_collection()

    # Retrieve saved document text without loading a large AI model.
    data = collection.get(include=["documents", "metadatas"])

    words = set(re.findall(r"[a-zA-Z0-9]+", question.lower()))
    stop_words = {
        "what", "how", "why", "when", "where", "which",
        "the", "is", "are", "a", "an", "and", "or",
        "to", "for", "of", "in", "on", "i", "me", "my",
        "can", "you", "please", "explain", "tell"
    }
    words -= stop_words

    matches = []

    for index, content in enumerate(data.get("documents") or []):
        if not content or len(content.strip()) < 40:
            continue

        metadata_list = data.get("metadatas") or []
        metadata = (
            metadata_list[index]
            if index < len(metadata_list) and metadata_list[index]
            else {}
        )

        document_words = set(
            re.findall(r"[a-zA-Z0-9]+", content.lower())
        )
        score = len(words & document_words)

        if score > 0:
            matches.append({
                "content": content,
                "metadata": metadata,
                "score": score,
            })

    matches.sort(key=lambda item: item["score"], reverse=True)
    matches = remove_duplicate_documents(matches[:10])
    matches = matches[:3]

    if not matches:
        return (
            "I couldn't find relevant information in the available "
            "financial documents. Please try another question."
        ), []

    context = "\n\n".join(
        item["content"].strip() for item in matches
    )

    answer = (
        "Based on your reference documents:\n\n"
        f"{context}\n\n"
        "Note: This information is for educational purposes only, "
        "not personalized financial advice."
    )

    documents = []

    for item in matches:
        metadata = item["metadata"]
        documents.append({
            "page_content": item["content"],
            "metadata": metadata,
        })

    return answer, documents


def retrieve_context(question: str, k: int = 3):
    answer, documents = answer_question(question)
    return documents[:k]


if __name__ == "__main__":
    answer, sources = answer_question("What is a mutual fund?")
    print(answer)
    print("Sources found:", len(sources))
