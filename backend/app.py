from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import logging
import json
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

logging.basicConfig(level=logging.DEBUG)

@app.route('/api/internships', methods=['GET'])
def get_internships():
    app.logger.debug(f"Received request: {request.method} {request.path}")
    
    api_url = 'https://github.com/SimplifyJobs/Summer2025-Internships/blob/dev/README.md'
    
    try:
        app.logger.debug(f"Attempting to fetch data from: {api_url}")
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(api_url, headers=headers)
        app.logger.debug(f"Response status code: {response.status_code}")
        response.raise_for_status()
        
        # Extract the JSON data from the page
        json_match = re.search(r'<script type="application/json" data-target="react-app\.embeddedData">(.+?)</script>', response.text)
        if json_match:
            json_data = json.loads(json_match.group(1))
            rich_text = json_data['payload']['blob']['richText']
            
            # Parse the rich text with BeautifulSoup
            soup = BeautifulSoup(rich_text, "html.parser")
            
            internships = []
            
            # Find the table in the README
            table = soup.find('table')
            if table:
                rows = table.find_all('tr')[1:]  # Skip the header row
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) >= 5:
                        company = cols[0].text.strip()
                        role = cols[1].text.strip()
                        location = cols[2].text.strip()
                        apply_link = cols[3].find('a')['href'] if cols[3].find('a') else ''
                        date_posted = cols[4].text.strip()
                        
                        internships.append({
                            "company": company,
                            "role": role,
                            "location": location,
                            "apply_link": apply_link,
                            "date_posted": date_posted
                        })
            
            app.logger.debug(f"Extracted {len(internships)} internships")
            return jsonify(internships)
        else:
            app.logger.error("Could not find JSON data in the response")
            return jsonify({"error": "Could not extract data from the page"}), 500
    
    except requests.RequestException as e:
        app.logger.error(f"Error fetching data from GitHub: {str(e)}")
        return jsonify({"error": f"Failed to fetch data from GitHub: {str(e)}"}), 500
    
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Internship Scraper API. Use /api/internships to get the list of internships."

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)