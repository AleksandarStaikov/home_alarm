import styles from "./AlarmDay.module.css";

const dayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function AlarmDay({ alarm, i, onClick }) {
  return (
    <span className={styles.alarm} onClick={onClick}>
      <div className={styles.day}>{dayOfWeek[i]}</div>

      <div className={styles.time}>{alarm}</div>
    </span>
  );
}

export default AlarmDay;
