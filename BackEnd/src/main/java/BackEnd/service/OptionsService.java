package BackEnd.service;

import BackEnd.DTO.OptionDTO;

public interface OptionsService {
    OptionDTO createOption(Long questionId, OptionDTO optionDTO);

    OptionDTO getOptionById(Long optionId);

    OptionDTO updateOptionById(Long optionId, OptionDTO optionDTO);

    void deleteOptionById(Long optionId);
}