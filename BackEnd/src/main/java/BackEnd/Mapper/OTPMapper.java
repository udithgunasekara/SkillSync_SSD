package BackEnd.Mapper;

import BackEnd.DTO.OTPRequestDTO;
import BackEnd.entity.OTPRequest;

public class OTPMapper {

    public static OTPRequest toEntity(OTPRequestDTO dto) {
        OTPRequest user = new OTPRequest();
        user.setEmail(dto.getEmail());
        user.setOtp(dto.getOtp());
        return user;
    }

    public static OTPRequestDTO toDto(OTPRequest user) {
        OTPRequestDTO dto = new OTPRequestDTO();
        dto.setEmail(user.getEmail());
        dto.setOtp(user.getOtp());
        return dto;
    }
}
