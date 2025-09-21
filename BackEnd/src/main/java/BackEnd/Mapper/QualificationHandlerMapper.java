package BackEnd.Mapper;

import BackEnd.DTO.QualificationHandlerDTO;
import BackEnd.entity.SocialLinks;
import BackEnd.DTO.SocialLinksDTO;
import BackEnd.entity.QualificationHandler;

public class QualificationHandlerMapper {

//    @Autowired // Inject the repository
//    private UserTitleRepo userTitleRepository;

    public static QualificationHandler toMapQualificationHandler(QualificationHandlerDTO qualificationHandlerDTO) {
        QualificationHandler qualificationHandler = new QualificationHandler();
        qualificationHandler.setId(qualificationHandlerDTO.getId());
        qualificationHandler.setName(qualificationHandlerDTO.getName());
        qualificationHandler.setType(qualificationHandlerDTO.getType());
        qualificationHandler.setUserName(qualificationHandlerDTO.getUserName());
        qualificationHandler.setTitle(qualificationHandlerDTO.getTitle());
        qualificationHandler.setImage(qualificationHandlerDTO.getImage());
        qualificationHandler.setStartDate(qualificationHandlerDTO.getStartDate());
        qualificationHandler.setEndDate(qualificationHandlerDTO.getEndDate());
        return qualificationHandler;
    }

    public static QualificationHandlerDTO toMapQualificationHandlerDTO(QualificationHandler qualificationHandler) {
        QualificationHandlerDTO qualificationHandlerDTO = new QualificationHandlerDTO();
        qualificationHandlerDTO.setId(qualificationHandler.getId());
        qualificationHandlerDTO.setName(qualificationHandler.getName());
        qualificationHandlerDTO.setType(qualificationHandler.getType());
        qualificationHandlerDTO.setUserName(qualificationHandler.getUserName());
        qualificationHandlerDTO.setTitle(qualificationHandler.getTitle());
        qualificationHandlerDTO.setImage(qualificationHandler.getImage());
        qualificationHandlerDTO.setStartDate(qualificationHandler.getStartDate());
        qualificationHandlerDTO.setEndDate(qualificationHandler.getEndDate());
        return qualificationHandlerDTO;
    }



    //here the social links are mapped to the social links entity
    public static SocialLinks toMapSocialLinks(SocialLinksDTO socialLinksDTO){
        SocialLinks socialLinks = new SocialLinks();
        socialLinks.setUserName(socialLinksDTO.getUserName());
        socialLinks.setLinkedIn(socialLinksDTO.getLinkedIn());
        socialLinks.setBehance(socialLinksDTO.getBehance());
        socialLinks.setPortfolio(socialLinksDTO.getPortfolio());
        return socialLinks;
    }
    public static SocialLinksDTO toMapSocialLinksDTO(SocialLinks socialLinks){
        SocialLinksDTO socialLinksDTO = new SocialLinksDTO();

        socialLinksDTO.setUserName(socialLinks.getUserName());
        socialLinksDTO.setLinkedIn(socialLinks.getLinkedIn());
        socialLinksDTO.setBehance(socialLinks.getBehance());
        socialLinksDTO.setPortfolio(socialLinks.getPortfolio());
        return socialLinksDTO;
    }


}

