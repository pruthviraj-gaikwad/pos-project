package in.ganeshmane.billingsoftware.entity;

import in.ganeshmane.billingsoftware.io.PaymentDetails;
import in.ganeshmane.billingsoftware.io.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Entity
@Data
@Table(name = "tbl_orders")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderId;
    private String customerName;
    private String phoneNumber;
    private Double subtotal;
    private Double tax;
    private Double grandTotal;
    private LocalDateTime createdAt;
    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItemEntity> items = new ArrayList<>();
    @Embedded
    private PaymentDetails paymentDetails;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    @PrePersist
    protected  void onCreate(){
        this.orderId = "ORD"+ UUID.randomUUID().toString().substring(0,8).toUpperCase();
        this.createdAt = LocalDateTime.now();
    }
}
