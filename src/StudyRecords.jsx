import { useState } from "react";
import { supabase } from "./supabaseClient";

export const StudyRecords = ({records, fetchStudyRecords}) => {
  const [studyContent, setStudyContent] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [error, setError] = useState("");

  const onClickAddNewRecords = () => {
    if (studyContent === "" || isNaN(studyTime) || studyTime < 0) {
      setError("入力されていない項目があります");
      return;
    }
    supabase
      .from('study-record')
      .insert({ title: studyContent, time: studyTime })
      .then(({ error }) => {
        if (error) {
          setError("データの追加に失敗しました");
        } else {
          setStudyContent("");
          setStudyTime(0);
          setError("");
          fetchStudyRecords();
        }
      });
  }

  const onClickDelete = (id) => {
    supabase
      .from('study-record')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          setError("データの削除に失敗しました");
        } else {
          setError("");
          fetchStudyRecords();
        }
      });
  }

  const onChangeStudyContent = (e) => {
    setStudyContent(e.target.value);
  };
  const onChangeStudyTime = (e) => {
    setStudyTime(Number(e.target.value));
  };

  return (
    <>
      <h1 style={{backgroundColor: 'red'}}>学習</h1>
      <div>
        <label htmlFor="studyContent">内容</label>
        <input id="studyContent" value={studyContent} onChange={onChangeStudyContent} />
      </div>
      <div>
        <label htmlFor="studyTime">時間</label>
        <input id="studyTime" value={studyTime} onChange={onChangeStudyTime} />時間
      </div>
      <p>入力されている学習内容: {studyContent}</p>
      <p>入力されている学習時間: {studyTime}時間</p>
      <ul>
        {records.map((record) => (
          <li key={record.id} style={{ display: "flex", alignItems: "center" }}>
            <div>
              {record.title} {record.time}時間
            </div>
            <div style={{ marginLeft: "3px" }}>
              <button onClick={() => onClickDelete(record.id)}>削除</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={onClickAddNewRecords}>追加</button>
      <p>{error}</p>
      <p>合計学習時間{records.reduce((sum, record) => sum + record.time, 0)}時間</p>
    </>
  )
}
