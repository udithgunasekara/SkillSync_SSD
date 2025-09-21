package BackEnd.controller;

import BackEnd.DTO.publicNoticesDTO;
import BackEnd.service.publicNoticeServices;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/notices")
public class publicNoticesController {
    public publicNoticeServices publicNoticesServices;

    //url : http://localhost:8082/notices/allnotices
    @GetMapping("allnotices")
    public ResponseEntity<List<publicNoticesDTO>> getAllNotices(){
        List<publicNoticesDTO> noticelist = publicNoticesServices.getAllNotices();
        return ResponseEntity.ok(noticelist);
    }

    //url: http://localhost:8082/notices/addnotice

    @PostMapping("/addnotice")
    public ResponseEntity<publicNoticesDTO> addNotice(@RequestBody publicNoticesDTO noticedto){
        System.out.println(noticedto.getMoreDetailsLink());
        publicNoticesDTO newNotice = publicNoticesServices.addNotice(noticedto);
        System.out.println(newNotice.getTitle());
        System.out.println(newNotice.getImagelink());
        return new ResponseEntity<>(newNotice, HttpStatus.CREATED);
    }

    //url: http://localhost:8082/notices/findnotice/1
    @GetMapping("/findnotice/{id}")
    public ResponseEntity<publicNoticesDTO> findNoticeByID(@PathVariable Long id){
        publicNoticesDTO notice = publicNoticesServices.findNoticeByID(id);
        return ResponseEntity.ok(notice);
    }


    //url: http://localhost:8082/notices/updatenotice/1
    @PutMapping("/updatenotice/{id}")
    public ResponseEntity<publicNoticesDTO> updateNoticeByID(@RequestBody publicNoticesDTO updateinfo, @PathVariable Long id){
        publicNoticesDTO updatednotice = publicNoticesServices.updateNoticeByID(updateinfo, id);
        return new ResponseEntity<>(updatednotice, HttpStatus.OK);
    }


    //url : http://localhost:8082/notices/deletenotice?id=23129
    @DeleteMapping("/deletenotice")
    public ResponseEntity<String> deleteNoticeById(@RequestParam Long id){
        String delete = publicNoticesServices.deleteNoticeById(id);
        return ResponseEntity.ok(delete);
    }

    //url : http://localhost:8082/notices/deleteallnotices
    @DeleteMapping("/deleteallnotices")
    public ResponseEntity<String> deleteAllNotices(){
        String deleteall = publicNoticesServices.deleteAllNotices();
        return ResponseEntity.ok(deleteall);
    }

    //url: http://localhost:8082/notices?audience=all
    @GetMapping("")
    public ResponseEntity<Page<publicNoticesDTO>> getNoticeByAudience(@RequestParam("audience") String audience, Pageable pageable){
        Page<publicNoticesDTO> notices = publicNoticesServices.getNoticeByAudience(audience, pageable);
        return ResponseEntity.ok(notices);
    }


    //url: http://localhost:8082/notices/search?title=notice&description=notice
    @GetMapping("/search")
    public ResponseEntity<Page<publicNoticesDTO>> searchNoticeByTitleorDescription(@RequestParam String title, @RequestParam String description, Pageable pageable){
        Page<publicNoticesDTO> notices = publicNoticesServices.searchNoticeByTitleOrDescription(title, description, pageable);
        return ResponseEntity.ok(notices);
    }
}
