import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Package {
  packageId: number;
  packageName: string;
  packageDescription: string;
  packagePrice: string;
  packageDeliveryTime: string;
}

const PackageSelection: React.FC<{ setSelectedPackage: (packageId: number, packageName: string) => void }> = ({ setSelectedPackage }) => {
  const { id } = useParams<{ id: string }>();
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Package[]>(`http://localhost:8082/freelancer-gigs/${id}/gig-packages`);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handlePackageSelect = (packageId: number, packageName: string) => {
    setSelectedPackage(packageId, packageName);
  };

  return (
    <div className="card-container d-flex flex-wrap justify-content-center">
      {packages.map((pack: Package) => (
        <div key={pack.packageId} className='card shadow mx-2 mb-4 bg-body rounded' style={{ width: '300px', height: '370px' }}>
          <div className='card-body d-flex flex-column justify-content-between'>
            <div>
              <h2 className='card-title' style={{ textAlign: 'center', color: 'red', paddingBottom: '10px' }}>{pack.packageName}</h2>
              <p className='card-text' style={{fontSize: '16px'}}>Price: ${pack.packagePrice}</p>
              <p className='card-text' style={{fontSize: '16px'}}>Description: {pack.packageDescription}</p>
              <p className='card-text' style={{fontSize: '16px'}}>Delivery Time: {pack.packageDeliveryTime} hours</p>
            </div>
            <div className="d-flex justify-content-center">
              <input className="form-check-input me-1" type="radio" name="package" id={`package${pack.packageId}`} value={pack.packageId} onChange={() => handlePackageSelect(pack.packageId, pack.packageName)} />
              <label className="form-check-label" htmlFor={`package${pack.packageId}`}>Select</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PackageSelection;
