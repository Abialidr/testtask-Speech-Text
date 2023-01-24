import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import ReactAudioPlayer from 'react-audio-player';
function App() {
  const [recordState, setRecordState] = useState(null);
  const [recordAudio, setAudio] = useState('');
  const [recordText, setRecordText] = useState('');
  const [textArea, setTextArea] = useState(null);

  const start = () => {
    console.log(recordState, 'recordState');
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setRecordState(RecordState.START);
        setRecordText('Recording...');
      })
      .catch((err) => {
        alert('mic not found');
        setRecordText('');
      });
  };
  const stop = () => {
    console.log(recordState, 'recordState');

    setRecordState(RecordState.STOP);
  };
  const onStop = (audioData) => {
    if (audioData.blob.size === 44) {
      setRecordState(RecordState.STOP);
    } else if (audioData.blob.size === 8236) {
      alert('There seems to be an issue with your Mic');
      setRecordText('');
    } else {
      const formData = new FormData();

      formData.append('audio', audioData.blob);
      setRecordText('Loading');
      axios
        .post('http://127.0.0.1:8000/api/v1/speech-text/', formData)
        .then(function (response) {
          setRecordText(response.data.message);
        })
        .catch(function (error) {
          alert('Invalid Data');
          setRecordText('');
        });
    }
  };

  const clear = () => {
    setRecordText('');
  };
  const convert = () => {
    setAudio('');
    const text = textArea;
    setTextArea('Loading....');
    axios
      .post('http://127.0.0.1:8000/api/v1/text-speech/', {
        text,
      })
      .then(function (response) {
        setTextArea('Successfully Converted.');

        setAudio(response.data.path);
      })
      .catch(function (error) {
        setTextArea('some error has occured.');
      });
  };
  return (
    <div className="App">
      <div className="firstHalf">
        <h1>TEXT-TO-SPEECH</h1>

        <AudioReactRecorder
          className="Audio-Recorder"
          state={recordState}
          onStop={onStop}
          canvasWidth={0}
          canvasHeight={0}
        />

        {recordState != null ? (
          recordState === 'stop' ? (
            recordText === 'Loading' ? (
              <div class="boxContainer">
                <div class="boxAfter box1"></div>
                <div class="boxAfter box2"></div>
                <div class="boxAfter box3"></div>
                <div class="boxAfter box4"></div>
                <div class="boxAfter box5"></div>
              </div>
            ) : (
              <div className="speechToTextText">
                <h2>{recordText}</h2>
              </div>
            )
          ) : (
            <div class="boxContainer">
              <div class="box box1"></div>
              <div class="box box2"></div>
              <div class="box box3"></div>
              <div class="box box4"></div>
              <div class="box box5"></div>
            </div>
          )
        ) : null}
        <div className="buttonGroup">
          <button onClick={start} className="start">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 853.000000 1280.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                fill="rgb(85,214,54)"
                stroke="none"
              >
                <path
                  d="M4060 12789 c-194 -22 -402 -81 -577 -164 -472 -224 -789 -626 -894
-1135 l-24 -115 0 -2575 c0 -2452 1 -2579 18 -2665 145 -710 755 -1260 1492
-1345 327 -37 671 21 975 166 473 226 789 629 892 1137 l23 112 0 2575 c0
2448 -1 2579 -18 2665 -116 576 -556 1066 -1134 1264 -227 78 -508 108 -753
80z"
                />
                <path
                  d="M301 8004 c-158 -42 -262 -156 -292 -319 -7 -38 -9 -312 -6 -839 3
-648 7 -805 21 -921 64 -538 177 -928 391 -1350 184 -361 380 -630 670 -920
529 -528 1216 -906 2020 -1110 116 -29 231 -56 258 -60 l47 -7 0 -854 0 -854
-657 0 c-717 0 -743 -2 -851 -57 -69 -35 -155 -127 -176 -189 -53 -155 36
-357 203 -463 103 -66 -69 -61 2341 -61 2377 0 2235 -3 2349 54 64 33 144 122
173 194 19 49 23 75 23 182 0 120 -1 128 -32 192 -36 76 -100 146 -165 179
-95 48 -100 49 -820 49 l-678 0 0 854 c0 805 1 855 18 860 9 2 33 7 52 11 406
77 934 271 1313 484 1088 609 1778 1567 1971 2736 48 288 51 352 51 1150 l0
760 -23 58 c-63 155 -190 243 -367 254 -147 10 -260 -32 -350 -129 -32 -34
-63 -80 -76 -115 l-24 -58 -6 -785 c-6 -737 -11 -850 -39 -1050 -100 -705
-417 -1330 -913 -1794 -538 -505 -1229 -810 -2052 -908 -146 -17 -674 -17
-820 0 -663 79 -1253 297 -1735 642 -683 489 -1111 1202 -1230 2050 -28 194
-33 327 -39 1060 l-6 785 -24 58 c-44 111 -161 208 -282 236 -62 15 -175 12
-238 -5z"
                />
              </g>
            </svg>
          </button>
          <button onClick={stop} className="stop">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 853.000000 1280.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                fill="rgb(211,55,55)"
                stroke="none"
              >
                <path
                  d="M4060 12789 c-194 -22 -402 -81 -577 -164 -472 -224 -789 -626 -894
-1135 l-24 -115 0 -2575 c0 -2452 1 -2579 18 -2665 145 -710 755 -1260 1492
-1345 327 -37 671 21 975 166 473 226 789 629 892 1137 l23 112 0 2575 c0
2448 -1 2579 -18 2665 -116 576 -556 1066 -1134 1264 -227 78 -508 108 -753
80z"
                />
                <path
                  d="M301 8004 c-158 -42 -262 -156 -292 -319 -7 -38 -9 -312 -6 -839 3
-648 7 -805 21 -921 64 -538 177 -928 391 -1350 184 -361 380 -630 670 -920
529 -528 1216 -906 2020 -1110 116 -29 231 -56 258 -60 l47 -7 0 -854 0 -854
-657 0 c-717 0 -743 -2 -851 -57 -69 -35 -155 -127 -176 -189 -53 -155 36
-357 203 -463 103 -66 -69 -61 2341 -61 2377 0 2235 -3 2349 54 64 33 144 122
173 194 19 49 23 75 23 182 0 120 -1 128 -32 192 -36 76 -100 146 -165 179
-95 48 -100 49 -820 49 l-678 0 0 854 c0 805 1 855 18 860 9 2 33 7 52 11 406
77 934 271 1313 484 1088 609 1778 1567 1971 2736 48 288 51 352 51 1150 l0
760 -23 58 c-63 155 -190 243 -367 254 -147 10 -260 -32 -350 -129 -32 -34
-63 -80 -76 -115 l-24 -58 -6 -785 c-6 -737 -11 -850 -39 -1050 -100 -705
-417 -1330 -913 -1794 -538 -505 -1229 -810 -2052 -908 -146 -17 -674 -17
-820 0 -663 79 -1253 297 -1735 642 -683 489 -1111 1202 -1230 2050 -28 194
-33 327 -39 1060 l-6 785 -24 58 c-44 111 -161 208 -282 236 -62 15 -175 12
-238 -5z"
                />
              </g>
            </svg>
          </button>
          <button onClick={clear} className="start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M18.5 8c.83 0 1.5-.67 1.5-1.5S19.33 5 18.5 5H6.39l3 3h1.83l-.55 1.28 2.09 2.09L14.21 8h4.29zm-1.06 10.88L4.12 5.56c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l6.26 6.26-1.65 3.84c-.39.92.28 1.93 1.27 1.93.55 0 1.05-.33 1.27-.84l1.21-2.83 4.95 4.95c.39.39 1.02.39 1.41 0 .4-.38.4-1.01.01-1.4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="secondHalf">
        <h1>SPEECH-TO-TEXT</h1>
        <div className="text-div">
          <span>Write your text here</span>
          <textarea
            rows="3"
            className="textArea"
            onChange={(e) => {
              setTextArea(e.target.value);
            }}
            value={textArea}
          ></textarea>
        </div>
        <div className="audio">
          <div className="buttonGroup">
            <button onClick={convert} className="convert">
              Convert
            </button>
          </div>
          {/* {recordAudio != '' && ( */}
          <ReactAudioPlayer
            src={recordAudio}
            autoPlay
            controls
            className="audioControl"
          />
          {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default App;
