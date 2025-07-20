import openai
import os

# Configure the API key from an environment variable
# IMPORTANT: In a production environment, use a more secure method for API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    # Using a placeholder for the API key
    OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"
openai.api_key = OPENAI_API_KEY

# Initialize the OpenAI model
# Using a dictionary to store chat sessions per user (e.g., by email or session ID)
# In a real application, this would be persisted in a database.
chat_sessions = {}

def get_openai_response(user_id, message):
    if user_id not in chat_sessions:
        # Start a new chat session for the user if one doesn't exist
        chat_sessions[user_id] = []

    chat_sessions[user_id].append({"role": "user", "content": message})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_sessions[user_id]
        )
        ai_response = response.choices[0].message['content']
        chat_sessions[user_id].append({"role": "assistant", "content": ai_response})
        return ai_response
    except Exception as e:
        print(f"Error getting response from OpenAI: {e}")
        return "An error occurred while communicating with the AI. Please try again later."
