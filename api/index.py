from flask import Flask, request
from transformers import PegasusTokenizer, pipeline
from summarizer import read_article

app = Flask(__name__)

# Pick model
model_name = "google/pegasus-xsum"

# Load pretrained tokenizer
pegasus_tokenizer = PegasusTokenizer.from_pretrained(model_name)

# Define summarization pipeline 
summarizer = pipeline(
    "summarization", 
    model=model_name, 
    tokenizer=pegasus_tokenizer, 
    framework="pt"
)

@app.route('/')
def index():
    return 'Hello World'

@app.route('/summarize')
def summarize():
    url = request.args.get('url')
    text = read_article(url)
    summary = summarizer(text, min_length=0, max_length=100)
    return summary[0]["summary_text"]


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)