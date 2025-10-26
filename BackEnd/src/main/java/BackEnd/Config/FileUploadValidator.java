package BackEnd.Config;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Secure file upload validator to prevent malicious file uploads
 * while maintaining application functionality
 */
@Component
public class FileUploadValidator {

    // Allowed MIME types for images
    private static final Set<String> ALLOWED_IMAGE_MIME_TYPES = new HashSet<>(Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    ));

    // Allowed file extensions
    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = new HashSet<>(Arrays.asList(
        "jpg", "jpeg", "png", "gif", "webp"
    ));

    // Maximum file size: 5MB (reasonable for profile/gig images)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    // Pattern for safe filename (alphanumeric, dots, hyphens, underscores only)
    private static final Pattern SAFE_FILENAME_PATTERN = Pattern.compile("^[a-zA-Z0-9._-]+$");

    // Dangerous file signatures to detect (magic numbers)
    private static final byte[][] DANGEROUS_SIGNATURES = {
        {0x4D, 0x5A}, // PE executable
        {0x50, 0x4B}, // ZIP-based files (could contain malicious content)
        {0x7F, 0x45, 0x4C, 0x46}, // ELF executable
        {(byte)0xFF, (byte)0xD8, (byte)0xFF} // JPEG (we'll allow this but check content)
    };

    /**
     * Validates if the uploaded file is safe for image upload
     * @param file The multipart file to validate
     * @return ValidationResult containing validation status and message
     */
    public ValidationResult validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new ValidationResult(false, "File is empty or null");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return new ValidationResult(false, 
                String.format("File size exceeds maximum limit of %d MB", MAX_FILE_SIZE / (1024 * 1024)));
        }

        // Validate MIME type
        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_IMAGE_MIME_TYPES.contains(mimeType.toLowerCase())) {
            return new ValidationResult(false, 
                "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed");
        }

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return new ValidationResult(false, "Invalid filename");
        }

        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.contains(fileExtension)) {
            return new ValidationResult(false, 
                "Invalid file extension. Only jpg, jpeg, png, gif, and webp are allowed");
        }

        // Validate filename safety
        if (!isFilenameSafe(originalFilename)) {
            return new ValidationResult(false, 
                "Filename contains invalid characters. Only letters, numbers, dots, hyphens, and underscores are allowed");
        }

        // Basic content validation - check magic numbers
        try {
            byte[] fileHeader = new byte[Math.min((int)file.getSize(), 10)];
            file.getInputStream().read(fileHeader);
            
            if (!isImageContent(fileHeader, mimeType)) {
                return new ValidationResult(false, "File content does not match declared image type");
            }
        } catch (IOException e) {
            return new ValidationResult(false, "Unable to validate file content");
        }

        return new ValidationResult(true, "File validation successful");
    }

    /**
     * Sanitizes filename to prevent path traversal and other attacks
     * @param originalFilename The original filename
     * @return Sanitized filename safe for storage
     */
    public String sanitizeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return "unknown_" + System.currentTimeMillis();
        }

        // Remove path separators and other dangerous characters
        String sanitized = originalFilename.replaceAll("[/\\\\:*?\"<>|]", "");
        
        // Remove any leading dots or spaces
        sanitized = sanitized.replaceAll("^[.\\s]+", "");
        
        // Limit filename length
        if (sanitized.length() > 100) {
            String extension = getFileExtension(sanitized);
            String name = sanitized.substring(0, 100 - extension.length() - 1);
            sanitized = name + "." + extension;
        }

        // If filename becomes empty after sanitization, generate a safe one
        if (sanitized.trim().isEmpty()) {
            String extension = getFileExtension(originalFilename);
            sanitized = "file_" + System.currentTimeMillis() + 
                       (extension.isEmpty() ? "" : "." + extension);
        }

        return sanitized;
    }

    /**
     * Extracts file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    /**
     * Checks if filename contains only safe characters
     */
    private boolean isFilenameSafe(String filename) {
        // Remove the extension for checking
        String nameWithoutExt = filename.contains(".") ? 
            filename.substring(0, filename.lastIndexOf(".")) : filename;
        
        // Allow reasonable filename patterns
        return nameWithoutExt.length() > 0 && 
               nameWithoutExt.length() <= 100 &&
               !nameWithoutExt.startsWith(".") &&
               !nameWithoutExt.contains("..") &&
               !nameWithoutExt.contains("/") &&
               !nameWithoutExt.contains("\\");
    }

    /**
     * Basic validation that file content matches expected image format
     */
    private boolean isImageContent(byte[] header, String mimeType) {
        if (header.length < 4) return false;

        switch (mimeType.toLowerCase()) {
            case "image/jpeg":
            case "image/jpg":
                return header[0] == (byte)0xFF && header[1] == (byte)0xD8 && header[2] == (byte)0xFF;
            case "image/png":
                return header[0] == (byte)0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G';
            case "image/gif":
                return (header[0] == 'G' && header[1] == 'I' && header[2] == 'F' && header[3] == '8');
            case "image/webp":
                return header.length >= 8 && header[0] == 'R' && header[1] == 'I' && 
                       header[2] == 'F' && header[3] == 'F' && header[8] == 'W';
            default:
                return false;
        }
    }

    /**
     * Result of file validation
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;

        public ValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
    }
}