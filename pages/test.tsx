import FileUpload from '@/common_component/fileUpload';
import React from 'react';

const ParentComponent = () => {
    const handleFileSelect = (file) => {
        console.log('file: ', file);
        if (file) {
            console.log('Selected file:', file.name);
        } else {
            console.log('File removed');
        }
    };

    return (
        <div>
            <h1>Upload Document</h1>
            <FileUpload
                onFileSelect={handleFileSelect}
                buttonText="Upload Document"
                iconSrc="/assets/images/fileUplaod.jpg"
                accept=".pdf,.doc,.docx,.txt"
                isImageAllowed={false} // Only allow non-image files
            />
        </div>
    );
};

export default ParentComponent;
