# Simulator Page Documentation (`/simulator`)

## 1. Tổng quan (Overview)
Page Simulator (`http://localhost:3010/simulator`) là một công cụ "Pro-Grade DeFi Backtesting Engine" dành cho hệ sinh thái Polkadot. Chức năng chính của trang là cho phép người dùng cấu hình các tham số và mô phỏng (simulate) hiệu suất đầu tư trong quá khứ dựa trên các chiến lược Yield Farming, dự tính trượt giá (slippage) thanh khoản, và tính toán trích lập phí giao dịch chéo chuỗi (XCM fees).

## 2. Các Tính năng chính của Page (Key Features)

### 2.1. Cấu hình cơ bản (Essential Information)
- **Parachain Selection**: Lựa chọn mạng lưới mô phỏng (Ví dụ: Acala Network, Moonbeam, Parallel Finance, Astar Network).
- **Protocol Type**: Lựa chọn loại hình giao thức DeFi để mô phỏng (Liquidity Provision - DEX, Liquid Staking, Lending & Borrowing).
- **Token Pair**: Lựa chọn cặp Token đầu tư (VD: DOT, vDOT, USDC, USDT, LDOT, ACA). Có logic ràng buộc để chặn việc người dùng chọn 2 token giống hệt nhau (trừ các ngoại lệ hợp lệ được cho phép như cặp DOT - vDOT).
- **Initial Amount ($)**: Nhập số vốn nạp ban đầu bằng USD để dùng làm base mô phỏng.
- **Time Range**: Khoảng thời gian để backtest dữ liệu (90 Days, 180 Days, 1 Year, hoặc Custom Range để user tự dùng Datepicker chọn khoảng thời gian bắt đầu và kết thúc).

### 2.2. Thông số nâng cao (Advanced Parameters)
- **Slippage Tolerance**: Thanh trượt cho phép điều chỉnh mức độ mô phỏng trượt giá trong khoảng từ 0.1% - 5%.
- **Compound Yield**: Nút gạt tự động tái đầu tư lợi nhuận sinh ra (bật/tắt).
- **XCM Fees Modeling**: Nút gạt ước tính mô phỏng chi phí thực tế cho việc chuyển cross-chain XCM (bật/tắt).
- **Nút hành động (Actions)**: 
  - Nút **"Run Simulation"** để gửi cấu hình đi chạy tính toán giả lập.
  - Nút **"Try Examples"** để điền sẵn các cấu hình mẫu (mock configs).

### 2.3. Bảng điều khiển kết quả mô phỏng (Simulation Results Dashboard)
- **Thống kê tổng quan**: 
  - **Final Value**: Giá trị tài sản cuối cùng & Lợi nhuận gộp bằng tiền.
  - **Total Return**: Tổng % tỷ suất lợi nhuận sau khi mô phỏng (Đi kèm với chỉ số Return % khi chỉ mua và HODL để user so sánh).
  - **Net APY**: Lãi suất trả về thực tế hằng năm sau khi trừ đi các chi phí giả định.
  - **IL Impact**: Mức độ suy giảm giá trị do Tổn thất tạm thời (Impermanent Loss) do biến động lịch sử.

- **Biểu đồ danh mục (Portfolio Performance Chart)**: 
  - Biểu đồ line chart thể hiện track-record lịch sử của số vốn theo thời gian.
  - Có thể Toggle/Switch Mode giữa **Value ($)** để xem thay đổi về tiền và **Yield (%)** để xem sự tăng trưởng về %.
  - Có line marker so sánh giữa đường cong "Simulation" (chạy giả lập Farming) và "HODL" (chỉ nắm giữ coin).

- **Phân tích thành phần chi tiết (Component Breakdown Table)**: 
  Bảng kê khai phân rã nguồn gốc chi tiết sinh ra cái khối lợi nhuận cuối cùng:
  - **Trading Fees Earned**: Phí giao dịch được chia sẻ từ protocol.
  - **Liquidity Mining Rewards**: Token trả thưởng farm từ giao thức.
  - **Impermanent Loss**: Hao hụt chênh lệch giá bị ngậm so với việc không cung cấp thanh khoản.
  - **XCM Gas Overhead**: Ước lượng phí gas bị mất khi điều hướng token qua cầu XCM.

---

## 3. Các APIs cần thiết để hoạt động (Required APIs)

Bởi vì mã nguồn hiện tại đang giữ State ở Local và dùng dữ liệu hardcode tĩnh, để page này ghép nối thực tế đầy đủ tính năng, Backend team cần cung cấp **3 nhóm API chính** sau:

### API 1: Khởi tạo dữ liệu Dropdowns (Metadata Query)
- **Method & Endpoint**: `GET /api/v1/simulator/metadata`
- **Mô tả**: API dùng để fetch lấy các danh sách Parachains, Protocols và Token list hiện tại đang được Backend/Smart Contract support để đổ vào các Form Select inputs.
- **Response Structure (Mock)**:
  ```json
  {
    "parachains": ["Acala Network", "Moonbeam", "Parallel Finance", "Astar Network"],
    "protocols": ["Liquidity Provision (DEX)", "Liquid Staking", "Lending & Borrowing"],
    "tokens": [
      { "symbol": "DOT", "color": "polkadot-gradient" },
      { "symbol": "vDOT", "color": "bg-pink-500" },
      { "symbol": "USDC", "color": "bg-blue-500" }
    ]
  }
  ```

### API 2: Chạy Mô phỏng Backtest (Run Simulation) - CORE API
- **Method & Endpoint**: `POST /api/v1/simulator/run`
- **Mô tả**: Khi user bấm *Run Simulation*, Frontend sẽ gom toàn bộ các inputs và POST lên Backend. Backend từ đó sẽ query cơ sở dữ liệu về lịch sử giá, pool states, APY để tính toán ra performance chart cuối cùng.
- **Request Body**:
  ```json
  {
    "parachain": "Acala Network",
    "protocol": "Liquidity Provision (DEX)",
    "tokenA": "DOT",
    "tokenB": "vDOT",
    "initialAmountUsd": 10000,
    "timeRange": {
      "type": "custom", // Enum: 90_days, 180_days, 1_year, custom
      "from": "2023-01-01T00:00:00Z",
      "to": "2023-03-31T00:00:00Z"
    },
    "advancedParams": {
      "slippageTolerancePercent": 0.5,
      "compoundYield": true,
      "xcmFeesModeling": true
    }
  }
  ```
- **Response Structure (Dữ liệu trả về cho Chart và Table)**:
  ```json
  {
    "summary": {
      "finalValueUsd": 14821,
      "absoluteProfitUsd": 4821,
      "totalReturnPercent": 48.2,
      "hodlReturnPercent": 12.4,
      "netApyPercent": 15.4,
      "ilImpactPercent": -2.1
    },
    "chartData": {
      "timestamps": ["2023-01-01", "2023-01-02", "..."],
      "simulationDailyValueUsd": [10000, 10100, "..."],
      "hodlDailyValueUsd": [10000, 9950, "..."],
      "simulationDailyYieldPercent": [0, 0.5, "..."],
      "hodlDailyYieldPercent": [0, -0.2, "..."]
    },
    "componentBreakdown": [
      {
        "name": "Trading Fees Earned",
        "absoluteGainUsd": 1240.22,
        "efficiencyPercent": 85,
        "status": "Optimal"
      },
      {
        "name": "Liquidity Mining Rewards",
        "absoluteGainUsd": 3850.15,
        "efficiencyPercent": 92,
        "status": "Harvested"
      },
      {
        "name": "Impermanent Loss",
        "absoluteGainUsd": -210.45,
        "efficiencyPercent": 12,
        "status": "Managed"
      },
      {
        "name": "XCM Gas Overhead",
        "absoluteGainUsd": -58.42,
        "efficiencyPercent": 5,
        "status": "Deducted"
      }
    ]
  }
  ```

### API 3: Ước tính linh động thông số Real-time (Optional)
- **Method & Endpoint**: `GET /api/v1/pools/estimate-slippage` hoặc `GET /api/v1/xcm/fees`
- **Mô tả**: Khi người dùng thao tác thay đổi số tiền (Initial Amount), nếu muốn hệ thống có tính chân thực cao, Frontend có thể gọi API này để hệ thống gợi ý trượt giá (Slippage) theo Depth Liquidity hiện tại của bể thanh khoản. (Ví dụ Trade càng lớn, thanh trượt slippage nên báo % càng cao). Trang đang để mặc định 0.5% nhưng về tương lai nên kết nối logic này với backend. 
