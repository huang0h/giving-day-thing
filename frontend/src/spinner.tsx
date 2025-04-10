import React, { useState, useEffect, useRef, SetStateAction } from 'react';

const START_SPIN_SPEED = 50;
const MAX_SPIN_SPEED = 250;
const SPIN_SPEED_INCREMENT = 7.5;

interface VerticalSpinnerProps {
  options: string[];
  setChosenOption: React.Dispatch<SetStateAction<string | null>>
}

const VerticalSpinner = ({ options, setChosenOption: setChosenOption }: VerticalSpinnerProps) => {  
  const [isSpinning, setIsSpinning] = useState<boolean | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [spinSpeed, setSpinSpeed] = useState<number>(START_SPIN_SPEED); // Initial speed (milliseconds between updates)
  const spinTimerRef = useRef<number | null>(null);
  const slowdownRef = useRef<number | null>(null);

  function prevIndex(index: number): number {
    return index === 0 ? options.length - 1 : index - 1;
  }
  
  function nextIndex(index: number): number {
    return (index + 1) % options.length;
  }
  
  // Function to start the spinning animation
  const startSpin = () => {
    
    // Reset states
    setIsSpinning(true);
    setChosenOption(null);
    setSpinSpeed(START_SPIN_SPEED); // Fast initial speed
    setCurrentIndex(Math.floor(Math.random() * options.length));
    
    // Start the spinning animation
    spinTimerRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % options.length);
    }, spinSpeed);
    
    // Start the slowdown process
    let currentSpeed = spinSpeed;
    
    slowdownRef.current = setInterval(() => {
      if (!spinTimerRef.current || !slowdownRef.current) return;
      currentSpeed += SPIN_SPEED_INCREMENT;
      
      if (currentSpeed >= MAX_SPIN_SPEED) {
        // Stop the spinning and slowdown intervals
        clearInterval(spinTimerRef.current);
        clearInterval(slowdownRef.current);

        setIsSpinning(false);
        console.log(currentIndex);
      } else {
        // Update the spin speed
        setSpinSpeed(currentSpeed);
        clearInterval(spinTimerRef.current);
        
        // Restart the spin timer with the new speed
        spinTimerRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % options.length);
        }, currentSpeed);
      }
    }, 200); // Check for slowdown every 200ms
  };
  
  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) clearInterval(spinTimerRef.current);
      if (slowdownRef.current) clearInterval(slowdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSpinning !== null && !isSpinning) {
      setChosenOption(options[currentIndex]);
    }
  }, [isSpinning, setChosenOption, currentIndex, options])
  
  return (
    <div className='spinner'>
      <div className='spinner-wheel'>
        <p className='obscured-option'>
          {options[prevIndex(currentIndex)]}
        </p>
        <p>
          {options[currentIndex]}
        </p>
        <p className='obscured-option'>
          {options[nextIndex(currentIndex)]}
        </p>
      </div>
      
      <button
        onClick={startSpin}
        disabled={isSpinning ?? false}
        className='spinner-button'
      >
        {isSpinning ? 'Spinning...' : 'Spin Carousel'}
      </button>
    </div>
  );
};

export default VerticalSpinner;