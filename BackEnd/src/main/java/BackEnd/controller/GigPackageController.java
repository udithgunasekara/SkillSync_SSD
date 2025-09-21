package BackEnd.controller;

import BackEnd.DTO.GigPackageDTO;
import BackEnd.service.GigPackageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/freelancer-gigs/{gigId}/gig-packages")
public class GigPackageController {

    private GigPackageService gigPackageService;

    //Post request to add a new package
    @PostMapping
    public ResponseEntity<GigPackageDTO> createPackage(@PathVariable Long gigId, @RequestBody GigPackageDTO servicePackageDTO) {
        GigPackageDTO savedPackage = gigPackageService.createPackage(gigId, servicePackageDTO);
        return new ResponseEntity<>(savedPackage, HttpStatus.CREATED);
    }

    //Get request to get all packages
    @GetMapping
    public ResponseEntity<List<GigPackageDTO>> getAllPackages(@PathVariable Long gigId) {
        List<GigPackageDTO> servicePackageDTO = gigPackageService.getAllPackages(gigId);
        return ResponseEntity.ok(servicePackageDTO);
    }

    //Get request to get a package by id
    @GetMapping("/{packageId}")
    public ResponseEntity<GigPackageDTO> getPackageById(@PathVariable Long packageId) {
        GigPackageDTO servicePackageDTO = gigPackageService.getPackageById(packageId);
        return new ResponseEntity<>(servicePackageDTO, HttpStatus.OK);
    }

    //Put request to update a package
    @PutMapping("/{packageId}")
    public ResponseEntity<GigPackageDTO> updatePackage(@PathVariable Long packageId, @RequestBody GigPackageDTO updatedPackage) {
        GigPackageDTO servicePackageDTO = gigPackageService.updatePackage(packageId, updatedPackage);
        return ResponseEntity.ok(updatedPackage);
    }

    //Delete request to delete a package
    @DeleteMapping("/del")
    public ResponseEntity<?> deletePackagesByGigId(@PathVariable Long gigId) {
        gigPackageService.deletePackagesByGigId(gigId);
        return ResponseEntity.ok("Packages deleted successfully for gig with ID: " + gigId);
    }

    //Get request to find the minimum price of a package
    @GetMapping("/min-price")
    public ResponseEntity<String> findMinPriceByGigId(@PathVariable Long gigId) {
        String minPrice = String.valueOf(gigPackageService.findMinPriceByGigId(gigId));
        return new ResponseEntity<>(minPrice, HttpStatus.OK);
    }

    //Get request to find the minimum time of a package
    @GetMapping("/min-time")
    public ResponseEntity<String> findMinTimeByGigId(@PathVariable Long gigId) {
        String minTime = String.valueOf(gigPackageService.findMinTimeByGigId(gigId));
        return new ResponseEntity<>(minTime, HttpStatus.OK);
    }
}