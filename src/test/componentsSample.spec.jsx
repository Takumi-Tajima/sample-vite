import { StudyRecords } from "../StudyRecords";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { supabase } from "../supabaseClient";

jest.mock("../supabaseClient", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('StudyRecords Component', () => {
  it('タイトルが表示されていること', () => {
    render(<StudyRecords records={[]} fetchStudyRecords={jest.fn()} />)
    expect(document.querySelector('h1').textContent).toBe('学習');
  });

  it('フォームに学習内容と時間を入力して登録ボタンを押すと、正しい引数でinsertが呼ばれ、フォームがクリアされること', async () => {
    const mockFetchStudyRecords = jest.fn();
    const mockInsert = jest.fn().mockReturnValue(Promise.resolve({ error: null }));
    supabase.from.mockReturnValue({ insert: mockInsert });
    render(<StudyRecords records={[]} fetchStudyRecords={mockFetchStudyRecords} />)
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('内容'), 'Reactを勉強する');
    await user.type(screen.getByLabelText('時間'), '2');
    await user.click(screen.getByText('追加'));

    expect(supabase.from).toHaveBeenCalledWith('study-record');
    expect(mockInsert).toHaveBeenCalledWith({ title: 'Reactを勉強する', time: 2 });
    expect(screen.getByLabelText('内容')).toHaveValue('');
    expect(screen.getByLabelText('時間')).toHaveValue('0');
    expect(mockFetchStudyRecords).toHaveBeenCalled();
  });

  it('削除ボタンを押すと、その記録が削除されること', async () => {
    const records = [{ id: 1, title: 'Reactを勉強する', time: 2 }];
    const mockFetchStudyRecords = jest.fn();
    const mockEq = jest.fn().mockReturnValue(Promise.resolve({ error: null }));
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ delete: mockDelete });
    render(<StudyRecords records={records} fetchStudyRecords={mockFetchStudyRecords} />)
    const user = userEvent.setup();
    await user.click(screen.getByText('削除'));

    expect(supabase.from).toHaveBeenCalledWith('study-record');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 1);
    expect(mockFetchStudyRecords).toHaveBeenCalled();
  });

  it('内容が入力されていない状態でボタンを押すと、入力されていない項目がありますとエラーメッセージが表示されること', async () => {
    render(<StudyRecords records={[]} fetchStudyRecords={jest.fn()} />)
    const user = userEvent.setup();
    await user.click(screen.getByText('追加'));

    expect(screen.getByText('入力されていない項目があります')).toBeInTheDocument();
  });
})
