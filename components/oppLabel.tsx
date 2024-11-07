import React from 'react';

export default function OppLabel({ label1, value1, label2, value2, label3, value3 }) {
    return (
        <div className="flex justify-between  ">
            {value1 &&
            <div className="flex w-[30%] flex-col">
                <label className="text-sm font-bold text-gray-700">{label1}</label>
                <span className="text-sm font-medium text-gray-700">{value1}</span>
            </div>}
            
            {value2 &&
            <div className="flex w-[30%] flex-col">
                <label className="text-sm font-bold text-gray-700">{label2}</label>
                <span className="text-sm font-medium text-gray-700">{value2}</span>
            </div>
            }
            {value3 &&
            <div className="flex w-[30%] flex-col">
                <label className="text-sm font-bold text-gray-700">{label3}</label>
                <span className="text-sm font-medium text-gray-700">{value3}</span>
            </div>
            }
        </div>
    );
}
