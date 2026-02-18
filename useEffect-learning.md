# Supabaseデータ取得で学んだこと

## 問題

コンポーネント内で直接Supabaseのデータ取得を行い、その結果をuseStateの初期値に渡そうとしたが、実際のデータではなくPromiseオブジェクトが入ってしまった。

```jsx
// 問題のあるコード
const datas = supabase.from("study-record").select("*").then(({ data, error }) => {
  // ...
});

const [records, setRecords] = useState([datas]); // ← Promiseが入る
```

## 原因

2つの原因がある。

### 1. 非同期処理(Promise)の理解不足

`supabase.from().select().then()` はネットワーク通信を伴う非同期処理。返り値はデータそのものではなく **Promise（「あとで届けるよ」という約束オブジェクト）** になる。

JavaScriptはネットワーク通信の完了を待たずに次の行を実行するため、`useState([datas])` が実行される時点ではまだデータは届いていない。

```
① const datas = supabase.from(...).select(...).then(...)  → Promiseを返す（データ未到着）
② const [records, setRecords] = useState([datas])          → 即実行。datasはまだPromise。
③ ...しばらく後... → サーバーからデータ到着。でもuseStateの初期値は設定済み。
```

### 2. コンポーネント本体に直接書くことの問題

Reactはstateが変わるたびにコンポーネント関数を再実行する。コンポーネント本体に直接API呼び出しを書くと、**レンダリングのたびにリクエストが飛んでしまう**。

## 解決方法

`useEffect` を使って、レンダリングとデータ取得を分離する。

```jsx
const [records, setRecords] = useState([]);  // 初期値は空配列

useEffect(() => {
  supabase.from("study-record").select("*").then(({ data, error }) => {
    if (error) {
      console.error("データの取得に失敗:", error.message);
    } else {
      setRecords(data);  // データが届いたらstateを更新
    }
  });
}, []);  // 空配列 = 最初の1回だけ実行
```

### useEffectのポイント

- **第1引数**: 実行したい処理（関数）
- **第2引数**: 依存配列。いつ実行するかを制御する
  - `[]`（空配列）: 最初の1回だけ
  - `[count]`: 最初 + countが変わるたび
  - 省略: 毎回のレンダリング後（ほぼ使わない）

### 正しい流れ

1. 初回レンダリング: recordsは`[]`なので空の画面が表示
2. レンダリング完了後にuseEffectが動き、Supabaseにリクエスト送信
3. データが届いたら`setRecords(data)`でstateを更新
4. stateが変わったので再レンダリング → 一覧が表示される
5. useEffectは`[]`なので2回目以降は動かない

---

# useEffect内でsetStateを呼ぶとエラーになる問題

## エラーメッセージ

```
Error: Calling setState synchronously within an effect can trigger cascading renders
```

「effectの中で同期的にsetStateを呼ぶと、連鎖的な再レンダリングが起きるで」という意味。

## 問題のコード

```jsx
export const StudyBody = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);

  const fetchStudyRecords = () => {
    supabase.from("study-record").select("*").then(({ data, error }) => {
      if (!error) setRecords(data);   // ← setState
      setIsLoading(false);            // ← setState
    });
  };

  useEffect(() => {
    fetchStudyRecords();  // ← setStateを含む関数をeffect内で呼んでいる
  }, []);

  return isLoading ? <Loading /> : <StudyRecords records={records} fetchStudyRecords={fetchStudyRecords} />
}
```

## なぜダメなのか

### 前提：useEffectの役割

useEffectは「Reactの外の世界（API、DB、DOM等）と同期するための仕組み」。
React内部のstate管理を直接操作する場所ではない。

### Reactのルール

- **OK**: effect内から外部システム（Supabase等）にリクエストを送る
- **OK**: 外部からの応答を受け取るコールバック内でsetStateする（イベントハンドラ等）
- **NG**: effectの実行フローの中でsetStateが呼ばれる構造になっている

### 何が起きているか

```
useEffect が実行される（Reactの管理下）
  └→ fetchStudyRecords() を呼ぶ
       └→ .then() の中で setRecords(data) と setIsLoading(false)
            └→ stateが変わる → 再レンダリング発生
```

Reactから見ると「effectが原因でstateが変わった」と判断される。
すると以下のような連鎖（カスケード）が起きる可能性がある：

```
effect実行 → setState → 再レンダリング → effect再評価 → setState → 再レンダリング...
```

React 19ではこのパターンを検知してエラーにしている。

### 根本的な問題

`fetchStudyRecords` という1つの関数が2つの役割を持ってしまっていた：

1. **初回ロード時**: データ取得 + isLoadingをfalseにする（useEffectから呼ばれる）
2. **insert後の再取得時**: データだけ取得する（イベントハンドラから呼ばれる）

useEffectから呼ばれる関数の中にsetStateがあるのがNG。
イベントハンドラ（ボタンクリック等）から呼ばれる分には問題ない。

## 解決方法

「初回ロード」と「再取得」を分ける。

```jsx
export const StudyBody = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);

  // ① insert後の再取得用（isLoadingは触らない）
  const fetchStudyRecords = () => {
    supabase.from("study-record").select("*").then(({ data, error }) => {
      if (!error) setRecords(data);
    });
  };

  // ② 初回ロード用（useEffect内で完結させる）
  useEffect(() => {
    supabase.from("study-record").select("*").then(({ data, error }) => {
      if (!error) setRecords(data);
      setIsLoading(false);
    });
  }, []);

  return isLoading
    ? <Loading />
    : <StudyRecords records={records} fetchStudyRecords={fetchStudyRecords} />
}
```

### なぜこれで解決するのか

- **useEffect内**: Supabaseへのリクエストと `.then()` のコールバックだけが書かれている。
  `fetchStudyRecords` という外部関数を経由しないので、Reactが「effectがsetStateを引き起こしている」と判断しない。
- **fetchStudyRecords**: useEffectから呼ばれない。insert後のイベントハンドラから呼ばれるだけなので問題なし。

### ポイントまとめ

| 呼び出し元 | setState | 結果 |
|---|---|---|
| useEffect内から直接/間接的に | NG | カスケードレンダリングのエラー |
| イベントハンドラ（onClick等）から | OK | 通常の再レンダリング |
| useEffect内の `.then()` コールバックから（関数を経由しない） | OK | 非同期コールバックとして扱われる |
