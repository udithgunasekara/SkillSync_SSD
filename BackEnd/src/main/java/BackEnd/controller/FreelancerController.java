package BackEnd.controller;

import BackEnd.DTO.FreelancerDTO;
import BackEnd.DTO.LoginDTO;
import BackEnd.DTO.AuthResponse;
import BackEnd.Config.JwtUtil;
import BackEnd.service.FreelancerService;
import BackEnd.service.LoginAttemptService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping(path = "/Freelancer")
public class FreelancerController {


    private FreelancerService freelancerService;
    private JwtUtil jwtUtil;
    private LoginAttemptService loginAttemptService;


    @PostMapping("/Registration")
    public ResponseEntity<FreelancerDTO> createFreelancer(@RequestBody FreelancerDTO freelancerDTO){
        FreelancerDTO saveFreelancer = freelancerService.createFreelancer(freelancerDTO);
        return new ResponseEntity<>(saveFreelancer, HttpStatus.CREATED);
    }


    //Getting all freelancers who are in "Inprogress" state
    //url: http://localhost:8080/Freelancer/AllInProgress
    @GetMapping("AllInProgress")
    public ResponseEntity<List<FreelancerDTO>> getAllInprogressFreelancers(){
        List<FreelancerDTO> freelancer = freelancerService.getAllInprogressFreelancers();
        return ResponseEntity.ok(freelancer);

    }
    //Getting freelancer data by give username
    @GetMapping("/{username}")
    public ResponseEntity<FreelancerDTO> getFreelancer(@PathVariable("username") String username){
        FreelancerDTO freelancer = freelancerService.getFreelancerByUsername(username);
        return ResponseEntity.ok(freelancer);
    }

    //Delete freelancer account by given username
    @DeleteMapping("/Delete/{username}")
    public ResponseEntity<?> deleteFreelancer(@PathVariable("username") String username){
        freelancerService.deleteFreelancerByUsername(username);
        //return delete susccess message

        return ResponseEntity.ok("Deleting All Freelance's DATA SuccessFul: (freelancerTable, user_credentialTable and insert bannedTable) " + username);
    }

    //Accept freelancer account after review their docs
    @PutMapping("/Accept")
    public ResponseEntity<String> acceptFreelancer(@RequestParam("username") String username){
        freelancerService.acceptFreelancer(username);
        return ResponseEntity.ok("Freelancer Account Accepted Successfully: " + username);
    }

    //freelancer login validation
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request, HttpServletResponse response) {
        String clientIp = loginAttemptService.getClientIpAddress(request);
        
        if (loginAttemptService.isBlocked(clientIp, loginDTO.getUsername())) {
            return ResponseEntity.status(429).body(new AuthResponse("Too many failed attempts. Please try again after 15 minutes.", null));
        }
        
        Long id = freelancerService.validateLogin(loginDTO);
        if (id != null) {
            loginAttemptService.resetAttempts(clientIp, loginDTO.getUsername());
            
            String token = jwtUtil.generateToken(loginDTO.getUsername(), "freelancer");
            
            Cookie authCookie = new Cookie("_auth", token);
            authCookie.setHttpOnly(true);
            authCookie.setPath("/");
            authCookie.setMaxAge(86400);
            response.addCookie(authCookie);
            
            return ResponseEntity.ok(new AuthResponse("Login successful", "freelancer"));
        }
        
        loginAttemptService.recordFailedAttempt(clientIp, loginDTO.getUsername());
        return ResponseEntity.status(401).body(new AuthResponse("Unauthorized", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromCookie(request);
        if (token != null) {
            jwtUtil.blacklistToken(token);
        }
        
        Cookie authCookie = new Cookie("_auth", "");
        authCookie.setMaxAge(0);
        authCookie.setPath("/");
        response.addCookie(authCookie);
        
        return ResponseEntity.ok("Logged out successfully");
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("_auth".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    //check the account status when freelancer login
    @GetMapping("/checkAccountStatus/{username}")
    public ResponseEntity<Boolean> checkAccountStatus(@PathVariable("username") String username){
        boolean status = freelancerService.checkAccountStatus(username);
        return ResponseEntity.ok(status);
    }

    //url: http://localhost:8080/Freelancer/Allaccepted
    @GetMapping("Allaccepted")
    public ResponseEntity<List<FreelancerDTO>> getAllAcceptedFreelancers(){
        List<FreelancerDTO> freelancer = freelancerService.getAllAcceptedFreelancers();
        return ResponseEntity.ok(freelancer);

    }



}
