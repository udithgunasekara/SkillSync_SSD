package BackEnd.controller;

import BackEnd.DTO.OrdersDTO;
import BackEnd.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/orders")
public class OrdersController {

    private final OrderService orderService;

    // Build add order REST API
    @PostMapping
    public ResponseEntity<OrdersDTO> createOrder(@RequestBody OrdersDTO ordersDto) {
        OrdersDTO savedOrder = orderService.createOrder(ordersDto);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    // Build get order by id REST API
    @GetMapping("/{orderId}")
    public ResponseEntity<OrdersDTO> getOrderById(@PathVariable long orderId) {
        OrdersDTO ordersDto = orderService.getOrderById(orderId);
        return new ResponseEntity<>(ordersDto, HttpStatus.OK);
    }

    // Build get all orders REST API
    @GetMapping
    public ResponseEntity<List<OrdersDTO>> getAllOrders() {
        List<OrdersDTO> ordersDto = orderService.getAllOrders();
        return ResponseEntity.ok(ordersDto);
    }

    // Build get all orders by freelancer REST API
    @GetMapping("/freelancer/{orderFreelancerUsername}")
    public ResponseEntity<List<OrdersDTO>> getAllOrdersByFreelancer(@PathVariable String orderFreelancerUsername) {
        List<OrdersDTO> ordersDto = orderService.getAllOrdersByFreelancer(orderFreelancerUsername);
        return ResponseEntity.ok(ordersDto);
    }

    // Build delete order REST API
    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("Order deleted successfully!");
    }

    // Build update order status REST API
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable long orderId, @RequestParam String newStatus) {
        orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok("Order status updated successfully!");
    }
}
