## Categories

### Mỗi product tham chiếu tới duy nhất 1 category, mục đích là khi thêm category, không cần phải duyệt lại products cũ để thêm vào category mới, đồng thời cũng giúp việc tìm kiếm dựa trên category trở nên dễ dàng hơn.

### Categories được chia thành nhiều lớp. Product chỉ được tham chiếu tới category lá.

### As an admin.

-   View User
-   Crud Categories
-   Crud Product
-   View Orders
-   View rating and message
-   Thêm sản phẩm: hiện form thêm sản phẩm gồm:
    -   tên sản phẩm, thương hiệu, slug có giá trị mặc định <ten-san-pham>, mô tả.
    -   selection box để chọn category
    -   Chọn danh sách attribute
    -   Chọn attribute chính
    -   Chọn danh sách image
    -   Chọn image mặc định
    -   Submit
    -   Note: OrderPriority Start from 0. The smaller it is, the higher the priority.
-   Add Product Variant
    -   Product Selection:
        -   Suggest recently added products (tracked via cookies)
        -   Allow search by product name or slug
    -   Attribute Management:
        -   Display existing attributes and their values
        -   Allow users to:
            -   Add new attributes or values
            -   Edit existing attributes or values
            -   Delete attributes or values
-   Xóa sản phẩm: (xóa mềm)

    -   Cho vào thùng rác
    -   Có thể recycle: Khi recycle, recycle luôn category nếu nó đang deleted

-   Xóa category: (xóa mềm)
    -   Chỉ có thể xóa mềm khi không có product nào trực thuộc 'active'. hoặc không có subcategory nào.
    -   Có thể recycle
-   Thêm category:
    -   Name không trùng.
-   Sửa category:

    -   Name, Description

-   CRUD a Product: CRUD images or (basic infor and variant)

    -   CRD Images
    -   CRUD Others:

               -   Free to delete/add/update variant
               -   Create variant need price, SKU
               -   Remove attribtue value will mark all variant refer to it (in backend) as deleted. Re-add the same value will not re-activate the variant. Noway the variant can re-activate
               -   Remove attribute will execute delete all values and then delete attribute
