import styles from "./AlarmDayEditor.module.css";

import { useState } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function AlarmDayEditor({ time, dayOfWeek, onSave }) {
  const [editorTime, setEditorTime] = useState(time);

  return (
    <div className={styles.dayEditor}>
      <h2>{daysOfWeek[dayOfWeek]}</h2>
      <input
        className={styles.timeInput}
        type="time"
        value={editorTime}
        onChange={(e) => setEditorTime(e.target.value)}
      />
      <br />
      <button onClick={() => onSave(dayOfWeek, editorTime)}>Save</button>
    </div>
  );
}

export default AlarmDayEditor;
