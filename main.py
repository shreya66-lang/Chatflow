from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "./model"

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
    model.eval()
    model_loaded = True
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model failed to load:", str(e))
    tokenizer, model, model_loaded = None, None, False


@app.post("/generate_response")
async def generate_response(request: Request):
    if not model_loaded:
        return {"response": "❌ Model not loaded. Please check your ./model folder."}

    data = await request.json()
    user_message = data.get("message", "")

    # Wrap like ChatGPT-style prompt
    prompt = f"You are a helpful AI assistant. User: {user_message}\nAI:"

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=200,
        do_sample=True,
        temperature=0.7,
        top_p=0.9
    )
    reply = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {"response": reply}