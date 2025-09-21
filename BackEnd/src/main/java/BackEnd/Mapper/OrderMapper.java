package BackEnd.Mapper;

import BackEnd.DTO.OrdersDTO;
import BackEnd.entity.Orders;

public class OrderMapper {
    public static OrdersDTO mapToOrdersDto(Orders orders){
        return new OrdersDTO(
                orders.getOrderId(),
                orders.getOrderDateTime(),
                orders.getPackageName(),
                orders.getOrderStatus(),
                orders.getCusRemarks(),
                orders.getCusName(),
                orders.getOrderGigId(),
                orders.getOrderFreelancerUsername()
        );
    }
    public static Orders mapToOrders(OrdersDTO ordersDto){
        Orders orders = new Orders();
        orders.setOrderId(ordersDto.getOrderId());
        orders.setOrderDateTime(ordersDto.getOrderDateTime());
        orders.setPackageName(ordersDto.getPackageName());
        orders.setOrderStatus(ordersDto.getOrderStatus());
        orders.setCusName(ordersDto.getCusName());
        orders.setCusRemarks(ordersDto.getCusRemarks());
        orders.setOrderGigId(ordersDto.getOrderGigId());
        orders.setOrderFreelancerUsername(ordersDto.getOrderFreelancerUsername());
        return orders;
    }
}
