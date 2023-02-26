from flask import Flask, request, render_template
from transformers import PegasusTokenizer, pipeline
from summarizer import read_article
import json

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
    return render_template('index.html')

@app.route('/summarize')
def summarize():
    url = request.args.get('url')
    text = read_article(url)
    summary = summarizer(text, min_length=len(text)//2 if len(text) < 200 else 100, max_length=float("inf"))
    print("Done")

    # Create a dictionary to hold the summary text
    response_data = {'summary': summary[0]['summary_text']}

    # Set the Content-Type header to application/json
    headers = {'Content-Type': 'application/json'}

    # Return the summary text as a JSON response
    return jsonify(response_data), 200, headers

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)