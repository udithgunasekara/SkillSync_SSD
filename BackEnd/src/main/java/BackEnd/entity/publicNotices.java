package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Public Notices" , schema = "skillsync_db")
public class publicNotices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//    @Lob
//    @Column(columnDefinition = "LONGBLOB")
//    private byte[] images;
    private String title;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    private String audience;
    private String moreDetailsLink;
    @CreationTimestamp
    private LocalDateTime datecreated;
    @UpdateTimestamp
    private LocalDateTime lastupdated;
    private String imagelink;
}
