from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import speech_recognition as sr
from gtts import gTTS

class SpeechTextView(APIView):
    def post(self, request):
        audio = request.data.get('audio', None)
        if audio:
            r = sr.Recognizer()
            harvard = sr.AudioFile(audio)
            with harvard as source:
                audio = r.record(source)
            text = r.recognize_google(audio)
            return Response({"message":text}, status=status.HTTP_200_OK)
        else:
            return Response({"message":"Please enter valid audio file"}, status=status.HTTP_400_BAD_REQUEST)


class TextSpeechView(APIView):
    def post(self, request):
        domain = request.META['HTTP_HOST']
        language = 'en'
        text = request.data.get('text', None)
        speech = gTTS(text=text, lang=language, slow=False)
        speech.save("media/text.mp3")
        if text:
            return Response({"path":f"http://{domain}/media/text.mp3"}, status=status.HTTP_200_OK)
        else:
            return Response({"message":"Please enter valid audio file"}, status=status.HTTP_400_BAD_REQUEST)
