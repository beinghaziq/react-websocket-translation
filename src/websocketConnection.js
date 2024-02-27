// Ensure you have installed the following React packages: react-use-websocket and file-saver
import useWebSocket from "react-use-websocket";
import React, { useCallback, useEffect, useState } from "react";
import { saveAs } from "file-saver";

export const WebsocketConnection = ({ dataBlobUrl }) => {
  const SERVER_URL =
    "wss://external-api-staging.meetkudo.com/api/v1/translate?id=d5c3c200-ce99-4f4c-8f39-abdbf523d8ad";
  const API_TOKEN =
    "eyJraWQiOiIwSGkrOHhFbTV3NlwvN21NdmdkXC9YQThHYzdmSitwMUpYQTM3SjdCOVhiRkU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3dTAwNmh1bWZxMXY4c2VuNmdiMGZmNXZtaiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoic2hhcmVkLXNlcnZpY2VzXC9zZXJ2aWNlIiwiYXV0aF90aW1lIjoxNzA5MDI0MTE3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9lUFNxNjlpQ3kiLCJleHAiOjE3MDkxMTA1MTcsImlhdCI6MTcwOTAyNDExNywidmVyc2lvbiI6MiwianRpIjoiNTk2ODQzNjUtNjM1YS00MjVkLWFiMTYtOGE2NjdkZmY1OWFhIiwiY2xpZW50X2lkIjoiN3UwMDZodW1mcTF2OHNlbjZnYjBmZjV2bWoifQ.AYZ_tJ2-EQgMW26y2ctyrTqBhFaER8q4-1SkoH-0s1fqrqSiPRWD1xCfBj-sqens9flfPOjRooNAj6L-sV2hW01QVkY-KCFrp4FiT-V8GaIVgc0HP6DqrTQGuAVl7ILJf24sxMTDhdq1JuebDOewW7sR-FPg3Ne5QvS3QiqH17FtwM7V8ex5f-nAO2RoqUcJihkcoimztwSJ-cgwYahDk6ZpNoZx1Jge4UMavqmRRFVMLHt7Ky26wNGN1Kv9GZIz_0lny8-AIJcVH1AE8Qsx4E-5Pk6YQ9S9rzaMt2xEHOPq3ERXY_rev_wJRXHEVGVJUb5GDsfLAHG78UITc_poeg";
  const [binaryData, setBinaryData] = useState("audio/wav;base64,");
  const [translatedBlob, setTranslatedBlob] = useState(null);

  // converting the data to valid binary format
  function convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ";base64,";
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  const { sendMessage } = useWebSocket(SERVER_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    onMessage: (message) => {
      let data = JSON.parse(message.data);
      console.log("Translating your audio...");
      console.log("Websocket response", data);

      setBinaryData((prev) => prev + data.audioData);
    },
    onClose: (e) => {
      var binary = convertDataURIToBinary(binaryData);
      var blob = new Blob([binary], { type: "audio/wav" });

      setTranslatedBlob(blob);
      saveAs(blob, "audio-output.ogg");

      console.log("closed", e);
    },
    onError: (e) => console.error("Error in websocket", e),
    share: true,
    shouldReconnect: () => false,
    protocols: ["Authorization", API_TOKEN],
  });

  // converting audio blob to float32array and send to websocket
  const convertBlobToArray = useCallback(async () => {
    const arrayBuffer = await dataBlobUrl.arrayBuffer();

    const dataView = new DataView(arrayBuffer);
    const pcmData = new Float32Array(arrayBuffer.byteLength / 4);

    for (let i = 0; i < pcmData.length; i++) {
      pcmData[i] = dataView.getInt16(i * 4, true);
    }

    sendMessage(JSON.stringify(pcmData));
  }, [dataBlobUrl, sendMessage]);

  // render convertBlobToArray function for every chunk of data
  useEffect(() => {
    convertBlobToArray();
  }, [dataBlobUrl, convertBlobToArray]);

  return (
    <div>
      {!translatedBlob ? <h3>Translating your audio file. Please wait...</h3> : null}
      {translatedBlob ? (
        <>
          <h3>Download Translated Audio File</h3>
          <video
            src={URL.createObjectURL(translatedBlob)}
            controls
            autoPlay
            style={{ width: "700px", height: "65px", margin: "1em" }}
          />
        </>
      ) : null}
    </div>
  );
};
