import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
from bs4 import BeautifulSoup

# Load SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# MongoDB config (replace with your own MongoDB URI and database/collection names)
client = MongoClient("mongodb://localhost:27017")
db = client["pyqs"]
collection = db["questions"]

import re

def clean_html(text):
    """Remove HTML tags from the text."""
    return BeautifulSoup(text, "html.parser").get_text()

def clean_latex(text):
    """Remove LaTeX math expressions (i.e., inline expressions surrounded by $...$)."""
    # This removes inline LaTeX math expressions like $y=\frac{1}{2}$.
    return re.sub(r'\$[^\$]*\$', '', text)

def preprocess_text(text):
    """Clean both HTML tags and LaTeX math expressions."""
    text = clean_html(text)
    text = clean_latex(text)
    return text


# Function to retrieve questions from MongoDB and generate embeddings
def generate_embeddings():
    i = 1
    questions = []
    for doc in collection.find():
        if doc.get("exam") in ["b3b5a8d8-f409-4e01-8fd4-043d3055db5e", "6d34f7cd-c80e-4a42-8c35-2b167f459c06", "c8da26c7-cf1b-421f-829b-c95dbdd3cc6a", "bb792041-50de-4cfe-83f3-f899a79c0930", "4625ad6f-33db-4c22-96e0-6c23830482de"]:
            question = doc.get("question", "")
            if question:
                print(f"Processing question {i}: {question[:50]}...")
                embedding = model.encode(preprocess_text(question))
                questions.append({
                    "_id": doc["_id"],
                    "question": question,
                    "exam": doc.get("exam", ""),
                    "subject": doc.get("subject", ""),
                    "embedding": embedding.tolist()  # Convert numpy array to list for pickle
                })
                i += 1
    return questions

# Generate embeddings and save to cache file
def save_embeddings():
    qa_list = generate_embeddings()
    with open("qa_cache.pkl", "wb") as f:
        pickle.dump(qa_list, f)
    print(f"Saved {len(qa_list)} embeddings to qa_cache.pkl.")

if __name__ == "__main__":
    save_embeddings()
