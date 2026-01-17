package in.ganeshmane.billingsoftware.controller;

import in.ganeshmane.billingsoftware.io.DashboardResponse;
import in.ganeshmane.billingsoftware.io.OrderResponse;
import in.ganeshmane.billingsoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final OrderService orderService;
    @GetMapping
    public DashboardResponse getDashboardData(){
        LocalDate today = LocalDate.now();
        Double todaysSale= orderService.sumSalesByDate(today);
        Long todayOrderCount = orderService.countByOrderDate(today);
        List<OrderResponse> recentOrders = orderService.findRecentOrders();
        return new DashboardResponse(
                todaysSale != null ? todaysSale : 0.0,
                todayOrderCount != null ? todayOrderCount : 0,
                recentOrders

        );
    }
}
