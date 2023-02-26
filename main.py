from flask import Flask, request, render_template, jsonify
from transformers import PegasusTokenizer, pipeline
from newspaper import Article
# Making a function to deal with urls
def read_article(url):
    article = Article(url)
    article.download()
    article.parse()
    return {
        "text": article.text,
        "title": article.title,
        "authors": article.authors,
        "publish_date": article.publish_date
    }
# Creating flask app
app = Flask(__name__)

# Picking the pegasus model
model_name = "google/pegasus-xsum"

# Loading pretrained tokenizer
pegasus_tokenizer = PegasusTokenizer.from_pretrained(model_name)

# Defining summarization pipeline 
summarizer = pipeline(
    "summarization", 
    model=model_name, 
    tokenizer=pegasus_tokenizer, 
    framework="pt"
)
# Rendering template
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/summarize')
# Summarize function for URLs
def summarize():
    #Using Newspaper library to get text, title, publish date, and author(s)
    url = request.args.get('url')
    article = read_article(url)
    text, title, date, authors = article["text"], article["title"], article["publish_date"], article["authors"]
    if len(text) > 512:
        summary = summarizer(text, min_length=0, max_length=276)
    else:
        summary = summarizer(text, min_length=0, max_length=float('inf'))
    print("Done")

    # Create a dictionary to hold the summary text
    response_data = {
        'summary': summary[0]['summary_text'],
        'original': text,
        'url': url,
        'title': title,
         'date': date }

    # Set the Content-Type header to application/json
    headers = {'Content-Type': 'application/json'}

    # Return the summary text as a JSON response
    return jsonify(response_data), 200, headers

@app.route('/summarizetext')
# Summarize function for URLs that are not articles
def summarizetext():
    text = request.args.get('url')

    summary = summarizer(text, min_length=0, max_length=276)
    print("Done")

    # Create a dictionary to hold the summary text
    response_data = {
        'summary': summary[0]['summary_text'], 'original': text }

    # Set the Content-Type header to application/json
    headers = {'Content-Type': 'application/json'}

    # Return the summary text as a JSON response
    return jsonify(response_data), 200, headers

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)