import { useState } from "react";

export const StudyRecords = ({records}) => {
  const [studyContent, setStudyContent] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [error, setError] = useState("");

  const onClickAddNewRecords = () => {
    if (studyContent === "" || isNaN(studyTime) || studyTime < 0) {
      setError("入力されていない項目があります");
      return;
    }
    setStudyContent("");
    setStudyTime(0);
    setError("");
  }
  const onChangeStudyContent = (e) => {
    setStudyContent(e.target.value);
  };
  const onChangeStudyTime = (e) => {
    setStudyTime(Number(e.target.value));
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
      <p>入力されている学習時間: {studyTime}時間</p>
      <ul>
        {records.map((record) => (
          <li key={record.id}>{record.title} {record.time}時間</li>
        ))}
      </ul>
      <button onClick={onClickAddNewRecords}>追加</button>
      <p>{error}</p>
      <p>合計学習時間{records.reduce((sum, record) => sum + record.time, 0)}時間</p>
    </>
  )
}
