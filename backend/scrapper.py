import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    
    # Get user input
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch Wikipedia page. Status: {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")

    # Extract title
    title = soup.find("h1").get_text(strip=True)

    # Extract content div
    content_div = soup.find("div", {"id": "mw-content-text"})
    if not content_div:
        raise Exception("Could not find main content area")

    # Clean references and tables
    for sup in content_div.find_all("sup"):
        sup.decompose()
    for table in content_div.find_all("table"):
        table.decompose()

    # Get all paragraphs
    text = " ".join(p.get_text(strip=True) for p in content_div.find_all("p"))
    return title, text