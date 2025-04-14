### Outbox pattern:

    - có thể retry on event handle failed
    - Đảm bảo data consistency
    - Cần persist outboxevententity và data entity cùng 1 transaction
    - Cần background worker để get và dispatch outbox event từ database
    - thích hợp với microservices, hoặc monolith cần độ tin cậy cao

### MediaT:

    - có thể retry nhưng có nhiều hạn chế
    - không đảm bảo data consistency
    - thích hợp với app monolith vì event được sử lý gần như tức thời, và không yêu cầu cao về độ tin cậy.
    - đỡ phức tạp, dễ triển khai.

--> Approach:
sử dụng mediaT để dispatch events. dư thời gian thì apply outbox.
