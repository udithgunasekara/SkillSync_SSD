package BackEnd.Mapper;

import BackEnd.DTO.GigPackageDTO;
import BackEnd.entity.GigPackages;

public class GigPackageMapper {
    public static GigPackageDTO mapToPackageDto(GigPackages aPackage){
        if (aPackage == null || aPackage.getGigId() == null) {
            return null;
        }

        return new GigPackageDTO(
                aPackage.getPackageId(),
                aPackage.getPackageName(),
                aPackage.getPackageDescription(),
                aPackage.getPackagePrice(),
                aPackage.getPackageDeliveryTime(),
                aPackage.getGigId().getGigId()
        );
    }

    public static GigPackages mapToPackage(GigPackageDTO servicePackageDto) {
        GigPackages aPackage = new GigPackages();
        aPackage.setPackageId(servicePackageDto.getPackageId());
        aPackage.setPackageName(servicePackageDto.getPackageName());
        aPackage.setPackageDescription(servicePackageDto.getPackageDescription());
        aPackage.setPackagePrice(servicePackageDto.getPackagePrice());
        aPackage.setPackageDeliveryTime(servicePackageDto.getPackageDeliveryTime());
        return aPackage;
    }
}
