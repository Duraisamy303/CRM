import React from 'react';

export default function OppLabel({ label1, value1, label2, value2 }) {
    return (
        <div className="flex items-center justify-between gap-4">
            {/* First set of label and value */}
            <div className="flex w-[45%] items-center justify-between">
                <label className="block text-sm font-bold text-gray-700">{label1}</label>
                <span className="block text-sm font-medium text-gray-700">{value1}</span>
            </div>
            {/* Second set of label and value */}
            <div className="flex w-[45%] items-center justify-between">
                <label className="block text-sm font-bold text-gray-700">{label2}</label>
                <span className="block text-sm font-medium text-gray-700">{value2}</span>
            </div>
        </div>
    );
}
