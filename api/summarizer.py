from newspaper import Article

def read_article(url):
    article = Article(url)
    article.download()
    article.parse()
    return article.text