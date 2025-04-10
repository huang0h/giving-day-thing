import { Input, Modal, Spin } from "antd";
import { useRef, useState } from "react";
import { sendImagePrompt, sendTextPrompt } from "./prompting";
import Webcam from "react-webcam";
import { fakeCelebs, fakeCoops, Prompt } from "./types";
import Markdown from "react-markdown";
import "./inputModal.css";

const taskDescriptions = new Map([
  [
    "RFIT",
    "Strike a pose and see how good your fashion skills really are 👚✨",
  ],
  [
    "RMUS",
    "Write down your favorite artists to check if you actually have good taste 🎶😏",
  ],
  ["COOP", "Give us your most professional stance, and we'll tell you what you'll be doing for your next co-op 💰"],
  [
    "FORT",
    "Put down your major, year, and zodiac sign, then pose for the camera to find out what's in store for you 👀",
  ],
  [
    "CELB",
    "Give us your favorite ice cream flavor and stare deep into the camera. We'll guess which campus celebrity you're most like 🤵",
  ],
]);

interface InputModalProps {
  selectedPrompt: Prompt;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

enum SubmitState {
  EMPTY,
  AWAITING,
  SUCCESS,
  ERROR,
}

function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function generateCoop() {
  return pickRandom(fakeCoops);
}

function generateCeleb() {
  return pickRandom(fakeCelebs);
}

const FAKES = ["COOP", "CELB"];

const generators = new Map([
  ["COOP", generateCoop],
  ["CELB", generateCeleb],
]);

export default function InputModal({
  selectedPrompt,
  showModal,
  setShowModal,
}: InputModalProps) {
  const [inputText, setInputText] = useState<string>("");
  const [inputImageB64, setInputImageB64] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>(
    SubmitState.EMPTY
  );

  const dummyWebcamRef = useRef<Webcam | null>(null);

  const [promptResult, setPromptResult] = useState<string | null>(null);

  function closeModal() {
    setShowModal(false);
    setSubmitState(SubmitState.EMPTY);
    setInputImageB64(null);
    setPromptResult(null);
  }

  async function textPrompt() {
    setSubmitState(SubmitState.AWAITING);

    const promptResult = await sendTextPrompt(selectedPrompt.code, inputText);

    if (promptResult.success) {
      setSubmitState(SubmitState.SUCCESS);
      setPromptResult(promptResult.response);
    } else {
      setSubmitState(SubmitState.ERROR);
      setPromptResult(promptResult.error);
    }
  }

  async function imagePrompt(imageB64: string) {
    setSubmitState(SubmitState.AWAITING);
    setInputImageB64(imageB64);
    console.log("image prompting...");

    const promptResult = await sendImagePrompt(
      selectedPrompt.code,
      imageB64.split("base64,")[1]
    );

    if (promptResult.success) {
      setSubmitState(SubmitState.SUCCESS);
      setPromptResult(promptResult.response);
      console.log("image prompting done!");
    } else {
      setSubmitState(SubmitState.ERROR);
      setPromptResult(promptResult.error);
    }
  }

  async function comboPrompt(textGenerator: () => void) {
    if (!dummyWebcamRef.current) return;
    setInputImageB64(dummyWebcamRef.current?.getScreenshot());
    textGenerator();
  }

  async function textFakeout(fakeResponseGenerator: () => string) {
    setSubmitState(SubmitState.AWAITING);
    console.log('faking...')

    await setTimeout(
      () => {
        setPromptResult(fakeResponseGenerator());
        setSubmitState(SubmitState.SUCCESS);
      },
      1000 + Math.random() * 300
    );

    console.log('done...')

  }

  const isFake = FAKES.includes(selectedPrompt.code);

  return (
    <Modal
      open={showModal}
      title={selectedPrompt.task}
      width={1200}
      onOk={closeModal}
      onCancel={closeModal}
      onClose={closeModal}
      footer={null}
    >
      <hr />
      <div className="inputmodal-body">
        <div className="input-section">
          <p>{taskDescriptions.get(selectedPrompt.code)}</p>
          {(() => {
            if (!selectedPrompt) return "ERROR";

            switch (selectedPrompt.inputMethod) {
              case "image":
                return (
                  <div className="image-input">
                    {inputImageB64 === null ? (
                      <Webcam
                        audio={false}
                        screenshotFormat="image/png"
                        width={600}
                        height={450}
                        disablePictureInPicture
                      >
                        {({ getScreenshot }) => (
                          <div>
                            <button
                              onClick={
                                isFake
                                  ? () =>
                                      textFakeout(
                                        generators.get(
                                          selectedPrompt.code
                                        ) as () => string
                                      )
                                  : () => imagePrompt(getScreenshot())
                              }
                            >
                              SEND IT
                            </button>
                          </div>
                        )}
                      </Webcam>
                    ) : (
                      <img src={inputImageB64} />
                    )}
                  </div>
                );
              case "text":
                return (
                  <div className="text-input">
                    <Input.TextArea
                      maxLength={300}
                      showCount
                      value={inputText}
                      onChange={(event) => setInputText(event.target.value)}
                      // style={{minHeight: '250px', resize: 'none'}}
                      size="large"
                      styles={{ textarea: { minHeight: "220px" } }}
                    />
                    <button
                      disabled={promptResult !== null}
                      onClick={textPrompt}
                    >
                      SEND IT
                    </button>
                  </div>
                );
              case "combo":
                return (
                  <>
                    {inputImageB64 === null ? (
                      <Webcam
                        audio={false}
                        screenshotFormat="image/png"
                        width={600}
                        height={300}
                        disablePictureInPicture
                        ref={dummyWebcamRef}
                      />
                    ) : (
                      <img src={inputImageB64} />
                    )}
                    <div className="text-input">
                      <Input.TextArea
                        maxLength={300}
                        showCount
                        value={inputText}
                        onChange={(event) => setInputText(event.target.value)}
                        size="large"
                        styles={{ textarea: { minHeight: "220px" } }}
                      />
                      <button
                        disabled={promptResult !== null}
                        onClick={() => comboPrompt( isFake ? () => textFakeout(generators.get(selectedPrompt.code) as () => string) : textPrompt)}
                      >
                        SEND IT
                      </button>
                    </div>
                  </>
                );
            }
          })()}
        </div>
        <div className="input-random-stuff">
          {submitState === SubmitState.AWAITING && (
            <div className="loading-wrapper">
              <Spin size="large" style={{marginRight: 150}} />
            </div>
          )}
          {promptResult && <div className="inputmodal-result">
            <h3>THE VERDICT</h3>
            <hr />
            <Markdown>{promptResult}</Markdown>
          </div>}
        </div>
      </div>
    </Modal>
  );
}
