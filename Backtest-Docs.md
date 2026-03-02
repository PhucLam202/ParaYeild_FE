# POST /api/v1/backtest/run

Chạy backtest danh mục đầu tư dựa trên APY lịch sử thực tế từng ngày.

---

## Endpoint

```
POST http://localhost:3005/api/v1/backtest/run
Content-Type: application/json
```

---

## Request Body

### Schema đầy đủ

```jsonc
{
  "initialAmountUsd":    number,   // BẮT BUỘC
  "from":                string,   // BẮT BUỘC — "YYYY-MM-DD"
  "to":                  string,   // BẮT BUỘC — "YYYY-MM-DD"
  "allocations":         array,    // BẮT BUỘC — ít nhất 1 phần tử, tổng % = 100
  "rebalanceIntervalDays": number, // tùy chọn — 0 = không rebalance
  "includeIL":           boolean,  // tùy chọn — bật tính IL cho pool DEX/farming
  "xcmFeeUsd":           number    // tùy chọn — phí XCM mỗi lần rebalance (USD)
}
```

---

### Các trường chi tiết

#### `initialAmountUsd` *(BẮT BUỘC)*

| Thuộc tính | Giá trị |
|------------|---------|
| Kiểu       | `number` |
| Tối thiểu  | `1` |
| Mô tả      | Số vốn đầu tư ban đầu tính bằng USD |

```json
"initialAmountUsd": 10000
```

---

#### `from` *(BẮT BUỘC)*

| Thuộc tính | Giá trị |
|------------|---------|
| Kiểu       | `string` — ISO date `"YYYY-MM-DD"` |
| Mô tả      | Ngày bắt đầu backtest |
| Lưu ý      | Phải **trước** `to`. Chỉ có data từ ngày hệ thống crawl được (xem `/backtest/apy-history` để kiểm tra) |

```json
"from": "2026-01-01"
```

---

#### `to` *(BẮT BUỘC)*

| Thuộc tính | Giá trị |
|------------|---------|
| Kiểu       | `string` — ISO date `"YYYY-MM-DD"` |
| Mô tả      | Ngày kết thúc backtest (inclusive) |

```json
"to": "2026-02-01"
```

---

#### `allocations` *(BẮT BUỘC)*

| Thuộc tính | Giá trị |
|------------|---------|
| Kiểu       | `array<AllocationObject>` |
| Tối thiểu  | 1 phần tử |
| Ràng buộc  | Tổng `percentage` của tất cả allocation **phải bằng 100** (cho phép sai số ±0.01) |

**Cấu trúc mỗi allocation:**

```jsonc
{
  "protocol":    string,  // BẮT BUỘC — tên protocol (lowercase)
  "assetSymbol": string,  // BẮT BUỘC — ký hiệu tài sản (phân biệt hoa/thường)
  "percentage":  number,  // BẮT BUỘC — % phân bổ (0.01 – 100)
  "poolType":    string   // tùy chọn — "dex" | "vstaking" | "lending" | ...
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `protocol` | `string` | Có | Tên protocol, **phải khớp chính xác** với data trong `/pools/history` (ví dụ: `"bifrost"`, `"hydration"`, `"acala"`) |
| `assetSymbol` | `string` | Có | Ký hiệu token, **phân biệt hoa/thường**, phải khớp với dữ liệu crawled (ví dụ: `"vDOT"`, `"HOLLAR"`, `"DOT"`) |
| `percentage` | `number` | Có | Tỷ lệ phân bổ, min `0.01`, max `100` |
| `poolType` | `string` | Không | Loại pool. Chỉ `"dex"` hoặc `"farming"` mới kích hoạt tính IL khi `includeIL: true` |

---

#### `rebalanceIntervalDays` *(tùy chọn)*

| Thuộc tính | Giá trị |
|------------|---------|
| Kiểu       | `number` |
| Mặc định   | `0` (không rebalance) |
| Mô tả      | Rebalance mỗi N ngày. Mỗi lần rebalance sẽ trừ phí XCM và phân bổ lại theo % ban đầu |

```json
"rebalanceIntervalDays": 7
```

---

#### `includeIL` *(tùy chọn)*

| Thuộc tính | Giá trị |
|------------|---------|
| Kiểu       | `boolean` |
| Mặc định   | `false` |
| Mô tả      | Nếu `true`, tính Impermanent Loss ước tính cho các pool có `poolType: "dex"` hoặc `"farming"` |

```json
"includeIL": true
```

> **Lưu ý:** IL được ước tính từ độ biến động APY (proxy), không phải giá token thực tế.

---

#### `xcmFeeUsd` *(tùy chọn)*

| Thuộc tính | Giá trị |
|------------|---------|
| Kiểu       | `number` |
| Mặc định   | `0.5` |
| Mô tả      | Phí XCM (USD) cho mỗi cross-chain hop khi rebalance. Chỉ áp dụng khi `rebalanceIntervalDays > 0` |

```json
"xcmFeeUsd": 0.5
```

---

## Ví dụ Request

### Ví dụ tối thiểu (không rebalance)

```json
{
  "initialAmountUsd": 10000,
  "from": "2026-01-01",
  "to": "2026-02-01",
  "allocations": [
    {
      "protocol": "bifrost",
      "assetSymbol": "vDOT",
      "percentage": 60,
      "poolType": "vstaking"
    },
    {
      "protocol": "hydration",
      "assetSymbol": "HOLLAR",
      "percentage": 40,
      "poolType": "dex"
    }
  ]
}
```

### Ví dụ đầy đủ (có rebalance, có IL)

```json
{
  "initialAmountUsd": 50000,
  "from": "2026-01-01",
  "to": "2026-02-28",
  "allocations": [
    {
      "protocol": "bifrost",
      "assetSymbol": "vDOT",
      "percentage": 50,
      "poolType": "vstaking"
    },
    {
      "protocol": "hydration",
      "assetSymbol": "HOLLAR",
      "percentage": 30,
      "poolType": "dex"
    },
    {
      "protocol": "acala",
      "assetSymbol": "DOT",
      "percentage": 20,
      "poolType": "lending"
    }
  ],
  "rebalanceIntervalDays": 7,
  "includeIL": true,
  "xcmFeeUsd": 0.5
}
```

### cURL

```bash
curl -X POST http://localhost:3005/api/v1/backtest/run \
  -H "Content-Type: application/json" \
  -d '{
    "initialAmountUsd": 10000,
    "from": "2026-01-01",
    "to": "2026-02-01",
    "allocations": [
      { "protocol": "bifrost", "assetSymbol": "vDOT", "percentage": 60, "poolType": "vstaking" },
      { "protocol": "hydration", "assetSymbol": "HOLLAR", "percentage": 40, "poolType": "dex" }
    ]
  }'
```

---

## Response — HTTP 200

```jsonc
{
  "summary": { ... },     // Chỉ số tổng quan
  "breakdown": [ ... ],   // Chi tiết từng allocation
  "timeSeries": [ ... ]   // Chuỗi giá trị theo ngày (tối đa 500 điểm)
}
```

### `summary`

```jsonc
{
  "initialAmountUsd":      10000,          // Vốn ban đầu
  "finalAmountUsd":        10582.3412,     // Giá trị cuối kỳ
  "totalReturnUsd":        582.3412,       // Lợi nhuận tuyệt đối (USD)
  "totalReturnPercent":    5.8234,         // Lợi nhuận % cả kỳ
  "annualizedApyPercent":  70.1234,        // APY quy năm (geometric)
  "maxDrawdownPercent":    -2.1500,        // Drawdown tối đa (giá trị âm)
  "sharpeRatio":           1.8500,         // Sharpe Ratio (risk-free = 5%/năm)
  "durationDays":          31,             // Số ngày backtest
  "from":                  "2026-01-01T00:00:00.000Z",
  "to":                    "2026-02-01T00:00:00.000Z",
  "rebalancedCount":       4,              // Số lần đã rebalance
  "xcmFeesPaidUsd":        2.0000,         // Tổng phí XCM đã trả
  "ilIncluded":            false           // IL có được tính không
}
```

### `breakdown` — mảng, mỗi phần tử ứng với 1 allocation

```jsonc
{
  "protocol":          "bifrost",
  "assetSymbol":       "vDOT",
  "poolType":          "vstaking",
  "allocationPercent": 60,
  "allocatedUsd":      6000.0000,      // Vốn ban đầu đổ vào allocation này
  "avgApyPercent":     18.5000,        // APY trung bình trong kỳ
  "minApyPercent":     14.2000,        // APY thấp nhất trong kỳ
  "maxApyPercent":     23.1000,        // APY cao nhất trong kỳ
  "ilLossUsd":         0,              // Tổn thất IL (chỉ có khi includeIL=true và poolType="dex"/"farming")
  "finalUsd":          6352.1234,      // Giá trị cuối kỳ của allocation này
  "returnUsd":         352.1234,       // Lợi nhuận (USD)
  "returnPercent":     5.8687,         // Lợi nhuận %
  "dataPointsUsed":    31,             // Số ngày có dữ liệu APY
  "hasHistoricalData": true            // false = không tìm thấy data → tất cả tính là 0%
  // Nếu hasHistoricalData = false sẽ có thêm:
  // "warning": "No historical APY data found for bifrost/vDOT. All returns computed as 0%."
}
```

### `timeSeries` — mảng tối đa 500 điểm

```jsonc
[
  {
    "date":           "2026-01-01",
    "totalValueUsd":  10000.0000,   // Giá trị danh mục ngày đó
    "dailyReturnPct": 0.0000        // % thay đổi so với ngày trước
  },
  {
    "date":           "2026-01-02",
    "totalValueUsd":  10004.9315,
    "dailyReturnPct": 0.0493
  }
  // ...
]
```

---

## Lỗi thường gặp

| HTTP Status | Code | Nguyên nhân |
|-------------|------|-------------|
| `400` | `BAD_REQUEST` | Tổng `percentage` ≠ 100 |
| `400` | `BAD_REQUEST` | `from` >= `to` |
| `400` | `BAD_REQUEST` | `initialAmountUsd` < 1 |
| `400` | `BAD_REQUEST` | Không kết nối được tới pools data server |

**Response lỗi:**
```json
{
  "statusCode": 400,
  "message": "Allocations must sum to 100%. Got 95.00%",
  "error": "Bad Request"
}
```

---

## Lưu ý quan trọng cho UI

### 1. Kiểm tra `hasHistoricalData` trước khi hiển thị kết quả

```js
breakdown.forEach(alloc => {
  if (!alloc.hasHistoricalData) {
    // Hiện cảnh báo: dữ liệu APY không tìm thấy → return = 0%
    console.warn(alloc.warning)
  }
})
```

### 2. Kiểm tra data trước khi gọi backtest

Dùng endpoint `GET /api/v1/backtest/apy-history` để xác nhận data tồn tại:

```
GET /api/v1/backtest/apy-history?protocol=bifrost&asset=vDOT&from=2026-01-01&to=2026-02-01
```

- Nếu `count: 0` → backtest sẽ tính với APY = 0%, kết quả sẽ sai
- `protocol` và `assetSymbol` phải **khớp chính xác** (case-sensitive) với giá trị trả về từ API này

### 3. `maxDrawdownPercent` luôn là số âm hoặc 0

Giá trị này đã được đổi dấu âm trong response (`-maxDrawdown`), nên để hiển thị đúng:
```js
// UI: "Max Drawdown: -2.15%"
const display = summary.maxDrawdownPercent  // Đã là số âm, dùng trực tiếp
```

### 4. `timeSeries` đã được downsample

Nếu kỳ backtest > 500 ngày, dữ liệu sẽ bị downsample xuống còn 500 điểm. Điểm đầu và điểm cuối luôn được giữ lại.

---

## Bug đã xác nhận — Nguyên nhân kết quả sai

### Nguyên nhân chính: `protocol`/`assetSymbol` không khớp

Khi gọi `/backtest/run`, service fetch APY history qua:
```
GET /pools/history?protocol={protocol}&asset={assetSymbol}&poolType={poolType}
```

Nếu external API trả về `count: 0` (không tìm thấy record), toàn bộ APY = 0 và kết quả backtest sẽ là **vốn ban đầu không tăng trưởng**. Dấu hiệu nhận biết:
- `breakdown[].hasHistoricalData = false`
- `breakdown[].avgApyPercent = 0`
- `summary.totalReturnPercent ≈ 0`

**Cách debug:**
1. Gọi `GET /api/v1/backtest/apy-history` với cùng params
2. Kiểm tra `count` — nếu `0` thì protocol/asset sai
3. Gọi `GET /api/v1/pools` để xem danh sách protocol và assetSymbol đúng

### Nguyên nhân phụ: `totalApy = 0` không fallback về `supplyApy + rewardApy`

Trong `buildApyMap`, logic fallback dùng `??` (nullish coalescing):
```ts
const apy = rec.totalApy ?? ((rec.supplyApy ?? 0) + (rec.rewardApy ?? 0));
```
Toán tử `??` chỉ fallback khi `totalApy` là `null` hoặc `undefined`. Nếu API trả về `totalApy: 0` (zero), nó sẽ dùng `0` thay vì tính `supplyApy + rewardApy`. Đây là bug tiềm ẩn khi pool có APY thực sự = 0 hoặc field `totalApy` không được set đúng.
