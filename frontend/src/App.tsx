import { useEffect, useRef, useState } from "react";
import "./App.css";
import VerticalSpinner from "./spinner";
import InputModal from "./inputModal";
import { prompts } from "./types";


function App() {
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (chosenOption !== null) {
      modalTimeoutRef.current = setTimeout(() => setShowModal(true), 1000);
    } else {
      setShowModal(false);
      if (modalTimeoutRef.current) clearInterval(modalTimeoutRef.current);
    }

  }, [chosenOption])

  return (
    <>
      <h1>GET RATED BY AN AI !!!!</h1>
      <hr />
      <VerticalSpinner options={prompts.map(p => p.task)} setChosenOption={setChosenOption} />
      {/* {chosenOption && (
        <p className='option-display'>{chosenOption}</p>
      )} */}
      {showModal && chosenOption && <InputModal selectedPrompt={prompts.find(p => p.task === chosenOption)!} showModal={showModal} setShowModal={setShowModal} />}
    </>
  );
}

export default App;
