package in.ganeshmane.billingsoftware.controller;

import in.ganeshmane.billingsoftware.io.OrderRequest;
import in.ganeshmane.billingsoftware.io.OrderResponse;
import in.ganeshmane.billingsoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest){
        System.out.println(orderRequest);
        return orderService.createOrder(orderRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public List<OrderResponse> getAllOrders(){
        return orderService.allOrders();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId){
         orderService.deleteOrder(orderId);
    }

}
