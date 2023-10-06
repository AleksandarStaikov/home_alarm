import styles from "./Homepage.module.css";
import { useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

function Homepage() {
  const [brightness, setBrightness] = useState(255);
  const [color, setColor] = useState("#fff");
  const [isOn, setIsOn] = useState(false);

  function handleOnToggle() {
    setIsOn((prev) => !prev);
  }

  function hanldeNewCollor(alfaHexValue) {
    const colorHexValue = alfaHexValue.slice(0, 7);
    const newBrightness = parseInt(alfaHexValue.slice(7, 9) || "ff", 16);

    if (newBrightness !== brightness) {
      setBrightness(newBrightness);
      console.log(newBrightness);
    }

    if (color !== colorHexValue) {
      setColor(colorHexValue);
      console.log(colorHexValue);
    }
  }

  const buttonType = isOn ? "onButton" : "offButton";

  return (
    <div className={styles.homepage}>
      <h1>Alarm homepage</h1>

      <HexAlphaColorPicker color={color} onChange={hanldeNewCollor} />
      <button className={styles[buttonType]} onClick={handleOnToggle}>
        Toggle
      </button>
    </div>
  );
}

export default Homepage;
