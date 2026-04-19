from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # ✅ FIX CORS

# 🔑 PUT YOUR YOUTUBE API KEY HERE
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


# 📌 Fetch comments
def get_comments(video_id):
    url = "https://www.googleapis.com/youtube/v3/commentThreads"

    params = {
        "part": "snippet",
        "videoId": video_id,
        "maxResults": 100,
        "key": YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return []

    data = response.json()
    comments = []

    for item in data.get("items", []):
        text = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
        comments.append(text)

    return comments


# 📌 Simple sentiment
def analyze_sentiment(comment):
    positive_words = ["good", "great", "awesome", "love", "best", "amazing"]
    negative_words = ["bad", "worst", "hate", "terrible"]

    comment = comment.lower()

    if any(word in comment for word in positive_words):
        return "POSITIVE"
    elif any(word in comment for word in negative_words):
        return "NEGATIVE"
    else:
        return "NEUTRAL"


# 🚀 API
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    if not data or "video_id" not in data:
        return jsonify({"error": "Missing video_id"}), 400

    video_id = data["video_id"]

    comments = get_comments(video_id)

    results = []
    for c in comments:
        sentiment = analyze_sentiment(c)
        results.append({
            "comment": c,
            "sentiment": sentiment
        })

    return jsonify(results)

# 🔐 Simple login credentials
USERNAME = "Deepak"
PASSWORD = "Gujjar"
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    if username == USERNAME and password == PASSWORD:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "fail"}), 401
if __name__ == "__main__":
    app.run(debug=True)

    import requests

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def ask_gpt(question, data):
    prompt = f"""
    You are an AI analyst.

    Here is sentiment data:
    {data}

    Answer this question:
    {question}
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    return response.json()["choices"][0]["message"]["content"]
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question")
    comments = data.get("comments")

    answer = ask_gpt(question, comments)

    return jsonify({"response": answer})


    