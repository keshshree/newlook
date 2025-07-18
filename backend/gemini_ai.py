import google.generativeai as genai
import os

# Configure the API key from an environment variable
# IMPORTANT: In a production environment, use a more secure method for API keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model
# Using a dictionary to store chat sessions per user (e.g., by email or session ID)
# In a real application, this would be persisted in a database.
chat_sessions = {}

def get_gemini_response(user_id, message):
    if user_id not in chat_sessions:
        # Start a new chat session for the user if one doesn't exist
        model = genai.GenerativeModel('gemini-1.5-flash')
        chat_sessions[user_id] = model.start_chat(history=[])

    chat = chat_sessions[user_id]
    response = chat.send_message(message)
    return response.text
