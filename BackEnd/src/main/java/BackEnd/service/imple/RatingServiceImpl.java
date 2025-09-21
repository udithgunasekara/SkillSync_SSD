package BackEnd.service.imple;

import BackEnd.DTO.RatingDto;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.RatingMapper;
import BackEnd.entity.Rating;
import BackEnd.repository.RatingRepository;
import BackEnd.service.RatingService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RatingServiceImpl implements RatingService {

    private RatingRepository ratingRepository;

    @Override
    public RatingDto createRating(RatingDto ratingDto) {
        Rating rating = RatingMapper.mapToRating(ratingDto);
        Rating savedRating = ratingRepository.save(rating);
        return RatingMapper.mapToRatingDto(savedRating);
    }

    @Override
    public RatingDto getRatingById(Long ratingId) {

        //Validation
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() ->
                        new ResourceNotFound("Rating is not exists with given id : "+ratingId));
        return RatingMapper.mapToRatingDto(rating);
    }

    @Override
    public List<RatingDto> getAllRatings() {
        List<Rating> ratings = ratingRepository.findAll();
        return ratings.stream().map((rating) -> RatingMapper.mapToRatingDto(rating))
                .collect(Collectors.toList());
    }

    @Override
    public List<RatingDto> getAllRatingsByuserID(String userID) {
        List<Rating> ratings = ratingRepository.findByUserID(userID);
        return ratings.stream().map((rating) -> RatingMapper.mapToRatingDto(rating))
                .collect(Collectors.toList());
    }

    @Override
    public List<RatingDto> searchReviewsByKeyword(String keyword) {
        List<Rating> ratings = ratingRepository.findReviewsByKeyword(keyword);
        return ratings.stream().map(RatingMapper::mapToRatingDto).collect(Collectors.toList());
    }

    @Override
    public RatingDto updateRating(Long ratingId, RatingDto updateRating) {

        //Validation
        Rating rating = ratingRepository.findById(ratingId).orElseThrow(
                () -> new ResourceNotFound("Rating is not exists with given id : "+ratingId)
        );

        rating.setRating(updateRating.getRating());
        rating.setReview(updateRating.getReview());
        rating.setUserID(updateRating.getUserID());
        rating.setProjectID(updateRating.getProjectID());

        Rating updateRatingObj = ratingRepository.save(rating);

        return RatingMapper.mapToRatingDto(updateRatingObj);
    }

    @Override
    public void deleteRating(Long ratingId) {

        //Validation
        Rating rating = ratingRepository.findById(ratingId).orElseThrow(
                () -> new ResourceNotFound("Rating is not exists with given id : "+ratingId)
        );

        ratingRepository.deleteById(ratingId);

    }

   /* @Override
    public String generatePDFReport(String userID) {
        // Step 1: Fetch data for the specified userID
        List<RatingDto> ratings = getAllRatingsByuserID(userID);

        // Define the output file path
        String outputFilePath = "user_ratings_report_" + userID + ".pdf";

        // Step 2: Create a new PDF document
        try (Document doc = new Document(PageSize.A4, 10, 10, 10, 10);
             FileOutputStream stream = new FileOutputStream(outputFilePath)) {

            // Initialize the PDF writer
            PdfWriter.getInstance(doc, stream);

            // Open the document
            doc.open();

            // Step 3: Add content to the PDF
            Font titleFont = new Font(Font.FontFamily.TIMES_ROMAN, 20, Font.BOLD);
            doc.add(new Paragraph("User Ratings Report", titleFont));
            doc.add(new Paragraph("User ID: " + userID));
            doc.add(new Paragraph("\n"));

            Font contentFont = new Font(Font.FontFamily.TIMES_ROMAN, 12);
            for (RatingDto rating : ratings) {
                doc.add(new Paragraph("Rating ID: " + rating.getId(), contentFont));
                doc.add(new Paragraph("Project ID: " + rating.getProjectID(), contentFont));
                doc.add(new Paragraph("Rating: " + rating.getRating(), contentFont));
                doc.add(new Paragraph("Review: " + rating.getReview(), contentFont));
                doc.add(new Paragraph("Star Rating: " + rating.getStarRating(), contentFont));
                doc.add(new Paragraph("\n"));
            }

            // Step 4: Close the document
            doc.close();

            // Return the file path of the generated PDF
            return outputFilePath;

        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }*/

}

