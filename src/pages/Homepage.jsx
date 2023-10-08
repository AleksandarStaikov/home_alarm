import styles from "./Homepage.module.css";
import { useEffect, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

import { debounce } from "lodash";
import Spinner from "../components/Spinner";

const urlBase = "http://192.168.1.55:80";

function Homepage() {
  const [isOn, setIsOn] = useState(false);
  const [color, setColor] = useState("#FFF");
  const [brightness, setBrightness] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLightStatus = () =>
      fetch(`${urlBase}/isOn`)
        .then((res) => res.text())
        .then((data) => setIsOn(data === "1"));

    const fetchLightColor = () =>
      fetch(`${urlBase}/getColor`)
        .then((res) => res.text())
        .then((data) => setColor(data));

    const fetchLightBrightness = () =>
      fetch(`${urlBase}/getBrightness`)
        .then((res) => res.text())
        .then((data) => setBrightness(Number(data)));

    Promise.all([
      fetchLightStatus(),
      fetchLightColor(),
      fetchLightBrightness(),
    ]).then(() => setIsLoading(false));
  }, []);

  function handleToggle() {
    setIsOn((prev) => !prev);
    fetch(`${urlBase}/toggle`);
  }

  const handleColorChange = debounce((newColor) => {
    const colorValue = newColor.slice(1, 7);
    const brightnessValue = parseInt(newColor.slice(7) || "ff", 16);

    if (brightnessValue !== brightness) {
      setBrightness(brightnessValue);
      fetch(`${urlBase}/setBrightness?value=${brightnessValue}`);
    }

    if (colorValue !== color) {
      setColor(colorValue);
      fetch(`${urlBase}/setColor?value=${colorValue}`);
    }
    setIsOn(true);
  }, 500);

  const buttonType = isOn ? "onButton" : "offButton";
  const computedColor = `${color}${brightness.toString(16).padStart(2, "0")}`;

  return (
    <div className={styles.homepage}>
      <h1>Alarm homepage</h1>

      {isLoading ?? <Spinner />}

      <HexAlphaColorPicker color={computedColor} onChange={handleColorChange} />
      <button className={styles[buttonType]} onClick={handleToggle}>
        Toggle
      </button>
    </div>
  );
}

export default Homepage;
