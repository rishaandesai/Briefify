from newspaper import Article

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