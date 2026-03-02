# Tài liệu: Token Pair trong ParaYield Lab

## 1. Định nghĩa (Definition)
Trong hệ sinh thái **ParaYield Lab**, **Token Pair** (Cặp Token) là đơn vị cấu hình cơ bản nhất để thực hiện mô phỏng (backtesting) các chiến lược DeFi. Một Token Pair bao gồm hai tài sản kỹ thuật số được chọn để tương tác với nhau trong một giao thức cụ thể trên các Parachain của Polkadot.

- **Token A (Base/Primary Token)**: Thường là tài sản gốc hoặc tài sản nắm giữ chính (ví dụ: `DOT`).
- **Token B (Quote/Derivative Token)**: Thường là tài sản đối ứng trong bể thanh khoản (ví dụ: `USDC`, `USDT`) hoặc phiên bản Liquid Staking (ví dụ: `vDOT`, `LDOT`).

---

## 2. Thiết kế (Design)

### 2.1. Giao diện (UI/UX Design)
Giao diện chọn Token Pair được thiết kế tối giản nhưng chuyên nghiệp (Pro-Grade):
- **Visual Identity**: Mỗi Token đi kèm với màu sắc nhận diện riêng (ví dụ: `DOT` có gradient Polkadot hồng, `USDC` có màu xanh blue). Điều này giúp người dùng dễ dàng phân biệt các tài sản trong danh mục.
- **Interactive Selectors**: Bộ chọn kép (Double Selector) cho phép người dùng thay đổi linh hoạt từng thành phần của cặp.
- **Constraints Logic**: Hệ thống áp dụng các ràng buộc thông minh:
    - Ngăn chặn việc chọn 2 token giống hệt nhau cho hầu hết các chiến lược (tránh lỗi logic mô phỏng).
    - **Conditional Selection (vstaking)**: Đối với loại hình giao thức là `vstaking` (Liquid Staking), giao diện tự động tinh gọn từ bộ chọn kép thành **một bộ chọn duy nhất** (ví dụ: chỉ chọn `vDOT` hoặc `LDOT`), do đặc thù staking chỉ tập trung vào một tài sản phái sinh chính thay vì một cặp thanh khoản.

### 2.2. Cấu trúc dữ liệu (Data Structure)
Về mặt kỹ thuật, Token Pair được lưu trữ và truyền tải qua API dưới dạng các mã hiệu (Symbols):
```json
{
  "tokenA": { "symbol": "DOT", "color": "polkadot-gradient" },
  "tokenB": { "symbol": "vDOT", "color": "bg-pink-500" }
}
```
Khi thực hiện mô phỏng, các symbol này được ánh xạ (map) với dữ liệu lịch sử (historical price feed) và trạng thái bể thanh khoản (pool state) từ backend.

---

## 3. Ý nghĩa và Vai trò (Significance)

Token Pair đóng vai trò "xương sống" cho các thuật toán tính toán của Simulator:

### 3.1. Tính toán Impermanent Loss (IL)
Đối với chiến lược **Liquidity Provision (DEX)**, Token Pair là cơ sở để tính toán Tổn thất tạm thời. Backend sẽ theo dõi độ lệch giá giữa Token A và Token B trong khoảng thời gian backtest để xác định giá trị tài sản bị hao hụt so với việc chỉ nắm giữ (HODL).

### 3.2. Mô phỏng trượt giá (Slippage Modeling)
Mỗi cặp Token có độ sâu thanh khoản (Liquidity Depth) khác nhau. Việc chọn đúng Token Pair giúp Simulator ước tính mức trượt giá thực tế dựa trên khối lượng giao dịch (Initial Amount) mà người dùng nhập vào.

### 3.3. Xác định nguồn lợi nhuận (Yield Source)
Tùy vào cặp Token, nguồn lợi nhuận sẽ khác nhau:
- **Cặp Stablecoin (USDC/USDT)**: Lợi nhuận chủ yếu từ phí giao dịch (Trading Fees).
- **Cặp Staking (DOT/vDOT)**: Lợi nhuận từ phần thưởng staking (Staking Rewards) cộng với phí giao dịch nếu có cung cấp thanh khoản.

### 3.4. Tối ưu hóa phí XCM
Việc di chuyển các Token Pair qua các Parachain khác nhau (ví dụ: mang DOT từ Relay Chain sang Acala để đổi lấy LDOT) đòi hỏi việc mô phỏng phí XCM. Token Pair xác định rõ loại tài sản nào đang được di chuyển để tính toán phí gas chính xác.

---

## 4. Các cặp Token phổ biến (Common Examples)

| Token Pair | Chiến lược chính | Ý nghĩa |
|:---|:---|:---|
| **DOT / USDC** | Liquidity Provision | Tận dụng biến động giá DOT để kiếm phí giao dịch trên DEX. |
| **vDOT** (Single Selection) | Liquid Staking (vstaking) | Mô phỏng lợi suất tích lũy của riêng tài sản staking phái sinh. |
| **DOT / vDOT** | Yield Farming + LP | Tối ưu hóa lợi nhuận từ staking và cung cấp thanh khoản đồng thời. |
| **vDOT / USDC** | Yield Farming | Chiến lược nâng cao kết hợp tài sản phái sinh staking với stablecoin. |
| **ACA / DOT** | Governance Mining | Tham gia các chương trình incentive của hệ sinh thái Acala. |

---

## 5. Kết luận
**Token Pair** không chỉ là hai lựa chọn ngẫu nhiên, mà là sự xác định phạm vi rủi ro và lợi nhuận của người dùng. Thiết kế của ParaYield Lab tập trung vào việc làm cho khái niệm phức tạp này trở nên trực quan, giúp nhà đầu tư DeFi trên Polkadot có cái nhìn minh bạch nhất về chiến lược của mình.
