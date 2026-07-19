# Select v8 — CHANGELOG

本檔記錄 `@v8` 版相對於 `@v7` 的差異。

v8 讓 Select 能處理**大規模 / 遠端資料**:三塊能力,皆以選擇性 prop 開啟,不加時行為與 v7 相同。

1. **虛擬列表(`virtual`)**:只渲染可視範圍,避免長清單渲染超載。
2. **無限滾動**:捲到接近底部送出 `load-more` 事件,由外部載入下一頁 append。
3. **遠端(`remote`)**:不本地過濾,`query` 變動送出 `search` 事件,由外部查詢。

---

## 虛擬列表:`virtual` + `itemHeight`

新增 `useVirtualList` composable(固定列高的 windowing):

- 依 scrollTop 與容器高度算出渲染窗 `range`,只渲染窗內項目(加 overscan 緩衝)。
- phantom 元素撐出總高(`itemCount × itemHeight`)以產生正確捲軸,窗內項目用 `translateY(offsetY)` 定位。
- 窗內每列鎖定 `itemHeight`(CSS var),確保偏移計算精準。
- **a11y**:每個渲染的選項帶 `aria-setsize`(總數)與 `aria-posinset`(位置),讓螢幕閱讀器在只渲染局部時仍知道全貌。
- **鍵盤導覽**:`scrollIntoView` 在虛擬化時改用 `scrollOffsetFor` 計算目標 scrollTop 並設定,確保高亮項一定被渲染(供 `aria-activedescendant` 參照)。

> 實測:5000 筆本地選項,DOM 只渲染約 15 列;捲動 / 方向鍵即時換窗。

## 無限滾動 + 遠端(事件式受控)

- **`search` 事件**:`remote` 時開啟即載入、`query` 變動(debounce 250ms)送出,由呼叫端 fetch 後更新 `options`。
- **`load-more` 事件**:面板捲到接近底部(且非 `loading`、非 `finished`)送出,呼叫端載入下一頁 append 進 `options`。
- **`loading` / `finished` props**:控制載入狀態列與是否停止觸發 `load-more`。
- **狀態列**:空 query 提示「輸入關鍵字搜尋」、載入中「載入中…」、無命中「無結果」、分頁載入時底部「載入中…」。
- remote 時不本地過濾(伺服器已篩),但仍就 query 對回傳 label 標記高亮。

## 新增 Props / Events

| 新增 | 說明 |
| --- | --- |
| `virtual` | 啟用虛擬列表(預設 `false`) |
| `itemHeight` | 虛擬列表單列高度(px,預設 `34`) |
| `remote` | 遠端模式:不本地過濾、送出 `search`(預設 `false`) |
| `loading` | 遠端載入中(顯示載入列、暫停 `load-more`) |
| `finished` | 已無更多資料(停止 `load-more`) |
| `@search(query)` | 遠端查詢事件 |
| `@load-more` | 無限滾動載入下一頁事件 |

三者可任意組合,也與既有的 `filterable` / `multiple` 併用(可搜尋、可多選的遠端虛擬清單)。

## API 相容性

v8 **未移除或變更**既有對外介面,v7 使用端可無痛切換:

- 既有 Props / Emits 全部沿用,行為不變。
- 新增皆為選擇性 prop / event;不加時與 v7 完全一致。

> 差別只在 import 來源：`@v7` → `@v8`。
