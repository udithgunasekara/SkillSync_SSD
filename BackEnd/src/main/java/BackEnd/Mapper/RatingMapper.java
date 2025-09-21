package BackEnd.Mapper;

import BackEnd.DTO.RatingDto;
import BackEnd.entity.Rating;

public class RatingMapper {

    public static RatingDto mapToRatingDto(Rating rating) {
        return  new RatingDto(
                rating.getId(),
                rating.getUserID(),
                rating.getRating(),
                rating.getProjectID(),
                rating.getReview(),
                rating.getStarRating() // Include starRating
        );
    }

    public static Rating mapToRating(RatingDto ratingDto) {
        return new Rating(
                ratingDto.getId(),
                ratingDto.getUserID(),
                ratingDto.getRating(),
                ratingDto.getProjectID(),
                ratingDto.getReview(),
                ratingDto.getStarRating() // Include starRating
        );
    }

}

