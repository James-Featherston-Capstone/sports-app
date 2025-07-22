import { useState, type MouseEvent } from "react";
import { Button } from "./ui/button";
import "./ButtonAnimation.css";
import { type DisplayEvent } from "@/utils/interfaces";
import { getDisplayDate } from "@/utils/utils";

interface ButtonAnimation {
  handleRsvp: () => void;
  isRsvp: boolean;
  event: DisplayEvent;
}

const ButtonAnimation = ({ handleRsvp, isRsvp, event }: ButtonAnimation) => {
  const [clicked, setClicked] = useState(false);
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleRsvp();
    if (!isRsvp) {
      setClicked(true);
      setTimeout(() => setClicked(false), 5000);
    }
  };
  const handleBackgroundClick = (e: MouseEvent) => {
    e.stopPropagation();
    setClicked(false);
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        variant={isRsvp ? "checked" : "notChecked"}
      >
        <span
          className={`transition-opacity duration-300 ${
            clicked ? "opacity-0" : "opacity-100"
          }`}
        >
          RSVP
        </span>
        {clicked && (
          <span
            onClick={handleBackgroundClick}
            className={`fixed z-50 flex items-center justify-center text-black animate-spin`}
          >
            <div className="fixed flex justify-around z-50 items-center flex-col w-100 h-100 bg-white rounded-xl border-2 hover shadow-sm">
              <h1 className="text-4xl font-bold">Congratulations</h1>
              <h1 className="text-2xl">Get Ready for</h1>
              <h1 className="text-3xl">{event.sport}</h1>
              <h1 className="text-2xl">Hosted on:</h1>
              <h1 className="text-xl">{getDisplayDate(event.eventTime)}</h1>
              <h1 className="text-lg">Click on the event for more info</h1>
            </div>
          </span>
        )}
      </Button>
    </>
  );
};

export default ButtonAnimation;
