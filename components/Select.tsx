import React from 'react';
import Select from 'react-select';

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps {
    options: Option[];
    value: Option | null;
    onChange: (selectedOption: Option | null) => void;
    placeholder?: string;
    title?: string;
    isSearchable?: boolean;
    className?: string;
    error?: string;
    isMulti?: boolean;
    required?: boolean;
}

const CustomSelect = (props: SelectProps) => {
    const { options, value, onChange, placeholder = 'Select...', title, isSearchable = true, className, error, isMulti, required } = props;
    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: error ? 'red' : provided.borderColor, // Set red border if there's an error
            boxShadow: error ? '0 0 0 0.1 red' : provided.boxShadow, // Add shadow if there's an error
            '&:hover': {
                borderColor: error ? 'red' : provided.borderColor, // Maintain red border on hover if there's an error
            },
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
        menu: (base: any) => ({ ...base, zIndex: 9999 }),
    };
    return (
        <div className={`w-full ${className}`}>
            {title && (
                <label className="block text-sm font-bold">
                    {title} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="">
                <Select
                    placeholder={placeholder}
                    options={options}
                    value={value}
                    onChange={onChange}
                    isSearchable={isSearchable}
                    isMulti={isMulti}
                    isClearable={true}
                    styles={customStyles}
                    className={`react-select ${className} ${error ? 'border-red-500' : ''}`} // Add conditional styling for error
                    // classNamePrefix="react-select" // Adds a prefix for custom styles
                    // styles={{
                    //     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    //     menu: (base) => ({ ...base, zIndex: 9999 }),
                    // }}
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default CustomSelect;
