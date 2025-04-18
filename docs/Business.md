## Categories

-   Trong nhà

    -   Chuông gió
    -   Đèn
    -   Firgure
    -   Kệ gỗ
    -   Tinh dầu
    -   Dán tường
    -   Dán sàn
    -   Loa
    -   Tranh treo tường

-   Phụ kiện

    -   Đồng hồ
    -   Tai nghe
    -   Kính

-   Boss

    -   Thức ăn
    -   Bàn cào
    -   Bàn chải
    -   Cát

-   Thức uống
    -   Cà phê rang xay
    -   Trà
    -   Ly

### Mỗi product tham chiếu tới duy nhất 1 category, mục đích là khi thêm category, không cần phải duyệt lại products cũ để thêm vào category mới, đồng thời cũng giúp việc tìm kiếm dựa trên category trở nên dễ dàng hơn.

### Categories được chia thành nhiều lớp. Product chỉ được tham chiếu tới category lá.

### As an admin.

-   Xem thông tin bán hàng
-   View User
-   Crud Categories
-   Crud Product
-   View Orders
-   View rating and message
-   Thêm sản phẩm: hiện form thêm sản phẩm gồm:

    -   tên sản phẩm, thương hiệu, slug có giá trị mặc định <ten-san-pham>, mô tả.
    -   selection box để chọn category
    -   chọn primary attribute
    -   chọn attribute khác
    -   image mặc định
    -   Hoàn thành

-   Feature: Add Product Variant
-   Description: Enable users to add a new product variant with an intuitive and flexible UI/UX.
-   Functional Requirements:

    -   Product Selection:
        -   Suggest recently added products (tracked via cookies)
        -   Allow search by product name or slug
    -   Attribute Management:
        -   Display existing attributes and their values
        -   Allow users to:
            -   Add new attributes or values
            -   Edit existing attributes or values
            -   Delete attributes or values
    -   User Experience:
        -   Minimize user input where possible through suggestions and auto-complete

-   Xóa category:

    -   Chỉ có thể xóa mềm khi không có product nào trực thuộc 'active'. hoặc không có subcategory nào. xóa hẳn sau 30 days
    -   Có thể recycle

-   Xóa sản phẩm:

    -   Cho vào thùng rác, xóa sau 30 ngày.
    -   Có thể recycle: Khi recycle, recycle luôn category nếu nó đang deleted

-   Thêm category:
    -   Name không trùng. Trùng thì thông báo check trong thùng rác
