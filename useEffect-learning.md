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
