package BackEnd;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@CrossOrigin
//@ComponentScan(basePackages = {"com.example", "BackEnd.service"})
public class BackEnd {

    public static void main(String[] args) {
        SpringApplication.run(BackEnd.class, args);
    }

    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
//    @GetMapping
//    public String helo(){
//        return "Hello backend";
//    }
    @PostMapping
    public String yoo(){
        return "Post mapping success";
    }

}
