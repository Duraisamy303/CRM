import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const YearPicker = ({ value, onChange }) => {
    const [selectedYear, setSelectedYear] = useState(value || new Date());

    const handleChange = (date) => {
        setSelectedYear(date);
        if (onChange) {
            onChange(date);
        }
    };

    return (
        <div>
            <DatePicker
                selected={selectedYear}
                onChange={handleChange}
                showYearPicker
                dateFormat="yyyy" // Display only the year
                placeholderText="Select a year"
                yearItemNumber={12} // Number of years to show in the dropdown (default is 12)
                scrollableYearDropdown
            />
        </div>
    );
};

export default YearPicker;
