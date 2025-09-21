package BackEnd.service;

import BackEnd.DTO.FreelancerGigsDTO;
import BackEnd.DTO.OrdersDTO;

import java.util.List;

public interface OrderService {
    OrdersDTO createOrder(OrdersDTO ordersDto);
    OrdersDTO getOrderById(Long orderId);
    List<OrdersDTO> getAllOrders();
    List<OrdersDTO> getAllOrdersByFreelancer(String orderFreelancerUsername);
    void deleteOrder(Long orderId);
    void updateOrderStatus(Long orderId, String newStatus);
}
