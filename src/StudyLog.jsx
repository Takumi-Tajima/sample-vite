import { useState } from "react";

export const StudyLogs = () => {
  const [records, setRecords] = useState([]);
  const [studyContent, setStudyContent] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const onClickAddNewRecords = () => {
  }
  const onChangeStudyContent = (e) => {
    setStudyContent(e.target.value);
  };
  const onChangeStudyTime = (e) => {
    setStudyTime(e.target.value);
  };

  return (
    <>
      <h1>学習記録一覧</h1>
      <div>
        <label htmlFor="studyContent">学習内容</label>
        <input id="studyContent" value={studyContent} onChange={onChangeStudyContent} />
      </div>
      <div>
        <label htmlFor="studyTime">学習時間</label>
        <input id="studyTime" value={studyTime} onChange={onChangeStudyTime} />時間
      </div>
      <p>入力されている学習内容: {studyContent}</p>
      <p>入力されている学習時間: {studyTime == "" ? "NaN" : studyTime}時間</p>
      <ul>
        {records.map((record, index) => (
          <li key={index}>{record.title} {record.time}時間</li>
        ))}
      </ul>
      <button onClick={onClickAddNewRecords}>追加</button>
    </>
  )
}
