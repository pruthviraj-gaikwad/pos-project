package in.ganeshmane.billingsoftware.repository;


import in.ganeshmane.billingsoftware.entity.OrderEntity;
import org.hibernate.query.Order;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findByOrderId(String orderId);

    List<OrderEntity> findAllByOrderByCreatedAtDesc();

    /**
     * ✅ Corrected Method: Renamed to avoid conflict.
     * This method now correctly fetches all orders and their items in one query.
     * I've also changed 'o.orderItems' to 'o.items' as that's the likely field name in your OrderEntity.
     */
    @Query("SELECT o FROM OrderEntity o JOIN FETCH o.items")
    List<OrderEntity> findAllWithItems();

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE DATE(o.createdAt) =:date")
    Double sumSalesByDate(@Param("date")LocalDate date);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = :date")
    Long countByOrderDate(@Param("date") LocalDate date);

    @Query("SELECT o FROM OrderEntity o ORDER BY o.createdAt DESC")
    List<OrderEntity> findRecentOrders(PageRequest pageRequest);

}