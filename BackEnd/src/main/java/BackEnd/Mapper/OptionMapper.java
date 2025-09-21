package BackEnd.Mapper;

import BackEnd.DTO.OptionDTO;
import BackEnd.entity.Options;

public class OptionMapper {

    public static OptionDTO mapToOptionDTO(Options options){
        return new OptionDTO(
                options.getOptionId(),
                options.getOptionTxt(),
                options.getQuestionId()
        );
    }

    public static Options mapToOptions(OptionDTO optionDTO){
        return new Options(
                optionDTO.getOptionId(),
                optionDTO.getOptionTxt(),
                optionDTO.getQuestionId()
        );
    }
}
