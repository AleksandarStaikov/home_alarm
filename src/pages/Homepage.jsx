import { useEffect, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { debounce } from "lodash";

import styles from "./Homepage.module.css";
import Spinner from "../components/Spinner";
import AlarmDay from "../components/AlarmDay";
import AlarmDayEditor from "../components/AlarmDayEditor";

const urlBase = "http://192.168.1.55:80";

function Homepage() {
  const [isOn, setIsOn] = useState(false);
  const [color, setColor] = useState("#FFF");
  const [brightness, setBrightness] = useState(0);
  const [alarms, setAlarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDay, setOpenDay] = useState(null);

  const buttonType = isOn ? "onButton" : "offButton";
  const computedColor = `${color}${brightness.toString(16).padStart(2, "0")}`;

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

    const fetchAlarms = () =>
      fetch(`${urlBase}/show-alarms`)
        .then((res) => res.json())
        .then((data) => {
          let processedData = data.map((alarm) =>
            String(Number(alarm).toFixed(2)).padStart(5, "0").replace(".", ":")
          );
          setAlarms(processedData);
        });

    Promise.all([
      fetchLightStatus(),
      fetchLightColor(),
      fetchLightBrightness(),
      fetchAlarms(),
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

  function handleDayClick(i) {
    if (openDay === i) {
      setOpenDay(null);
    } else {
      setOpenDay(i);
    }
  }

  function handleSaveAlarmTime(index, newTime) {
    const newAlarms = [...alarms];
    newAlarms[index] = newTime;

    console.log(newAlarms);

    const updateBody = {
      day: index,
      time: Number(newTime.replace(":", ".")),
    };

    console.log(updateBody);

    fetch(`${urlBase}/change-alarm`, {
      method: "POST",
      body: JSON.stringify(updateBody),
    });

    setOpenDay(null);
    setAlarms(newAlarms);
  }

  return (
    <div className={styles.homepage}>
      {isLoading ?? <Spinner />}

      {openDay !== null ? (
        <AlarmDayEditor
          dayOfWeek={openDay}
          time={alarms[openDay]}
          onSave={handleSaveAlarmTime}
        />
      ) : (
        <>
          <h2>Alarm homepage</h2>
          <div className={styles.alarms}>
            {alarms.map((alarm, i) => (
              <AlarmDay
                key={i}
                alarm={alarm}
                i={i}
                onClick={() => handleDayClick(i)}
              />
            ))}
          </div>

          <HexAlphaColorPicker
            color={computedColor}
            onChange={handleColorChange}
          />
          <button className={styles[buttonType]} onClick={handleToggle}>
            Toggle
          </button>
        </>
      )}
    </div>
  );
}

export default Homepage;
