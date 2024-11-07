import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileSelect, buttonText = "Upload File", iconSrc, accept = "*/*", isImageAllowed = false }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            if (!isImageAllowed && file.type.startsWith('image/')) {
                alert('Only non-image files are allowed.');
                return;
            }
            setSelectedFile(file);
            onFileSelect && onFileSelect(file); // Call onFileSelect if provided
        }
    };

    // Handle removing the selected file
    const removeFile = () => {
        setSelectedFile(null);
        onFileSelect && onFileSelect(null); // Inform parent that file is removed
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input value
        }
    };

    return (
        <div className="flex flex-col items-center">
            {selectedFile ? (
                <div className="flex items-center space-x-4 bg-gray-100 p-3 rounded-lg">
                    <span className="text-gray-700">{selectedFile.name}</span>
                    <button
                        onClick={removeFile}
                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div
                    className="flex h-[50px] w-[200px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-500 p-2 hover:border-gray-700"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                    {iconSrc && <img src={iconSrc} alt="Upload" height={30} width={30} className="mr-2" />}
                    <span className="text-gray-600">{buttonText}</span>
                </div>
            )}
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept={accept}
            />
        </div>
    );
};

export default FileUpload;
