import os
import pickle
import numpy as np
from functools import lru_cache
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model_gemini = genai.GenerativeModel("gemini-2.0-flash")

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
collection = client["pyqs"]["questions"]

CACHE_FILE = os.path.join(os.path.dirname(__file__), "..", "qa_cache.pkl")

class RAGRequest(BaseModel):
    query: str
    exam_id: str
    subject_id: str
    top_k: int = 3

class RAGResponse(BaseModel):
    answer: str
    context_used: List[Dict[str, Any]]

@lru_cache(maxsize=1)
def load_cache_once():
    with open(CACHE_FILE, "rb") as f:
        return pickle.load(f)

qa_list = load_cache_once()

def search_documents(query, exam_id, subject_id, top_k=3):
    filtered = [qa for qa in qa_list if qa["exam"] == exam_id and qa["subject"] == subject_id]
    if not filtered:
        return []
    query_vec = model.encode(query).reshape(1, -1)
    data_vecs = np.array([qa["embedding"] for qa in filtered])
    scores = cosine_similarity(query_vec, data_vecs)[0]
    top_items = sorted(zip(scores, filtered), key=lambda x: x[0], reverse=True)[:top_k]
    return [collection.find_one({"_id": doc["_id"]}) for _, doc in top_items]

def generate_answer_with_gemini(context_docs, user_query):
    context_text = "\n\n".join(
        f"Q: {doc['question']}\nExplanation: {doc.get('explanation', 'N/A')}"
        for doc in context_docs
    )

    prompt = f"""You are a helpful AI assistant for Engineering/Medical Entrance exam preparation.
Use the following context to answer the question clearly and accurately.

Context:
{context_text}

User Question:
{user_query}

Answer:"""

    response = model_gemini.generate_content(prompt).text.strip()
    return response

@app.post("/ask", response_model=RAGResponse)
def ask_api(req: RAGRequest):
    docs = search_documents(req.query, req.exam_id, req.subject_id, req.top_k)
    if not docs:
        return RAGResponse(answer="No relevant documents found.", context_used=[])

    serializable_docs = []
    for doc in docs:
        if doc and '_id' in doc:
            doc['_id'] = str(doc['_id'])
        doc.setdefault('question', 'N/A')
        doc.setdefault('options', [])
        doc.setdefault('correct_option', [])
        doc.setdefault('correct_value', None)
        doc.setdefault('explanation', 'N/A')
        doc.setdefault('type', 'unknown')
        serializable_docs.append(doc)

    answer = generate_answer_with_gemini(serializable_docs, req.query)
    return RAGResponse(answer=answer, context_used=serializable_docs)
