import { useEffect, useState } from "react";
import "./App.css";
import VerticalSpinner from "./spinner";
import Webcam from "react-webcam";

// Sample strings for the carousel
const strings = [
  "Rate my fit",
  "Rate my music taste",
  "Predict my next co-op",
  "Fortune telling",
];

function App() {
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // useEffect(() => {
  //   if (chosenOption !== null) {
  //     setTimeout()
  //   }

  // }, [chosenOption])

  return (
    <>
      <VerticalSpinner options={strings} setChosenOption={setChosenOption} />
      {chosenOption}
      {/* {chosenOption && (
        <>
          <Webcam audio={false} screenshotFormat="image/png" width={1600} height={900} disablePictureInPicture={true}>
            {({ getScreenshot }) => (
              <button
                onClick={() => {
                  console.log(getScreenshot());
                }}
              >take a shot</button>
            )}
          </Webcam>
        </>
      )} */}
    </>
  );
}

export default App;
