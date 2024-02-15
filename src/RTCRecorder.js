// Ensure you have installed the following React packages: recordrtc and react-audio-visualize
import React, { useState, useRef, useEffect } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import { WebsocketConnection } from "./websocketConnection";
import { AudioVisualizer } from "react-audio-visualize";

export const RTCRecorder = () => {
  const [stream, setStream] = useState(null);
  const [chunk, setChunk] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  // start recording and store every chunk of data
  const handleRecording = async () => {
    setBlob(null);
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, {
      type: "audio",
      mimeType: "audio/wav",
      recorderType: StereoAudioRecorder,
      timeSlice: 1000,
      ondataavailable: function (data) {
        setChunk(data);
      },
    });
    recorderRef.current.startRecording();
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
    });
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }
  }, [stream, refVideo]);

  return (
    <div className="container">
      <h1> Audio to WebSocket Translation </h1>
      <button
        type="button"
        class="btn btn-success m-3"
        onClick={handleRecording}
      >
        Start Recording
      </button>
      <button type="button" class="btn btn-success m-3" onClick={handleStop}>
        stop Recording
      </button>
      <header className="container">
        {blob && (
          <video
            src={URL.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: "700px", height: "100px", margin: "1em" }}
          />
        )}
        {!blob ? (
          <AudioVisualizer
            blob={chunk}
            width={500}
            height={75}
            barWidth={1}
            gap={0}
            barColor={"#a4b79d"}
          />
        ) : null}

        {chunk ? <WebsocketConnection dataBlobUrl={chunk} /> : null}
      </header>
    </div>
  );
};
