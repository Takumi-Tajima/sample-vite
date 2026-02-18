import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Loading } from './Loading.jsx';
import { StudyRecords } from './StudyRecords.jsx';

export const StudyBody = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    supabase.from("study-record").select("*").then(({ data, error }) => {
      setIsLoading(true);
      if (error) {
        // エラーハンドリングのみ
      } else {
        setRecords(data);
      }
      setIsLoading(false);
    });
  }, []);
  return isLoading ? <Loading /> : <StudyRecords records={records} />
}
  