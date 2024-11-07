import React from 'react';
import moment from 'moment';
import ReadMore from '@/common_component/readMore';
import IconEdit from './Icon/IconEdit';

const Timeline = (props: any) => {
    const { data, onEdit, onDelete, editIcon } = props;
    return (
        <div className="w-full ">
            <div className="mb-5">
                <div className="mx-auto max-w-[900px]">
                    {data?.map((item) => (
                        <div className="flex">
                            <p className="mr-2 min-w-[100px] max-w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">{item?.created_on}</p>
                            <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-primary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary"></div>
                            <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                <div className="mt-4 w-full rounded-lg border border-gray-200 bg-white p-4  shadow-lg">
                                    <h3 className="text-lg font-semibold text-blue-700">{item.log_stage.stage}</h3>
                                    <p className="text-sm">
                                        <strong>Contact:</strong> {item.contact.name}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Focus Segment:</strong> {item.focus_segment.name}
                                    </p>
                                    {item?.follow_up_date_time && (
                                        <p className="text-sm">
                                            <strong>Follow-up Date:</strong> {moment(item.follow_up_date_time).format('MMMM DD, YYYY')}
                                        </p>
                                    )}
                                    {item?.details && (
                                        <p className=" flex text-sm">
                                            <strong>Details:</strong>
                                            <ReadMore children={item?.details} />
                                        </p>
                                    )}
                                    {editIcon && (
                                        <div className="mt-2 flex justify-end">
                                            <button className="flex items-center text-blue-500 hover:text-blue-700" onClick={() => onEdit(item)}>
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
