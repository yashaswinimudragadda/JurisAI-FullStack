import { useState} from 'react';

export const useSpeech = (onTranscript) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en-IN');
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;

  const toggleSpeechInput = () => {
    if (!recognition) return alert("Speech recognition not supported in this browser.");
    
    const rec = new recognition();
    rec.lang = speechLanguage;

    if (isRecording) {
      rec.stop();
      setIsRecording(false);
    } else {
      rec.start();
      setIsRecording(true);
      rec.onresult = (event) => {
        onTranscript(event.results[0][0].transcript);
        setIsRecording(false);
      };
    }
  };

  const speakResponseAloud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguage;
    synth.speak(utterance);
  };

  return { isRecording, toggleSpeechInput, speechLanguage, setSpeechLanguage, speakResponseAloud };
};