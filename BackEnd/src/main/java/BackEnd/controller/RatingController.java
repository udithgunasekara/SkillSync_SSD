package BackEnd.controller;

import BackEnd.DTO.RatingDto;
import BackEnd.service.RatingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private RatingService ratingService;

    //Build Add Rating REST API
    @PostMapping
    public ResponseEntity<RatingDto> createRating(@RequestBody RatingDto ratingDto) {
        RatingDto savedRating = ratingService.createRating(ratingDto);
        return new ResponseEntity<>(savedRating, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userID}")
   public ResponseEntity<List<RatingDto>> getAllRatingsByUserID(@PathVariable("userID") String userID) {
        List<RatingDto> ratings = ratingService.getAllRatingsByuserID(userID);
        return ResponseEntity.ok(ratings);
   }

    //Build Get Rating REST API
    @GetMapping("{id}")
    public ResponseEntity<RatingDto> getRatingById(@PathVariable("id") Long ratingId) {
        RatingDto ratingDto = ratingService.getRatingById(ratingId);
        return ResponseEntity.ok(ratingDto);
    }

    //Build Get All Ratings REST API
    @GetMapping
    public ResponseEntity<List<RatingDto>> getAllRatings() {
        List<RatingDto> ratings = ratingService.getAllRatings();
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RatingDto>> searchReviews(@RequestParam("keyword") String keyword) {
        List<RatingDto> ratings = ratingService.searchReviewsByKeyword(keyword);
        return ResponseEntity.ok(ratings);
    }

    //Build Update Rating REST API
    @PutMapping("{id}")
    public ResponseEntity<RatingDto> updateRating(@PathVariable("id") Long ratingId,
                                                  @RequestBody RatingDto updateRating) {
        RatingDto ratingDto = ratingService.updateRating(ratingId, updateRating);
        return ResponseEntity.ok(ratingDto);
    }

    //Build Delete RatingREST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteRating(@PathVariable("id") Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.ok("Rating deleted successfully!.");
    }

    /*@GetMapping("/report/{userID}")
    public ResponseEntity<String> generateUserReport(@PathVariable("userID") String userID) {
        try {
            String reportFilePath = ratingService.generatePDFReport(userID);
            return ResponseEntity.ok(reportFilePath);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate report");
        }
    }*/


}

