package BackEnd.controller;


import BackEnd.DTO.OptionDTO;
import BackEnd.service.OptionsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/options")
public class OptionsController {
    private OptionsService optionsService;

    //Build create answers REST API
    @PostMapping("{id}")
    public ResponseEntity<OptionDTO> createOption(@PathVariable("id") Long questionId, @RequestBody OptionDTO optionDTO){
        OptionDTO savedOptionDTO = optionsService.createOption(questionId, optionDTO);
        return new ResponseEntity<>(savedOptionDTO, HttpStatus.CREATED);
    }

    //Build get answers REST API
    @GetMapping("{id}")
    public ResponseEntity<OptionDTO> getOptionById(@PathVariable("id") Long optionId){
        OptionDTO optionDTO = optionsService.getOptionById(optionId);
        return ResponseEntity.ok(optionDTO);
    }

    //Build update answers REST API
    @PutMapping("{id}")
    public ResponseEntity<OptionDTO> updateOptionById(@PathVariable("id") Long optionId, @RequestBody OptionDTO optionDTO){
        OptionDTO savedOptionDTO = optionsService.updateOptionById(optionId, optionDTO);
        return ResponseEntity.ok(savedOptionDTO);
    }

    //Build Delete REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteOptionById(@PathVariable("id") Long optionId){
        optionsService.deleteOptionById(optionId);
        return ResponseEntity.ok("Answer Deleted Successfully!");
    }
}