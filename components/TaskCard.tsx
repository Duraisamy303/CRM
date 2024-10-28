import ReadMore from '@/common_component/readMore';
import React from 'react';

const TaskCard = ({ task }) => {
    return (
        <div className="mb-1 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">{task?.contact.name}</h3>
                <span className={`rounded px-3 py-1 text-sm font-semibold ${task?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {task?.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Task Type & Date */}
            <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                    <span className="mr-2 font-bold">Type:</span>
                    <span className='font-semibold'>{task?.tasktype?.label}</span>
                </div>
                <div>
                    <span className="font-medium">Date:</span> {new Date(task?.task_date_time).toLocaleDateString()}
                </div>
            </div>

            {/* Task Details */}
            <div className="mb-4">
                <h4 className="mb-1 text-sm font-bold text-gray-700">Details:</h4>
                <ReadMore  charLimit={120}>{task?.task_detail}</ReadMore>

            </div>

            {/* Log Information */}
            <div className="mb-4">
                <h4 className="mb-1 text-sm font-bold text-gray-700">Log:</h4>
                <ReadMore charLimit={120}>{task?.log?.log}</ReadMore>
            </div>

            {/* Footer: Created By & Created On */}
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                    <span className="font-semibold">Created by:</span> {task?.created_by?.username}
                </div>
                <div>
                    <span className="font-semibold">Created on:</span> {task?.created_on}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
