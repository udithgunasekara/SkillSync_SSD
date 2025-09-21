// In Freelancer Registration page
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
};

export const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-z0-9]+$/;
    return usernameRegex.test(username);
};

export const validateDOB = (dob: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 13 && age <= 99;
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};



//In Qualification Upload Page
export const validateStartDate = (startDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  
    const start = new Date(startDate);
    return start <= today;
};

export const validateEndDate = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start && validateStartDate(endDate);  
};

export const validateImageUpload = (files: FileList | null): boolean => {
    if (!files || files.length <= 1) {
        return false; // Must upload more than two images
    }

    for (let i = 0; i < files.length; i++) {
        if (files[i].type !== 'image/png') {
            return false; // Validates only PNG images are allowed
        }
    }

    return true;
};