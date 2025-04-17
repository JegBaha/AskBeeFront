from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import requests
import os
import logging
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native frontend

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Hugging Face Chatbot API configuration
CHATBOT_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"
HEADERS = {"Authorization": "Bearer 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"}

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint to verify server is running."""
    logging.debug("Test endpoint called")
    return jsonify({"status": "Server is running"})

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Transcribe uploaded audio and get chatbot response."""
    logging.debug("Received transcribe request")
    logging.debug(f"Content-Type: {request.content_type}")
    logging.debug(f"Request files: {request.files}")
    logging.debug(f"Request form: {request.form}")
    logging.debug(f"Request headers: {request.headers}")

    if 'audio' not in request.files:
        logging.error("No audio file provided in request.files")
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        logging.error("Empty filename for audio file")
        return jsonify({"error": "No audio file selected"}), 400

    # Save the uploaded file temporarily
    temp_m4a_path = "temp_recording.m4a"
    temp_wav_path = "temp_recording.wav"
    audio_file.save(temp_m4a_path)
    logging.debug(f"Audio file saved to {temp_m4a_path}")

    # Convert m4a to wav
    try:
        audio = AudioSegment.from_file(temp_m4a_path, format="m4a")
        audio.export(temp_wav_path, format="wav")
        logging.debug(f"Converted {temp_m4a_path} to {temp_wav_path}")
    except Exception as e:
        logging.error(f"Audio conversion error: {str(e)}")
        if os.path.exists(temp_m4a_path):
            os.remove(temp_m4a_path)
        return jsonify({"error": f"Audio conversion failed: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_m4a_path):
            os.remove(temp_m4a_path)
            logging.debug("Temporary m4a file deleted")

    # Transcribe the audio
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(temp_wav_path) as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        print(f"Transcribed text: {text}")  # Log transcribed text
        logging.info(f"Transcribed text: {text}")
    except sr.UnknownValueError:
        logging.error("Speech recognition could not understand audio")
        os.remove(temp_wav_path)
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        logging.error(f"Speech recognition error: {str(e)}")
        os.remove(temp_wav_path)
        return jsonify({"error": f"Speech recognition error: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"Transcription error: {str(e)}")
        os.remove(temp_wav_path)
        return jsonify({"error": f"Transcription error: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)
            logging.debug("Temporary wav file deleted")

    # Send transcribed text to chatbot
    payload = {
        "inputs": text,
        "parameters": {"max_length": 100}
    }
    try:
        response = requests.post(CHATBOT_URL, headers=HEADERS, json=payload)
        if response.status_code == 200:
            chatbot_response = response.json()[0]['generated_text']
            logging.debug(f"Chatbot response: {chatbot_response}")
        else:
            chatbot_response = "Sorry, there was an error with the chatbot service."
            logging.error(f"Chatbot API error: {response.status_code}")
    except Exception as e:
        chatbot_response = f"Chatbot error: {str(e)}"
        logging.error(f"Chatbot request error: {str(e)}")

    return jsonify({"text": text, "response": chatbot_response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)