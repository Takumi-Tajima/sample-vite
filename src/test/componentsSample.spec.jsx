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

  it('フォームに学習内容と時間を入力して登録ボタンを押すと新たに記録が追加されていること', async () => {
    const mockFetchStudyRecords = jest.fn();
    supabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue(Promise.resolve({ error: null })),
    });
    const { rerender } = render(<StudyRecords records={[]} fetchStudyRecords={mockFetchStudyRecords} />)
    const user = userEvent.setup();

    expect(screen.getByTestId('studyRecordsList').querySelectorAll('li')).toHaveLength(0);
    await user.type(screen.getByLabelText('内容'), 'Reactを勉強する');
    await user.type(screen.getByLabelText('時間'), '2');
    expect(screen.getByTestId('studyContentDisplay').textContent).toBe('入力されている学習内容: Reactを勉強する');
    expect(screen.getByTestId('studyTimeDisplay').textContent).toBe('入力されている学習時間: 2時間');
    await user.click(screen.getByText('追加'));
    expect(screen.getByLabelText('内容').value).toBe('');
    expect(screen.getByLabelText('時間').value).toBe('0');
    expect(mockFetchStudyRecords).toHaveBeenCalled();
    const updatedRecords = [{ id: 1, title: 'Reactを勉強する', time: 2 }];
    rerender(<StudyRecords records={updatedRecords} fetchStudyRecords={mockFetchStudyRecords} />);
    const listAfter = screen.getByTestId('studyRecordsList');

    expect(listAfter.querySelectorAll('li')).toHaveLength(1);
    expect(listAfter.textContent).toContain('Reactを勉強する');
    expect(listAfter.textContent).toContain('2時間');
  });

  it('削除ボタンを押すと、その記録が削除されること', async () => {
    // すでにタスクが1件あるデータを渡してコンポーネントをレンダリングする
    // レンダリングされたタスクのli要素を確認して、表示ボタンがあることを確認する
    // 表示されている削除ボタンを押すと、supabase.from().delete()が呼び出されることを確認する
    // supabase.from().delete()の呼び出し後にfetchStudyRecordsが呼び出されることを確認する
    // 再度コンポーネントをレンダリングして、タスクが削除されていることを確認する
  });

  it('内容が入力されていない状態でボタンを押すと、入力されていない項目がありますとエラーメッセージが表示されること', async () => {
    // 何も入力されていない状態で追加ボタンを押すと、エラーメッセージが表示されることを確認する
  });
})
