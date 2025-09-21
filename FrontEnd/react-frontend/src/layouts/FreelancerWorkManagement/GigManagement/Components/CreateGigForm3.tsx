import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

interface PackageDetails {
    [key: string]: {
        content: string;
        estimatedTime: number;
        price: number;
    };
}

const CreateGigForm3: React.FC = () => {

    const { gigId } = useParams<{ gigId: string }>();

    const [formData, setFormData] = useState<{ packageDetails: PackageDetails }>({
        packageDetails: {
            Basic: { content: '', estimatedTime: 1, price: 1 },
            Standard: { content: '', estimatedTime: 1, price: 1 },
            Premium: { content: '', estimatedTime: 1, price: 1 },
        },
    });

    const [agreed, setAgreed] = useState<boolean>(false);
    const [singlePackageMode, setSinglePackageMode] = useState<boolean>(true); // Default to single-package mode
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    const handleContentChange = (packageType: string, value: string) => {
        const trimmedValue = value.slice(0, 200);
        setFormData(prevState => ({
            packageDetails: {
                ...prevState.packageDetails,
                [packageType]: { ...prevState.packageDetails[packageType], content: trimmedValue },
            },
        }));
    };

    const handleEstimatedTimeChange = (packageType: string, value: number) => {
        if (value !== 0) {
            setFormData(prevState => ({
                packageDetails: {
                    ...prevState.packageDetails,
                    [packageType]: { ...prevState.packageDetails[packageType], estimatedTime: value },
                },
            }));
        }
    };

    const handlePriceChange = (packageType: string, value: number) => {
        if (value !== 0) {
            setFormData(prevState => ({
                packageDetails: {
                    ...prevState.packageDetails,
                    [packageType]: { ...prevState.packageDetails[packageType], price: value },
                },
            }));
        }
    };

    const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreed(e.target.checked);
    };

    const handleToggleMode = () => {
        setSinglePackageMode(prevMode => !prevMode); // Toggle between single-package mode and multi-package mode
    };

    const handlePublishGig = () => {
        if (!agreed) {
            alert("Please agree to the terms to publish the gig.");
            return;
        }

        if (singlePackageMode) {
            const packageType = 'Basic';

            const packageDescription = formData.packageDetails[packageType].content.trim(); // Trim to remove leading/trailing whitespace

            // Check if package description is empty
            if (packageDescription === '') {
                alert("Please enter content for the Basic package.");
                return; // Skip submitting this package
            }

            const payload = {
                packageName: packageType,
                packageDescription: packageDescription,
                packagePrice: formData.packageDetails[packageType].price,
                packageDeliveryTime: formData.packageDetails[packageType].estimatedTime,
            };

            axios.post(`http://localhost:8082/freelancer-gigs/${gigId}/gig-packages`, payload)
                .then(response => {
                    console.log(`Gig was published successfully!`);
                    alert("Gig was published successfully!");
                    handleNextClick(); // Redirect
                })
                .catch(error => {
                    console.error(`Error submitting ${packageType} package:`, error);
                });

        } else {
            // Check if any package description is empty
            const isEmptyDescription = Object.values(formData.packageDetails).some(packageDetail => packageDetail.content.trim() === '');

            if (isEmptyDescription) {
                alert("Please enter content for all packages.");
                return;
            }

            // Logic for multi-package mode
            Object.keys(formData.packageDetails).forEach(packageType => {
                const packageDescription = formData.packageDetails[packageType].content.trim();

                const payload = {
                    packageName: packageType,
                    packageDescription: packageDescription,
                    packagePrice: formData.packageDetails[packageType].price,
                    packageDeliveryTime: formData.packageDetails[packageType].estimatedTime,
                };

                axios.post(`http://localhost:8082/freelancer-gigs/${gigId}/gig-packages`, payload)
                    .then(response => {
                        console.log(`${packageType} package was published successfully!`);
                    })
                    .catch(error => {
                        console.error(`Error submitting ${packageType} package:`, error);
                    });
            });
            alert("You have created the gig successfully!");
            handleNextClick(); // Redirect
        }
    };


    const history = useHistory();

    const handleNextClick = () => {
        history.push('/FreelancerMain');
    }

    return (
        <div>
            <section className="container mt-5 .below-navbar" id="containerGigCreate">
                <h2 className="text-center mb-4 text-danger">Publish</h2>
                {showSuccessMessage && (
                    <div className="alert alert-success" role="alert">
                        You have created the gig successfully!
                    </div>
                )}
                {singlePackageMode ? (
                    <div className="row">
                        <div className="col">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h5 className="card-title text-center fw-bold" style={{ fontSize: '24px' }}>Basic</h5>
                                    <div className="form-group mb-3">
                                        <textarea
                                            className="form-control"
                                            id="packageContent-Basic"
                                            placeholder="Enter content for Basic package"
                                            value={formData.packageDetails.Basic.content}
                                            onChange={e => handleContentChange('Basic', e.target.value)}
                                            rows={7}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="estimatedTime-Basic" className="form-label" id="formLabelGigCreate">Estimated Time:</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="estimatedTime-Basic"
                                                placeholder="Time for Basic package"
                                                value={formData.packageDetails.Basic.estimatedTime}
                                                onChange={e => handleEstimatedTimeChange('Basic', parseInt(e.target.value))}
                                                required
                                                min="1"
                                                step="1"
                                                pattern="[0-9]+"
                                            />
                                            <span className="input-group-text">hours</span>
                                        </div>
                                        <small className="text-muted">Minimum 1 hour</small>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="price-Basic" className="form-label" id="formLabelGigCreate">Price:</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="price-Basic"
                                                placeholder="Enter price for Basic package"
                                                value={formData.packageDetails.Basic.price}
                                                onChange={e => handlePriceChange('Basic', parseFloat(e.target.value))}
                                                required
                                                min="1"
                                                step="0.05"
                                                pattern="^\d*\.?\d*$" // Allows positive float numbers
                                            />
                                            <span className="input-group-text">$</span>
                                        </div>
                                        <small className="text-muted">Minimum $1</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Multi-package mode
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {Object.keys(formData.packageDetails).map(packageType => (
                            <div key={packageType} className="col">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <h5 className="card-title text-center fw-bold" style={{ fontSize: '24px' }}>{packageType}</h5>
                                        <div className="form-group mb-3">
                                            <textarea
                                                className="form-control"
                                                id={`packageContent-${packageType}`}
                                                placeholder={`Enter content for ${packageType} package`}
                                                value={formData.packageDetails[packageType].content}
                                                onChange={e => handleContentChange(packageType, e.target.value)}
                                                rows={7}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`estimatedTime-${packageType}`} className="form-label" id="formLabelGigCreate">Estimated Time:</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`estimatedTime-${packageType}`}
                                                    placeholder={`Time for ${packageType} package`}
                                                    value={formData.packageDetails[packageType].estimatedTime}
                                                    onChange={e => handleEstimatedTimeChange(packageType, parseInt(e.target.value))}
                                                    required
                                                    min="1"
                                                    step="1"
                                                    pattern="[0-9]+" // Allows positive integers
                                                />
                                                <span className="input-group-text">hours</span>
                                            </div>
                                            <small className="text-muted">Minimum 1 hour</small>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`price-${packageType}`} className="form-label" id="formLabelGigCreate">Price:</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`price-${packageType}`}
                                                    placeholder={`Enter price for ${packageType} package`}
                                                    value={formData.packageDetails[packageType].price}
                                                    onChange={e => handlePriceChange(packageType, parseFloat(e.target.value))}
                                                    required
                                                    min="1"
                                                    step="0.05"
                                                    pattern="^\d*\.?\d*$" // Allows positive float numbers
                                                />
                                                <span className="input-group-text">$</span>
                                            </div>
                                            <small className="text-muted">Minimum $1</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 p-1 border-0">
                    <div className="row">
                        <div className="col-12 text-center mb-3">
                            <button className={`btn btn-outline-primary`} onClick={handleToggleMode}>
                                {singlePackageMode ? 'Switch to Multi-Package Mode' : 'Switch to Single-Package Mode'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card mt-4 p-1 border-0">
                    <h2 className="card-title text-center mb-3">Agreement</h2>
                    <p className="card-text mb-3" style={{ fontSize: '1em', paddingLeft: '1em' }}>
                        "By submitting this gig, I agree to deliver the specified work within the agreed-upon
                        timeline and to the best of my ability. Payment terms are as agreed upon in our
                        communication. I retain the right to use this work as part of my portfolio, unless otherwise discussed."
                    </p>
                    <div className="form-check d-flex justify-content-center mb-3">
                        <input className="form-check-input" type="checkbox" id="agreementCheck" checked={agreed} onChange={handleAgreementChange} />
                        <label className="form-check-label ms-2" htmlFor="agreementCheck">I agree to the terms and conditions</label>
                    </div>
                </div>

                <div className="col-12 mt-4">
                    <button className="btn btn-primary btn-lg" id="btnPrimaryGigCreate" onClick={handlePublishGig} disabled={!agreed}>
                        Publish Gig
                    </button>
                </div>
            </section>
        </div>
    );
}

export default CreateGigForm3;
