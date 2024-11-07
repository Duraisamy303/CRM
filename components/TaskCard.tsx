import ReadMore from '@/common_component/readMore';
import { capitalizeFLetter } from '@/utils/functions.utils';
import moment from 'moment';
import React from 'react';

const TaskCard = ({ task }) => {
    console.log("task: ", task);
    return (
        <div className="mb-1 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <div className=" flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{capitalizeFLetter(task?.contact.name)}</h3>
                <div>
                    <span className="font-medium">Date:</span> {new Date(task?.task_date_time).toLocaleDateString()}
                </div>
            </div>

            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <span className={`rounded-xl px-2 py-1 text-sm font-semibold ${task?.tasktype?.label === 'Manual' ? 'bg-orange-300 text-white' : 'bg-purple-300 text-purple-600'}`}>
                    <span className="font-semibold">{task?.tasktype?.label}</span>
                </span>
                <span className={`rounded-xl px-2 py-1 text-sm font-semibold ${task?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {task?.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
            {task?.task_detail && (
                <div className="mb-2">
                    <h4 className="mb-1 text-sm font-bold text-gray-700">Details:</h4>
                    <ReadMore charLimit={120}>{task?.task_detail}</ReadMore>
                </div>
            )}
            {task?.log?.log && (
                <div className="mb-2">
                    <h4 className="mb-1 text-sm font-bold text-gray-700">Log:</h4>
                    <ReadMore charLimit={120}>{task?.log?.log}</ReadMore>
                </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                    <span className="font-semibold">Created by:</span> {task?.created_by?.username}
                </div>
                <div>
                    <span className="font-semibold">Created on:</span> {moment(task?.created_on).format("DD/MM/YYYY")}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
