import { StudyRecords } from "../StudyRecords";
import { render } from "@testing-library/react";

describe('StudyRecords Component', () => {
  it('タイトルが表示されていること', () => {
    render(<StudyRecords records={[]} fetchStudyRecords={jest.fn()} />)
    expect(document.querySelector('h1').textContent).toBe('学習');
  });
})
