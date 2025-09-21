package BackEnd.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;

public class ImageEntityDTO {
    private String username;
    private String imageName;
    private byte[] imageData;

    public ImageEntityDTO(String username, String imageName, byte[] imageData) {
        this.username = username;
        this.imageName = imageName;
        this.imageData = imageData;
    }

    public ImageEntityDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

}