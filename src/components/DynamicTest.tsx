import { useState } from "react";

const DynamicTest = () => {
  const [buttonPresses, setButtonPresses] = useState(0);

  return (
    <div>
      This{" "}
      <button
        className="border border-black py-1 px-4 rounded-full mx-2"
        onClick={() => setButtonPresses(buttonPresses + 1)}
      >
        Button
      </button>{" "}
      was pressed {buttonPresses} time
      {buttonPresses === 1 ? "" : "s"}.
    </div>
  );
};

export default DynamicTest;
