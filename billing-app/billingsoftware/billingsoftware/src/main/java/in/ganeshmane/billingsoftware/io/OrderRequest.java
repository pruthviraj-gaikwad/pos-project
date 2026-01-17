package in.ganeshmane.billingsoftware.io;

import in.ganeshmane.billingsoftware.entity.OrderItemEntity;
import jakarta.persistence.Column;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private String customerName;
    private String phoneNumber;
    private Double subTotal;
    private Double tax;
    private Double grandTotal;
    private List<OrderItemRequest> cartItems;
    private PaymentMethod paymentMethod;

    @Data
    @AllArgsConstructor
    @Builder
    @NoArgsConstructor
    public static class OrderItemRequest{
        private String itemId;
        private String name;
        private Double price;
        private Integer quantity;
    }


}
