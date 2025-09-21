package BackEnd.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "images")
public class ImageEntity {
    @Id
    private String username;
    private String imageName;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;

    public ImageEntity() {
    }

    public ImageEntity(String username, String imageName, byte[] imageData) {
        this.username = username;
        this.imageName = imageName;
        this.imageData = imageData;
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
