import { Input, Modal, Spin } from "antd";
import { useState } from "react";
import { sendImagePrompt, sendTextPrompt } from "./prompting";
import Webcam from "react-webcam";
import { Prompt } from "./types";
import Markdown from "react-markdown";
import "./inputModal.css";

const taskDescriptions = new Map([
  ["RFIT", "fit rate description"],
  ["RMUS", "music rate description"],
  ["COOP", "coop predict description"],
  ["FORT", "fortune tell description"],
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

    const promptResult = await sendImagePrompt(
      selectedPrompt.code,
      imageB64.split("base64,")[1]
    );

    if (promptResult.success) {
      setSubmitState(SubmitState.SUCCESS);
      setPromptResult(promptResult.response);
    } else {
      setSubmitState(SubmitState.ERROR);
      setPromptResult(promptResult.error);
    }
  }

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
        <div className='input-section'>
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
                            <button onClick={() => imagePrompt(getScreenshot())}>
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
                    <button onClick={textPrompt}>SEND IT</button>
                  </div>
                );
            }
          })()}
        </div>

        {submitState === SubmitState.AWAITING && <Spin />}
        <div className="inputmodal-result">
          <Markdown>{promptResult}</Markdown>
        </div>
      </div>
    </Modal>
  );
}
