import { Input, Modal, Spin } from "antd";
import { useState } from "react";
import { testImagePrompt, testPrompt } from "./prompting";
import Webcam from "react-webcam";
import { prompts } from "./types";

interface InputModalProps {
  option: string;
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
  option,
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

  async function submitToPrompt() {
    setSubmitState(SubmitState.AWAITING);
    const promptResult = await testPrompt();

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
    console.log(imageB64);

    const promptResult = await testImagePrompt(imageB64.split("base64,")[1]);

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
      title={option}
      width={1200}
      onOk={closeModal}
      onCancel={closeModal}
      onClose={closeModal}
      footer={null}
    >
      {(() => {
        const selectedPrompt = prompts.find((p) => p.task === option);
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
                      <button onClick={() => imagePrompt(getScreenshot())}>
                        Take your shot. For Profit.
                      </button>
                    )}
                  </Webcam>
                ) : (
                  <img src={inputImageB64} />
                )}
              </div>
            );
          case "text":
            <div className="text-input">
              <Input
                maxLength={300}
                showCount
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
              />
            </div>;
        }
      })()}

      {submitState === SubmitState.AWAITING && <Spin />}
      {promptResult}
    </Modal>
  );
}
