import React from 'react';

export default function ViewLabel(props) {
    const { label, value } = props;
    return (
        <div className="flex items-center">
            <div className="w-2/3">
                <label className="block text-sm font-bold text-gray-700">{label}</label>
            </div>
            <div className="w-2/3">
                <label className="block text-sm font-medium text-gray-700">{value}</label>
            </div>
        </div>
    );
}
