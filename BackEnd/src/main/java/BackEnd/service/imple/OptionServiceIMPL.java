package BackEnd.service.imple;


import BackEnd.DTO.OptionDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.OptionMapper;
import BackEnd.entity.Options;
import BackEnd.repository.OptionsRepository;
import BackEnd.service.OptionsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class OptionServiceIMPL implements OptionsService {

    private OptionsRepository optionsRepository;

    @Override
    public OptionDTO createOption(Long questionId, OptionDTO optionDTO) {
        Options options = OptionMapper.mapToOptions(optionDTO);
        options.setQuestionId(questionId);
        Options savedOptions = optionsRepository.save(options);
        return OptionMapper.mapToOptionDTO(savedOptions);
    }

    @Override
    public OptionDTO getOptionById(Long optionId) {
        Options options = optionsRepository.findById(optionId).orElseThrow(
                () -> new ResourceNotFound("Answer is not exists with given Id : " + optionId)
        );
        return OptionMapper.mapToOptionDTO(options);
    }

    @Override
    public OptionDTO updateOptionById(Long optionId, OptionDTO optionDTO) {
        Options options = optionsRepository.findById(optionId).orElseThrow(
                () -> new ResourceNotFound("Answer is not exists with given Id : " + optionId)
        );

        options.setOptionTxt(optionDTO.getOptionTxt());

        Options updatedOptions = optionsRepository.save(options);

        return OptionMapper.mapToOptionDTO(updatedOptions);
    }

    @Override
    public void deleteOptionById(Long optionId) {
        Options options = optionsRepository.findById(optionId).orElseThrow(
                () -> new ResourceNotFound("Answer is not exists with given Id : " + optionId)
        );
        optionsRepository.deleteById(optionId);
    }
}
