# Newlook: A Multi-functional Web Application

Newlook is a versatile web application designed to provide a range of services, including language translation, stock market analysis, sentiment analysis, fraud detection, trading profit maximization, and an integrated Gemini AI chatbot. It also features a collection of security-related tools with important disclaimers.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Security Tools Disclaimer](#security-tools-disclaimer)
- [License](#license)

## Features

### Translation Service
Translate text between various languages. Now features live, real-time translation as you type.

### Stock Market Charts
View historical stock price charts for given tickers.

### Sentiment Analysis
Analyze the sentiment of text input.

### Fraud Detection
Detect potential fraudulent transactions based on amount and location.

### Trading Profit Maximization
Calculate the maximum profit achievable from a given list of stock prices.

### Gemini AI Chatbot
Interact with a Gemini-powered AI chatbot to ask questions and get responses.

### Powerball Prediction
Predict upcoming Powerball winning numbers. Users must provide a valid email address and are limited to 3 predictions per day. The prediction model is trained on historical data to avoid predicting past winning numbers. Please play responsibly (18+).

### Code Editor
A privacy-focused, web-based code editor similar to VS Code or Sublime. It allows users to open local files, edit code with syntax highlighting, and save/download their work directly to their device. No user data is stored on the server. The editor is secured with Content Security Policy (CSP) and Subresource Integrity (SRI).

### Resume Generator
Generate a professional resume from your personal information, work experience, education, and skills. The resume can be downloaded as a PDF file.

### Accident Prediction
Predict the probability of a car accident based on location, weather conditions, and time of day.

## Installation

To set up and run Newlook locally, follow these steps:

### Prerequisites

- Python 3.8+
- Node.js and npm (for frontend dependencies)
- Google API Key (for Gemini AI integration)

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd newlook/backend
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Set your Google API Key:**
    The Gemini AI feature requires a Google API Key. Set it as an environment variable in your terminal session **before** running the Flask application.

    -   **Windows Command Prompt:**
        ```bash
        set GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
        ```
    -   **PowerShell:**
        ```powershell
        $env:GOOGLE_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
        ```
    -   **Linux/macOS:**
        ```bash
        export GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
        ```
    Replace `YOUR_ACTUAL_API_KEY_HERE` with your actual API key.

4.  Run the Flask backend server:
    ```bash
    python app.py
    ```
    The server will run on `http://127.0.0.1:5000`.

### Frontend Setup

1.  Navigate to the root `newlook` directory.
2.  Open `index.html` in your web browser.

## Usage

1.  **Welcome Screen:** Upon opening `index.html`, you will be greeted by a welcome screen. Enter your name and an email address (only `@gmail.com` and `@yahoo.com` domains are accepted).
2.  **Multi-Factor Authentication (MFA):** After submitting your email, you will be prompted for MFA. You can either:
    *   Scan the QR code with your Google Authenticator app and enter the generated 6-digit code.
    *   **Bypass MFA for testing:** Enter `101010` as the 6-digit code.
3.  **Main Application:** Once authenticated, you will access the main application.
4.  **Navigation:** Use the burger menu icon (☰) in the top-left corner to open the sidebar and navigate between different services and sections.

## Security Tools Disclaimer

This project includes a section detailing various security-related tools. It is crucial to understand the implications of these tools:

**Disclaimer:** The tools described are for educational purposes and ethical use only. Any use of these tools for unauthorized access or malicious activities is strictly prohibited and may have severe legal consequences. Users are solely responsible for ensuring they have explicit permission to test any systems.

For detailed descriptions and specific security implications of each tool, please refer to the "Tool Descriptions" section within the running web application.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
