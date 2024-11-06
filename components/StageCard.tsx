import React from 'react';
import moment from 'moment';
import ReadMore from '@/common_component/readMore';
import IconEdit from './Icon/IconEdit';

const StageCard = (props: any) => {
    const { data} = props;
    
    return (
        <div className="w-full p-4">
            <div className="mb-5">
                <div className="mx-auto max-w-[900px]">
                    {data?.map((item) => (
                        <div key={item.id} className="flex mb-4">
                            <p className="mr-5 min-w-[100px] max-w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">
                                {moment(item?.date).format('YYYY-MM-DD')}
                            </p>
                            <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-primary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary"></div>
                            <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                <div className="mt-4 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                                    <h3 className="text-lg font-semibold text-blue-700">{item?.stage}</h3>
                                    <p className="text-sm">
                                        <strong>Opportunity:</strong> {item?.opportunity?.name}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Moved By:</strong> {item?.moved_by}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Date:</strong> {moment(item?.date).format('MMMM DD, YYYY, h:mm A')}
                                    </p>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StageCard;
