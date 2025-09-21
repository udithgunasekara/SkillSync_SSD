import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

// Define interfaces for gig details and package
interface GigDetails {
  id: number;
  gigTitle: string;
  gigDescription: string;
}

interface Package {
  packageId: number;
  packageName: string;
  packageDescription: string;
  packagePrice: string;
  packageDeliveryTime: string;
}

const EditGig: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  // State for gig details and packages
  const [gigDetails, setGigDetails] = useState<GigDetails | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  // State for error messages
  const [gigTitleError, setGigTitleError] = useState<string>('');
  const [gigDescriptionError, setGigDescriptionError] = useState<string>('');
  const [packageError, setPackageError] = useState<string>('');

  useEffect(() => {
    // Fetch gig details
    const fetchGigDetails = async () => {
      try {
        const response = await axios.get<GigDetails>(`http://localhost:8082/freelancer-gigs/${id}`);
        setGigDetails(response.data);
      } catch (error) {
        console.error('Error fetching gig details:', error);
      }
    };

    // Fetch gig packages
    const fetchGigPackages = async () => {
      try {
        const response = await axios.get<Package[]>(`http://localhost:8082/freelancer-gigs/${id}/gig-packages`);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching gig packages:', error);
      }
    };

    fetchGigDetails();
    fetchGigPackages();
  }, [id]);

  // Handle changes to gig details
  const handleGigDetailsChange = (field: keyof GigDetails, value: string) => {
    if (!gigDetails) return;
    setGigDetails(prevState => ({
      ...prevState!,
      [field]: value,
    }));
  };

  // Handle changes to package
  const handlePackageChange = (index: number, field: keyof Package, value: string) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = { ...updatedPackages[index], [field]: value };
    setPackages(updatedPackages);
  };

  // Save changes to gig details and packages
  const handleSave = async () => {
    try {
      // Validate gig details and packages
      if (!validateGigDetails() || !validatePackages()) return;

      // Show confirmation message
      const confirmed = window.confirm('Are you sure you want to apply the changes?');
      if (!confirmed) return;

      // Update gig details
      await axios.put(`http://localhost:8082/freelancer-gigs/${id}`, gigDetails);

      // Update each package individually
      await Promise.all(packages.map(async (pkg) => {
        await axios.put(`http://localhost:8082/freelancer-gigs/${id}/gig-packages/${pkg.packageId}`, pkg);
      }));

      // Navigate back to the dashboard after saving changes
      history.push('/FreelancerDashboard');
    } catch (error) {
      console.error('Error saving gig data:', error);
    }
  };

  // Discard changes and navigate back
  const handleDiscardChanges = () => {
    history.push('/FreelancerDashboard');
  };

  // Validate gig details
  const validateGigDetails = () => {
    let isValid = true;
    if (!gigDetails) return false;

    if (!/^[a-zA-Z\s]+$/.test(gigDetails.gigTitle) || gigDetails.gigTitle.trim() === '') {
      setGigTitleError('Gig title must contain only alphabetical letters and cannot be empty.');
      isValid = false;
    } else {
      setGigTitleError('');
    }

    // No validation needed for gig description

    return isValid;
  };

  // Validate package
  const validatePackage = (pkg: Package, index: number) => {
    let error = '';

    if (pkg.packageDescription.trim().length > 200) {
      error += 'Package description cannot exceed 200 characters. ';
    }

    if (isNaN(parseFloat(pkg.packagePrice)) || parseFloat(pkg.packagePrice) <= 0) {
      error += 'Package price must be a positive number and cannot be zero. ';
    }

    if (isNaN(parseFloat(pkg.packageDeliveryTime)) || parseFloat(pkg.packageDeliveryTime) < 1) {
      error += 'Package delivery time must be a positive number greater than or equal to 1. ';
    }

    return error;
  };

  // Validate all packages
  const validatePackages = () => {
    let isValid = true;
    let errors = '';

    packages.forEach((pkg, index) => {
      const error = validatePackage(pkg, index);
      if (error) {
        isValid = false;
        errors += `Package ${index + 1}: ${error} `;
      }
    });

    setPackageError(errors);
    return isValid;
  };

  // Render the form for editing gig details and packages
  return (
    <div className="container mt-5" id="containerGigCreate">
      {/* Gig details form */}
      {gigDetails && (
        <div className="mb-4">
          <h1>Edit Gig</h1>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={gigDetails.gigTitle}
              onChange={(e) => handleGigDetailsChange('gigTitle', e.target.value)}
              maxLength={50}
            />
            <div className="text-danger">{gigTitleError}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              className="form-control"
              id="description"
              value={gigDetails.gigDescription}
              onChange={(e) => handleGigDetailsChange('gigDescription', e.target.value)}
              rows={7} 
            />
            {/* No error message for gig description */}
          </div>
        </div>
      )}

      {/* Package details form */}
      {packages.map((pkg, index) => (
        <div key={pkg.packageId} className="mb-4">
          <h3>Package {index + 1}</h3>
          <div className="mb-3">
            <label className="form-label">Package Name:</label>
            <input
              type="text"
              className="form-control"
              value={pkg.packageName}
              disabled // Disable input field for package name
            />
          </div>
          <div className="mb-3">
            <label htmlFor={`packageDescription-${index}`} className="form-label">Package Description:</label>
            <textarea
              className="form-control"
              id={`packageDescription-${index}`}
              value={pkg.packageDescription}
              onChange={(e) => handlePackageChange(index, 'packageDescription', e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="mb-3">
            <label htmlFor={`packagePrice-${index}`} className="form-label">Package Price:</label>
            <input
              type="text"
              className="form-control"
              id={`packagePrice-${index}`}
              value={pkg.packagePrice}
              onChange={(e) => handlePackageChange(index, 'packagePrice', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor={`packageDeliveryTime-${index}`} className="form-label">Package Delivery Time:</label>
            <input
              type="text"
              className="form-control"
              id={`packageDeliveryTime-${index}`}
              value={pkg.packageDeliveryTime}
              onChange={(e) => handlePackageChange(index, 'packageDeliveryTime', e.target.value)}
            />
          </div>
        </div>
      ))}
      {/* Error messages */}
      {packageError && (
        <div className="text-danger mb-3">{packageError}</div>
      )}
      {/* Buttons */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-danger" onClick={handleDiscardChanges}>Discard Changes</button>
        <button className="btn btn-success" onClick={handleSave}>Apply Changes</button>
      </div>
    </div>
  );
};

export default EditGig;
