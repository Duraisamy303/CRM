import IconBitcoin from '@/components/Icon/IconBitcoin';
import IconPlus from '@/components/Icon/IconPlus';
import FullCalendar from '@fullcalendar/react';
import { Card, SimpleGrid, Title } from '@mantine/core';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Test() {
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    const TeleData = [
        // { title: 'Calls', monthCount: 150, todayCount: 250, icon: '🔗', name1: 'Today', name2: 'Month', bgColor: 'bg-blue-100' },
        // { title: 'Appointments', monthCount: 150, todayCount: 200, icon: '👨‍💼', name1: 'Today', name2: 'Month', bgColor: 'bg-yellow-100' },
        // { title: 'Proposals', monthCount: 150, todayCount: 300, icon: '⏳', name1: 'Month', name2: 'Target', bgColor: 'bg-purple-100' },
        // { title: 'Closures', monthCount: 150, todayCount: 300, icon: '💵', name1: 'Month', name2: 'Target', bgColor: 'bg-red-100' },
        { title: 'Stages', monthCount: 2000, todayCount: 150, icon: '📋', name1: 'Today', name2: 'Month', bgColor: 'bg-indigo-100' },

        { title: 'Targets', monthCount: 100000, todayCount: 5000, icon: '🎯', name1: 'Today', name2: 'Total', bgColor: 'bg-violet-100' },
        { title: 'Pending Tasks', monthCount: 80, todayCount: 20, icon: '⏳', name1: 'Today', name2: 'Pending', bgColor: 'bg-gray-100' },
        { title: 'Sales', monthCount: 30000, todayCount: 1200, icon: '📊', name1: 'Today', name2: 'Month', bgColor: 'bg-lime-100' },
    ];


    const cards = [
        { title: `Today's Meetings`, monthCount: 3, todayCount: 150, icon: '⏰', name1: 'Today', name2: 'Month', bgColor: 'bg-indigo-100' },
        { title: `Tomorrow Meetings`, monthCount: 4, todayCount: 300, icon: '⏰', name1: 'Today', name2: 'Month', bgColor: 'bg-green-100' },
        { title: 'Expected This Month Income', monthCount: "₹ 54,00,00.00", todayCount: 150, icon: "₹", name1: 'Today', name2: 'Total', bgColor: 'bg-fuchsia-100' },
        { title: 'Total Leads This Month', monthCount: 200, todayCount: 2000, icon: '📋', name1: 'Today', name2: 'Month', bgColor: 'bg-teal-100' },
        { title: 'Total Opportunities This Month', monthCount: 25, todayCount: 5, icon: '🌟', name1: 'Today', name2: 'Active', bgColor: 'bg-pink-100' },
    ];

    const leadSourceChart = {
        series: [45, 25, 15, 10, 5],
        options: {
            chart: { type: 'donut', height: '100px' },
            labels: ['Website', 'Social Media', 'Referrals', 'Ads', 'Others'],
            colors: ['#1B998B', '#E84855', '#F9C22E', '#A8C686', '#374785'],
        },
    };

    const salesPerformanceChart = {
        series: [{ name: 'Revenue', data: [30000, 35000, 40000, 45000, 50000] }],
        options: {
            chart: { type: 'line' },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
        },
    };

    const leadConversionChart = {
        series: [70],
        options: {
            chart: { type: 'radialBar' },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        value: { formatter: (val) => `₹{val}%` },
                    },
                },
            },
            colors: ['#FF5722'],
        },
    };

    const revenueChart = {
        series: [
            { name: 'Income', data: [10000, 12000, 15000, 17000, 20000] },
            { name: 'Expenses', data: [8000, 10000, 14000, 16000, 18000] },
        ],
        options: {
            chart: { type: 'area' },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
            colors: ['#1B55E2', '#E7515A'],
        },
    };

    const topPerformingSalesChart = {
        series: [{ name: 'Sales', data: [300, 400, 500, 200, 300] }],
        options: {
            chart: { type: 'bar' },
            xaxis: { categories: ['Alice', 'Bob', 'Charlie', 'Dave', 'Emma'] },
            colors: ['#4CAF50'],
        },
    };

    const pipelineValueByStageChart = {
        series: [25, 35, 20, 20],
        options: {
            chart: { type: 'pie' },
            labels: ['Retails', 'AutoMobile', 'IT', 'Education'],
            colors: ['#FFC107', '#03A9F4', '#8BC34A', '#FF5722'],
        },
    };

    const customerRetentionRateChart = {
        series: [85],
        options: {
            chart: { type: 'radialBar' },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        value: { formatter: (val) => `₹{val}%` },
                    },
                },
            },
            colors: ['#673AB7'],
        },
    };

    const taskCompletionStatusChart = {
        series: [60, 20, 20],
        options: {
            chart: { type: 'donut' },
            labels: ['Completed', 'Pending', 'Overdue'],
            colors: ['#4CAF50', '#FFC107', '#F44336'],
        },
    };

    const customerFeedbackChart = {
        series: [{ name: 'Feedback', data: [80, 70, 90, 85, 75] }],
        options: {
            chart: { type: 'bar' },
            xaxis: { categories: ['Follow Up', 'In Progress', 'Follow Up', 'In Progress', 'Follow Up'] },
            colors: ['#33FF57', '#8E44AD'], 
            plotOptions: {
                bar: {
                    distributed: true, // Enables individual bar colors
                },
            },
        },
    };

    const LeadStatus = {
        series: [{ 
            name: 'Feedback', 
            data: [80, 70, 90, 85, 75] 
        }],
        options: {
            chart: { 
                type: 'bar' 
            },
            xaxis: { 
                categories: ['New', 'Follow Up', 'In Progress', 'Qualified', 'Contacted'] 
            },
            colors: ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#8E44AD'], // Assign different colors to bars
            plotOptions: {
                bar: {
                    distributed: true, // Enables individual bar colors
                },
            },
        },
    };

    const now = new Date();
    const getMonth = (dt: Date, add: number = 0) => {
        let month = dt.getMonth() + 1 + add;
        const str = (month < 10 ? '0' + month : month).toString();
        return str;
        // return dt.getMonth() < 10 ? '0' + month : month;
    };

    const [events, setEvents] = useState<any>([
        {
            id: 1,
            title: 'All Day Event',
            start: now.getFullYear() + '-' + getMonth(now) + '-01T14:30:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-02T14:30:00',
            className: 'danger',
            description: 'Aenean fermentum quam vel sapien rutrum cursus. Vestibulum imperdiet finibus odio, nec tincidunt felis facilisis eu.',
        },
        {
            id: 2,
            title: 'Site Visit',
            start: now.getFullYear() + '-' + getMonth(now) + '-07T19:30:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-08T14:30:00',
            className: 'primary',
            description: 'Etiam a odio eget enim aliquet laoreet. Vivamus auctor nunc ultrices varius lobortis.',
        },
        {
            id: 3,
            title: 'Product Lunching Event',
            start: now.getFullYear() + '-' + getMonth(now) + '-17T14:30:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-18T14:30:00',
            className: 'info',
            description: 'Proin et consectetur nibh. Mauris et mollis purus. Ut nec tincidunt lacus. Nam at rutrum justo, vitae egestas dolor.',
        },
        {
            id: 4,
            title: 'Meeting',
            start: now.getFullYear() + '-' + getMonth(now) + '-12T10:30:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-13T10:30:00',
            className: 'danger',
            description: 'Mauris ut mauris aliquam, fringilla sapien et, dignissim nisl. Pellentesque ornare velit non mollis fringilla.',
        },
        {
            id: 5,
            title: 'Lunch',
            start: now.getFullYear() + '-' + getMonth(now) + '-12T15:00:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-13T15:00:00',
            className: 'info',
            description: 'Integer fermentum bibendum elit in egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
        },
        {
            id: 6,
            title: 'Conference',
            start: now.getFullYear() + '-' + getMonth(now) + '-12T21:30:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-13T21:30:00',
            className: 'success',
            description:
                'Curabitur facilisis vel elit sed dapibus. Nunc sagittis ex nec ante facilisis, sed sodales purus rhoncus. Donec est sapien, porttitor et feugiat sed, eleifend quis sapien. Sed sit amet maximus dolor.',
        },
        {
            id: 7,
            title: 'Happy Hour',
            start: now.getFullYear() + '-' + getMonth(now) + '-12T05:30:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-13T05:30:00',
            className: 'info',
            description: ' odio lectus, porttitor molestie scelerisque blandit, hendrerit sed ex. Aenean malesuada iaculis erat, vitae blandit nisl accumsan ut.',
        },
        {
            id: 8,
            title: 'Dinner',
            start: now.getFullYear() + '-' + getMonth(now) + '-12T20:00:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-13T20:00:00',
            className: 'danger',
            description: 'Sed purus urna, aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            id: 9,
            title: 'Birthday Party',
            start: now.getFullYear() + '-' + getMonth(now) + '-27T20:00:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-28T20:00:00',
            className: 'success',
            description: 'Sed purus urna, aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            id: 10,
            title: 'New Talent Event',
            start: now.getFullYear() + '-' + getMonth(now, 1) + '-24T08:12:14',
            end: now.getFullYear() + '-' + getMonth(now, 1) + '-27T22:20:20',
            className: 'danger',
            description: 'Sed purus urna, aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            id: 11,
            title: 'Other new',
            start: now.getFullYear() + '-' + getMonth(now, -1) + '-13T08:12:14',
            end: now.getFullYear() + '-' + getMonth(now, -1) + '-16T22:20:20',
            className: 'primary',
            description: 'Pellentesque ut convallis velit. Sed purus urna, aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            id: 13,
            title: 'Upcoming Event',
            start: now.getFullYear() + '-' + getMonth(now, 1) + '-15T08:12:14',
            end: now.getFullYear() + '-' + getMonth(now, 1) + '-18T22:20:20',
            className: 'primary',
            description: 'Pellentesque ut convallis velit. Sed purus urna, aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
    ]);

    const editEvent = (data: any = null) => {
        // let params = JSON.parse(JSON.stringify(defaultParams));
        // setParams(params);
        // if (data) {
        //     let obj = JSON.parse(JSON.stringify(data.event));
        //     setParams({
        //         id: obj.id ? obj.id : null,
        //         title: obj.title ? obj.title : null,
        //         start: dateFormat(obj.start),
        //         end: dateFormat(obj.end),
        //         type: obj.classNames ? obj.classNames[0] : 'primary',
        //         description: obj.extendedProps ? obj.extendedProps.description : '',
        //     });
        //     setMinStartDate(new Date());
        //     setMinEndDate(dateFormat(obj.start));
        // } else {
        //     setMinStartDate(new Date());
        //     setMinEndDate(new Date());
        // }
        // setIsAddEventModal(true);
    };
    const editDate = (data: any) => {
        let obj = {
            event: {
                start: data.start,
                end: data.end,
            },
        };
        editEvent(obj);
    };


    const BDMData = [
        // { title: 'Leads', monthCount: 150, todayCount: 25, icon: '🔗', name1: 'Today', name2: 'Month' },
        { title: 'Calls', monthCount: 150, todayCount: 300, icon: '📞', name1: 'Today', name2: 'Month' },
        { title: 'Opportunity', monthCount: 150, todayCount: 300, icon: '💰', name1: 'Today', name2: 'Month' },
        { title: 'Appoinments', monthCount: 150, todayCount: 2, icon: '👨‍💼', name1: 'Today', name2: 'Month' },
        { title: 'Proposals', monthCount: 150, todayCount: 3, icon: '⏳', name1: 'Month', name2: 'Target' },
        { title: 'Closures', monthCount: 150, todayCount: 300, icon: '💵', name1: 'Month', name2: 'Target' },
    ];

    const bitcoin: any = {
        series: [
            {
                data: [21, 9, 36, 12, 44, 25, 59, 41, 25, 66],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#00ab55'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };
    return (
        <div className="p-2">
            <div className="panel  mb-3 flex items-center justify-between gap-5 ">
                <div className="flex items-center gap-5 pl-3">
                    <h5 className="text-lg font-semibold ">Dashboard</h5>
                </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row ">
                {/* Calendar Section */}
                <div className="panel w-full">
                    <div className="calendar-wrapper">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay',
                            }}
                            editable={true}
                            dayMaxEvents={true}
                            selectable={true}
                            droppable={true}
                            eventClick={(event: any) => editEvent(event)}
                            select={(event: any) => editDate(event)}
                            events={events}
                            height="600px" 
                            
                        />
                    </div>
                </div>

                {/* Cards Section */}
                {/* <div className="panel flex w-full flex-col gap-4 lg:w-2/5">
                    {cards.map((card, index) => (
                        <div className="panel flex items-center gap-4 p-4" key={index}>
                            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-[60px] text-secondary`}>{card.icon}</div>

                            <div className="flex-1 text-right">
                                <h6 className="text-xl font-bold text-dark dark:text-white-light">{card.monthCount}</h6>
                                <h6 className="text-lg text-dark dark:text-white-light">{card.title}</h6>
                            </div>
                        </div>
                    ))}
                </div> */}
            </div>
            {/* <div className="mt-2">
                <SimpleGrid
                    cols={4}
                    spacing="sm"
                    breakpoints={[
                        { maxWidth: 768, cols: 2 },
                        { maxWidth: 576, cols: 1 },
                    ]}
                >
                    {TeleData.map((card, index) => (
                        <div className="panel flex items-center gap-4 p-4" key={index}>
                            <div className={`flex h-20 w-20  shrink-0 items-center justify-center rounded-full text-[60px]`}>{card.icon}</div>

                            <div className="flex-1 text-right">
                                <h6 className="text-xl font-bold text-dark dark:text-white-light">{card.monthCount}</h6>
                                <h6 className="text-lg  text-dark dark:text-white-light">{card.title}</h6>
                                <h6 className="text-md  text-gray-400 dark:text-white-light">{'Months'}</h6>

                                <div className="mt-2 flex justify-between text-base font-bold">
                              
                                </div>
                            </div>
                        </div>
                    ))}
                </SimpleGrid>
            </div> */}
             <div className="pb-2 mt-2  ">
                <SimpleGrid
                    cols={5}
                    spacing="sm"
                    breakpoints={[
                        { maxWidth: 768, cols: 2 },
                        { maxWidth: 576, cols: 1 },
                    ]}
                >
                    {BDMData.map((card, index) => (
                        <div className="panel">
                            <div className="mb-5 flex items-center font-semibold">
                                <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full">
                                    <IconBitcoin />
                                </div>
                                <div className="ltr:ml-2 rtl:mr-2">
                                    <h6 className="text-lg font-bold text-dark dark:text-white-light">{card.title}</h6>
                                    {/* <p className="text-xs text-white-dark">Bitcoin</p> */}
                                </div>
                            </div>
                            <div className="mb-3">{isMounted && <ReactApexChart series={bitcoin.series} options={bitcoin.options} type="line" height={45} width={'100%'} />}</div>
                            <div className="flex items-center justify-between text-base font-bold">
                                <div>
                                    <div className="text-sm font-normal ">{card.name1}</div>
                                    <div>
                                        <span className="text-xl font-bold  text-success">{card.todayCount}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-normal "> {card.name2}</div>
                                    <div>
                                        <span className="text-xl font-bold text-success">{card.monthCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </SimpleGrid>
            </div>
            <SimpleGrid cols={2} spacing="lg" className="mt-2">
                <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Estimated Revenue</Title>
                    <div className="pb-2 pt-2">
                        <hr className="h-2" />
                    </div>
                    {isMounted && <ReactApexChart options={customerFeedbackChart.options} series={customerFeedbackChart.series} type="bar" height={320} />}

                    {/* {isMounted && <ReactApexChart options={leadSourceChart.options} series={leadSourceChart.series} type="donut" height={320} />} */}
                </Card>
                <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Lead Status</Title>
                    <div className="pb-2 pt-2">
                        <hr className="h-2" />
                    </div>
                    {isMounted && <ReactApexChart options={LeadStatus.options} series={LeadStatus.series} type="bar" height={320} />}

                    {/* {isMounted && <ReactApexChart options={salesPerformanceChart.options} series={salesPerformanceChart.series} type="line" height={320} />} */}
                </Card>
                {/* <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Lead Conversion</Title>
                    {isMounted && <ReactApexChart options={leadConversionChart.options} series={leadConversionChart.series} type="radialBar" />}
                </Card> */}

                <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Lead By Source </Title>
                    <div className="pb-2 pt-2">
                        <hr className="h-2" />
                    </div>
                    {isMounted && <ReactApexChart options={leadSourceChart.options} series={leadSourceChart.series} type="donut" height={320} />}

                    {/* {isMounted && <ReactApexChart options={revenueChart.options} series={revenueChart.series} type="area" height={320} />} */}
                </Card>

                {/* <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Top Performing Sales</Title>
                    {isMounted && <ReactApexChart options={topPerformingSalesChart.options} series={topPerformingSalesChart.series} type="bar" height={320} />}
                </Card> */}

                <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Lead By Industry</Title>
                    <div className="pb-2 pt-2">
                        <hr className="h-2" />
                    </div>
                    {isMounted && <ReactApexChart options={pipelineValueByStageChart.options} series={pipelineValueByStageChart.series} type="pie" height={320} />}
                </Card>
                {/* <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Customer Retention Rate</Title>
                    {isMounted && <ReactApexChart options={customerRetentionRateChart.options} series={customerRetentionRateChart.series} type="radialBar" height={320} />}
                </Card> */}
{/* 
                <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Task Status</Title>
                    <div className="pb-2 pt-2">
                        <hr className="h-2" />
                    </div>
                    {isMounted && <ReactApexChart options={taskCompletionStatusChart.options} series={taskCompletionStatusChart.series} type="donut" height={320} />}
                </Card>
                <Card shadow="sm" radius="lg">
                    <Title size={'16px'}>Contacts</Title>
                    <div className="pb-2 pt-2">
                        <hr className="h-2" />
                    </div>
                     {isMounted && <ReactApexChart options={customerFeedbackChart.options} series={customerFeedbackChart.series} type="bar" height={320} />}
                </Card> */}
            </SimpleGrid>
        </div>
    );
}
