import React from 'react';
import IconEdit from './Icon/IconEdit';
import IconTrash from './Icon/IconTrash';
import moment from 'moment';

const LogCard = (props) => {
    const { data, onEdit, onDelete, editIcon } = props;
    const PyramidLogo = () => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 20H22L12 2Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div className="relative flex w-full rounded-lg border border-gray-300 bg-white p-4 shadow-md transition-transform hover:scale-105">
            {/* Left-side logo */}
            <div className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
                <PyramidLogo />
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col gap-2 pl-14">
                {' '}
                {/* Adjust padding to make space for the logo */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{`${data?.created_by?.username} (Contact: ${data?.contact?.name})`}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <p className="rounded-full bg-blue-500 px-3 py-1 text-sm text-white">{moment(data.created_on).format('YYYY-MM-DD HH:mm')}</p>
                    <p className="font-bold">Follow Up:</p>
                    <p className="rounded-full bg-yellow-500 px-3 py-1 text-sm text-white">{moment(data.follow_up_date_time).format('YYYY-MM-DD HH:mm')}</p>
                </div>
                {/* Comments/Details Section */}
                <div className="border-t border-gray-200 pt-2">
                    <p className="text-gray-600">{data?.details || 'No comments available.'}</p>
                </div>
            </div>

            {/* Icons */}
            {editIcon && (
                <div className="ml-4 flex flex-col justify-center">
                    <button className="flex items-center text-blue-500 hover:text-blue-700" onClick={onEdit}>
                        <IconEdit className="mr-1 h-5 w-5" />
                    </button>
                    {/* <button
                        className="flex items-center text-red-500 hover:text-red-700"
                        onClick={onDelete}
                    >
                        <IconTrash className="h-5 w-5" />
                    </button> */}
                </div>
            )}
        </div>
    );
};
export default LogCard;
