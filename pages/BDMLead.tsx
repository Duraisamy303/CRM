import React from 'react';
import dynamic from 'next/dynamic';
import { Badge, Card, SimpleGrid, Text, Title } from '@mantine/core';
import { useSetState } from '@/utils/functions.utils';
import IconFilter from '@/components/Icon/IconFilter';
import QuickEdit from '@/components/QuickEdit';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import { DataTable } from 'mantine-datatable';
import Funnel from '@/common_component/funnelChart';
import IconSearch from '@/components/Icon/IconSearch';
import Tippy from '@tippyjs/react';
import IconMobile from '@/components/Icon/IconMobile';
import IconNotesEdit from '@/components/Icon/IconNotesEdit';
import IconEye from '@/components/Icon/IconEye';
import IconEdit from '@/components/Icon/IconEdit';
import { useRouter } from 'next/router';
import IconBitcoin from '@/components/Icon/IconBitcoin';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

// Chart component
const ChartComponent = () => {
    const router = useRouter();

    const orderFilter = ['Year', 'Last Month', 'This Month', 'Last 7 Days', 'Custom'];

    const [state, setState] = useSetState({
        data: [],
        loading: false,
        selectedRecords: [],
        isOpenFilter: false,
        focusList: [],
        marketList: [],
        verticalList: [],
        countryList: [],
        stateList: [],
        state: '',
        vertical: '',
        country: '',
        market: '',
        focus: '',
        next: null,
        previous: null,
        totalRecords: 0,
        currentPage: 1,
        search: '',
        isOpen: false,
        range: [0, 10000],
        maxPrice: 10000,
        tagList: [],
        tags: [],
        isOpenAssign: false,
        createdByList: [],
        assigned_to: '',
        popupHeight: 'auto',
        columns: [],
        role: '',
        subLoading: false,
        incomLead: {},
        isShowIncomLead: false,
        leadIncomZero: false,
    });

    const  TeleData = [
        { title: 'Calls', monthCount: 150, todayCount: 250, icon: '🔗', name1: 'Today', name2: 'Month' },
        { title: 'Opportunities', monthCount: 150, todayCount: 300, icon: '💰', name1: 'Today', name2: 'Month' },
        { title: 'Appoinments', monthCount: 150, todayCount: 200, icon: '👨‍💼', name1: 'Today', name2: 'Month' },
        { title: 'Proposals', monthCount: 150, todayCount: 300, icon: '⏳', name1: 'Month', name2: 'Target' },
        { title: 'Closures', monthCount: 150, todayCount: 300, icon: '💵', name1: 'Month', name2: 'Target' },
    ];

    const BDMData = [
      { title: 'Leads', monthCount: 150, todayCount: 25, icon: '🔗', name1: 'Today', name2: 'Month' },
      { title: 'Calls', monthCount: 150, todayCount: 300, icon:  '📞', name1: 'Today', name2: 'Month' },
      { title: 'Opportunity', monthCount: 150, todayCount: 300, icon: '💰', name1: 'Today', name2: 'Month' },
      { title: 'Appoinments', monthCount: 150, todayCount: 2, icon: '👨‍💼', name1: 'Today', name2: 'Month' },
      { title: 'Proposals', monthCount: 150, todayCount: 3, icon: '⏳', name1: 'Month', name2: 'Target' },
      { title: 'Closures', monthCount: 150, todayCount: 300, icon: '💵', name1: 'Month', name2: 'Target' },
     
  ];

    // Chart options
    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: BDMData.map((data) => data.title),
        },
        yaxis: {
            title: {
                text: 'Count',
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toString(),
            },
        },
        colors: ['#00E396', '#008FFB'], // Colors for the bars
    };

    // Chart series data
    const chartSeries = [
        {
            name: 'Month Count',
            data: BDMData.map((data) => data.monthCount),
        },
        {
            name: 'Today Count',
            data: BDMData.map((data) => data.todayCount),
        },
    ];

    const backgroundColors = [
        'linear-gradient(135deg, #ff7e5f, #feb47b)', // Gradient 1
        'linear-gradient(135deg, #6a11cb, #2575fc)', // Gradient 2
        'linear-gradient(135deg, #00c6ff, #0072ff)', // Gradient 3
        'linear-gradient(135deg, #ff9a8b, #ffc3a0)', // Gradient 4
        'linear-gradient(135deg, #e44d26, #f7b731)', // Gradient 5
        'linear-gradient(135deg, #6b6b6b, #b3b3b3)', // Gradient 6
        'linear-gradient(135deg, #f093fb, #f5576c)', // Gradient 7
    ];

    const handleNextPage = () => {
        if (state.next) {
            setState({ currentPage: state.currentPage + 1 });
        }
    };

    const handlePreviousPage = () => {
        if (state.previous) {
            setState({ currentPage: state.currentPage - 1 });
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'In Progress':
                return <Badge color="blue">{status}</Badge>;
            case 'Pending':
                return <Badge color="orange">{status}</Badge>;
            case 'Completed':
                return <Badge color="green">{status}</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    // const pipelineData = [
    //     { name: 'Market Research', value: 30, fillColor: '#FFC300' }, // Amber
    //     { name: 'Team Outreach', value: 20, fillColor: '#FF5733' }, // Red Orange
    //     { name: 'Opportunity Review', value: 15, fillColor: '#C70039' }, // Deep Red
    //     { name: 'Strategy Deployment', value: 10, fillColor: '#900C3F' }, // Dark Red
    //     { name: 'Deal Support', value: 5, fillColor: '#581845' }, // Plum
    //     { name: 'Closed Deals', value: 20, fillColor: '#2E1A47' }, // Purple Black
    // ];

    // const salesPipelineData = [
    //     { stage: 'Market Research', deals: 30, totalValue: 50000, status: 'In Progress' },
    //     { stage: 'Team Outreach', deals: 20, totalValue: 40000, status: 'Pending' },
    //     { stage: 'Opportunity Review', deals: 15, totalValue: 35000, status: 'Completed' },
    //     { stage: 'Strategy Deployment', deals: 10, totalValue: 30000, status: 'Pending' },
    //     { stage: 'Deal Support', deals: 5, totalValue: 25000, status: 'Completed' },
    //     { stage: 'Closed Deals', deals: 20, totalValue: 25000, status: 'In Progress' },
    // ];


      const pipelineData = [
        { name: 'Lead Generation', value: 30, fillColor: '#FFA07A' }, // Light Salmon
        { name: 'Contact Made', value: 20, fillColor: '#FFD700' }, // Gold
        { name: 'Qualification', value: 15, fillColor: '#32CD32' }, // Lime Green
        { name: 'Proposal Sent', value: 10, fillColor: '#1E90FF' }, // Dodger Blue
        { name: 'Negotiation', value: 5, fillColor: '#FF4500' }, // Orange Red
        { name: 'Closed-Won', value: 20, fillColor: '#9400D3' }, // Dark Violet
    ];

    const salesPipelineData = [
        { stage: 'Lead Generation', deals: 30, totalValue: 50000, status: 'In Progress' },
        { stage: 'Contact Made', deals: 20, totalValue: 40000, status: 'Pending' },
        { stage: 'Qualification', deals: 15, totalValue: 35000, status: 'Completed' },
        { stage: 'Negotiation', deals: 10, totalValue: 30000, status: 'Pending' },
        { stage: 'Proposal Sent', deals: 5, totalValue: 25000, status: 'Completed' },
        { stage: 'Closed-Won', deals: 20, totalValue: 25000, status: 'In Progress' },
    ];


    const sampleData = [
        {
            id: 1,
            name: 'John Smith',
            opportunity: 'Opportunity A',
            created_on: '11-12-2015',
            created_by: 'John Doe',
            lastStatus: 'New',
            assigned: 'Alice',
            value: '$5,000',
        },
        {
            id: 2,
            name: 'Emma Johnson',
            opportunity: 'Opportunity B',
            created_on: '10-12-2016',
            created_by: 'Jane Smith',
            lastStatus: 'Contacted',
            assigned: 'Bob',
            value: '$3,200',
        },
        {
            id: 3,
            name: 'Noah Wilson',
            opportunity: 'Opportunity C',
            created_on: '11-12-2015',
            created_by: 'Emily Johnson',
            lastStatus: 'Qualified',
            assigned: 'Charlie',
            value: '$7,800',
        },
        {
            id: 4,
            name: 'Olivia Lee',
            opportunity: 'Opportunity D',
            created_on: '10-12-2016',
            created_by: 'Michael Brown',
            lastStatus: 'Disqualified',
            assigned: 'David',
            value: '$2,500',
        },
        {
            id: 5,
            name: 'Ethan Brown',
            opportunity: 'Opportunity E',
            created_on: '11-12-2014',
            created_by: 'Sarah Davis',
            lastStatus: 'Follow-Up',
            assigned: 'Ella',
            value: '$6,200',
        },
        {
            id: 6,
            name: 'Sophia Miller',
            opportunity: 'Opportunity F',
            created_on: '11-12-2015',
            created_by: 'Chris Lee',
            lastStatus: 'Converted',
            assigned: 'Frank',
            value: '$10,000',
        },
        {
            id: 7,
            name: 'Browny',
            opportunity: 'Opportunity G',
            created_on: '11-12-2015',
            created_by: 'Laura White',
            lastStatus: 'New',
            assigned: 'Grace',
            value: '$4,500',
        },
    ];

    // const sampleData = [
    //     {
    //         id: 1,
    //         name: 'Acme Corp',
    //         created_by: 'John Doe',
    //         opportunity: 'Website Redesign',
    //         domain: 'Technology',
    //         created_on: '01-11-2024',
    //         lastStatus: 'New',
    //         callAt: '10-11-2024',
    //         nextCall: '15-11-2024',
    //         followUp: '20-11-2024',
    //         value: 3000,
    //         assigned: 'Jane Smith',
    //     },
    //     {
    //         id: 2,
    //         name: 'Global Tech',
    //         created_by: 'Jane Smith',
    //         opportunity: 'Mobile App Development',
    //         domain: 'Healthcare',
    //         created_on: '15-10-2024',
    //         lastStatus: 'Contacted',
    //         callAt: '20-10-2024',
    //         nextCall: '25-10-2024',
    //         followUp: '05-11-2024',
    //         value: 4000,
    //         assigned: 'John Doe',
    //     },
    //     {
    //         id: 3,
    //         name: 'NextGen Solutions',
    //         created_by: 'Emily Johnson',
    //         opportunity: 'Cloud Migration',
    //         domain: 'Finance',
    //         created_on: '05-09-2024',
    //         lastStatus: 'Qualified',
    //         callAt: '12-09-2024',
    //         nextCall: '18-09-2024',
    //         followUp: '25-09-2024',
    //         value: 7000,
    //         assigned: 'Jane Smith',
    //     },
    //     {
    //         id: 4,
    //         name: 'InnovaSoft',
    //         created_by: 'Michael Brown',
    //         opportunity: 'ERP Implementation',
    //         domain: 'Retail',
    //         created_on: '20-08-2024',
    //         lastStatus: 'Disqualified',
    //         callAt: '25-08-2024',
    //         nextCall: '30-08-2024',
    //         followUp: '05-09-2024',
    //         value: 1000,
    //         assigned: 'Emily Johnson',
    //     },
    //     {
    //         id: 5,
    //         name: 'Prime Enterprises',
    //         created_by: 'Sarah Davis',
    //         opportunity: 'Digital Marketing Campaign',
    //         domain: 'E-commerce',
    //         created_on: '10-07-2024',
    //         lastStatus: 'Follow-Up',
    //         callAt: '15-07-2024',
    //         nextCall: '20-07-2024',
    //         followUp: '25-07-2024',
    //         value: 6000,
    //         assigned: 'Michael Brown',
    //     },
    //     {
    //         id: 6,
    //         name: 'Bright Future Ltd.',
    //         created_by: 'Chris Lee',
    //         opportunity: 'Data Analysis',
    //         domain: 'Education',
    //         created_on: '12-06-2024',
    //         lastStatus: 'Converted',
    //         callAt: '15-06-2024',
    //         nextCall: '20-06-2024',
    //         followUp: '25-06-2024',
    //         value: 9000,
    //         assigned: 'Sarah Davis',
    //     },
    //     {
    //         id: 7,
    //         name: 'Visionary Solutions',
    //         created_by: 'Laura White',
    //         opportunity: 'AI Integration',
    //         domain: 'Manufacturing',
    //         created_on: '01-05-2024',
    //         lastStatus: 'New',
    //         callAt: '05-05-2024',
    //         nextCall: '10-05-2024',
    //         value: 8000,
    //         assigned: 'Chris Lee',
    //     },
    // ];

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
                    <h5 className="text-lg font-semibold ">Leads</h5>
                </div>
                <div className="flex gap-5">
                    <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => router.push('/createLead')}>
                        + Create
                    </button>
                </div>
            </div>
            <div className="pb-2 ">
                <SimpleGrid
                    cols={6}
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
                            <div className="mb-5">{!state.loading && <ReactApexChart series={bitcoin.series} options={bitcoin.options} type="line" height={45} width={'100%'} />}</div>
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
            <div className="panel   flex items-center justify-between ">
                <div className="  flex items-center">
                    {orderFilter?.map((link, index) => (
                        <React.Fragment key={index}>
                            <div
                                onClick={() => {
                                    setState({ orderDateFilter: link });
                                    if (state.orderSubMenu == 'Sales by product') {
                                        setState({ activeAccordion: 'topSellers' });
                                    }
                                }}
                                className={`dark:hover:text-primary-dark hover: px-4 py-2 font-bold ${link == state.orderDateFilter ? 'text-primary' : ' border-gray-300'} border-r`}
                            >
                                {link?.split(' ')?.map((word, i) => (
                                    <React.Fragment key={i}>
                                        <span className="text-md cursor-pointer ">{word}</span>
                                        {i !== link.split(' ').length - 1 && <span className=" "></span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </React.Fragment>
                    ))}
                    <div className="flex items-center   gap-4 pl-5">
                        <div className="">
                            <input
                                type="datetime-local"
                                value={state.orderStartDate}
                                onChange={(e) => {
                                    setState({ orderStartDate: e.target.value });
                                }}
                                id="dateTimeCreated"
                                name="dateTimeCreated"
                                className="form-input"
                                // min={mintDateTime(state.orderStartDate)}
                            />
                        </div>
                        <div className="">
                            <input
                                type="datetime-local"
                                value={state.orderEndDate}
                                onChange={(e) => {
                                    setState({ orderEndDate: e.target.value });
                                }}
                                id="dateTimeCreated"
                                name="dateTimeCreated"
                                className="form-input"
                                // min={mintDateTime(state.orderStartDate)}
                            />
                        </div>
                        <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => router.push('/createLead')}>
                            Go
                        </button>
                    </div>
                </div>

                {/* <button className="btn btn-primary w-full lg:mt-0 lg:w-auto" onClick={() => setState({ isOpen: true })}>
                    <IconFilter />
                </button> */}
            </div>
            <div className="chart-container panel mb-2 mt-2" style={{ height: '400px' }}>
                <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
            </div>
            <div className=" col-span-12 flex flex-col   md:col-span-12  ">
                <div className="panel">
                    <div className="panel flex items-center justify-between pb-3">
                        <div className="relative flex w-full max-w-lg rounded-full border border-gray-300 dark:border-white-dark/30">
                            <button type="submit" className="m-auto flex items-center justify-center px-3 py-2 text-primary ">
                                <IconSearch className="h-6 w-6 font-bold" /> {/* Icon size slightly reduced */}
                            </button>
                            <input
                                type="text"
                                value={state.search}
                                onChange={(e) => setState({ search: e.target.value })}
                                placeholder="Search"
                                className="form-input w-full rounded-r-full border-0 bg-white py-1.5 pl-0 text-sm placeholder:tracking-wide focus:shadow-lg focus:outline-none dark:bg-gray-800 dark:shadow-[#1b2e4b] dark:placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center justify-end pb-2 pr-3 pt-3">
                            <div className="rounded-lg bg-gray-300 p-1 font-semibold">
                                {state.currentPage}-{Math.min(state.currentPage * 10, state.totalRecords)} of {state.totalRecords}
                            </div>
                        </div>
                    </div>

                    <div>
                        <DataTable
                            className="table-responsive"
                            records={sampleData}
                            columns={[
                                {
                                    accessor: 'name',
                                    width: 170,
                                    sortable: true,
                                    title: 'Lead',
                                    render: (row, index) => (
                                        <>
                                            <div className="">{row.name}</div>
                                        </>
                                    ),
                                },
                                
                                { accessor: 'opportunity', title: 'Opportunity', sortable: true },
                                { accessor: 'created_on', title: 'Date', sortable: true },
                                {
                                    accessor: 'created_by',
                                    title: 'Contact Person',
                                    sortable: true,
                                    render: (row: any) => (
                                        <div className="flex items-center gap-2 ">
                                            <Tippy content={'9876543210'} className="rounded-lg bg-black p-1 text-sm text-white">
                                                <button type="button" className="flex hover:text-primary">
                                                    <span className="font-medium text-gray-800 dark:text-white">{row.created_by}</span>
                                                    <IconMobile />
                                                </button>
                                            </Tippy>

                                            {/* <a
                                          href={`tel:${row.phone}`}
                                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                          onClick={(e) => e.stopPropagation()} // Prevents table row click if applicable
                                      >
                                          ({9876543210})
                                      </a> */}
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'lastStatus',
                                    title: 'Last Status',
                                    sortable: true,
                                    render: (row) => (
                                        <div
                                            className={`flex w-max gap-4 rounded-full px-2 py-1 ${
                                                row?.lastStatus === 'New'
                                                    ? 'bg-blue-100 text-blue-800' // Light blue for new entries
                                                    : row?.lastStatus === 'Contacted'
                                                    ? 'bg-yellow-100 text-yellow-800' // Yellow for contacted entries
                                                    : row?.lastStatus === 'Qualified'
                                                    ? 'bg-green-100 text-green-800' // Green for qualified entries
                                                    : row?.lastStatus === 'Disqualified'
                                                    ? 'bg-red-100 text-red-800' // Red for disqualified entries
                                                    : row?.lastStatus === 'Follow-Up'
                                                    ? 'bg-orange-100 text-orange-800' // Orange for follow-ups
                                                    : row?.lastStatus === 'Converted'
                                                    ? 'bg-teal-100 text-teal-800' // Teal for converted entries
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {row?.lastStatus}
                                        </div>
                                    ),
                                },
                                { accessor: 'created_on', title: 'Status Date ', sortable: true },
                                { accessor: 'assigned', title: 'Assigned To', sortable: true },
                                { accessor: 'value', title: 'Value ', sortable: true },
                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (row: any) => (
                                        <div className="mx-auto flex w-max items-center gap-4">
                                            <Tippy content="Quick Edit" className="rounded-lg bg-black p-1 text-sm text-white">
                                                <button
                                                    type="button"
                                                    className="flex hover:text-primary"
                                                    onClick={() => {
                                                        // Toggle row expansion
                                                        state.expandedRow === row.id ? setState({ expandedRow: null }) : setState({ expandedRow: row.id });
                                                    }}
                                                >
                                                    <IconNotesEdit />
                                                </button>
                                            </Tippy>

                                            <button type="button" className="flex hover:text-primary" onClick={() => router.push(`/viewLead?id=${row.id}`)}>
                                                <IconEye />
                                            </button>
                                            <button className="flex hover:text-info" onClick={() => router.push(`/updateLead?id=${row.id}`)}>
                                                <IconEdit className="h-4.5 w-4.5" />
                                            </button>
                                        </div>
                                    ),
                                    style: {
                                        position: 'sticky', // Sticky position
                                        right: 0, // Fix to the right side
                                        background: '#fff', // Background color for better visibility
                                        zIndex: 2, // Ensure it's above other elements
                                    },
                                },

                                // {
                                //     accessor: 'tags',
                                //     width: 150,
                                //     sortable: true,
                                //     render: (row, index) => (
                                //         <>
                                //             {row.tags?.length > 0 && (
                                //                 <Tippy
                                //                     content={
                                //                         <div className="rounded-lg bg-white p-2 text-sm shadow-lg">
                                //                             {row.tags.map((item, index) => (
                                //                                 <div key={index} className="p-0.5">
                                //                                     <Chip label={item.tag} />
                                //                                 </div>
                                //                             ))}
                                //                         </div>
                                //                     }
                                //                 >
                                //                     <div className="flex gap-2 p-0.5">{row.tags[0]?.tag}</div>
                                //                 </Tippy>
                                //             )}
                                //         </>
                                //     ),
                                // },
                                // { accessor: 'annual_revenue', title: 'Annual Revenue', sortable: true },
                                // { accessor: 'lead_owner', title: 'Lead Owner', sortable: true },
                                // { accessor: 'country', width: '120px', sortable: true },
                                // { accessor: 'state', title: 'State', sortable: true },
                            ]}
                            // sortStatus={sortStatus}

                            // columns={[
                            //     {
                            //         accessor: 'name',
                            //         sortable: true,
                            //         title: 'Company',
                            //         render: (row, index) => (
                            //             <>
                            //                 <div className="">{row.name}</div>
                            //             </>
                            //         ),
                            //     },

                            //     {
                            //         accessor: 'created_by',
                            //         title: 'Contact',
                            //         width: '140px',
                            //         sortable: true,
                            //         render: (row: any) => (
                            //             <div className="flex  gap-2 ">
                            //                 <Tippy content={'9876543210'} className="rounded-lg bg-black p-1 text-sm text-white">
                            //                     <button type="button" className="flex hover:text-primary">
                            //                         <span className="font-medium text-gray-800 dark:text-white">{row.created_by}</span>
                            //                         <IconMobile />
                            //                     </button>
                            //                 </Tippy>

                            //                 {/* <a
                            //                   href={`tel:${row.phone}`}
                            //                   className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                            //                   onClick={(e) => e.stopPropagation()} // Prevents table row click if applicable
                            //               >
                            //                   ({9876543210})
                            //               </a> */}
                            //             </div>
                            //         ),
                            //     },
                            //     { accessor: 'opportunity', title: 'Communication', sortable: true },

                            //     { accessor: 'domain', title: 'Domain', sortable: true },

                            //     { accessor: 'created_on', title: 'Date', sortable: true, width: 120 },
                            //     {
                            //         accessor: 'lastStatus',
                            //         title: 'Last Status',
                            //         sortable: true,
                            //         render: (row) => (
                            //             <div
                            //                 className={`flex w-max gap-4 rounded-full px-2 py-1 ${
                            //                     row?.lastStatus === 'New'
                            //                         ? 'bg-blue-100 text-blue-800' // Light blue for new entries
                            //                         : row?.lastStatus === 'Contacted'
                            //                         ? 'bg-yellow-100 text-yellow-800' // Yellow for contacted entries
                            //                         : row?.lastStatus === 'Qualified'
                            //                         ? 'bg-green-100 text-green-800' // Green for qualified entries
                            //                         : row?.lastStatus === 'Disqualified'
                            //                         ? 'bg-red-100 text-red-800' // Red for disqualified entries
                            //                         : row?.lastStatus === 'Follow-Up'
                            //                         ? 'bg-orange-100 text-orange-800' // Orange for follow-ups
                            //                         : row?.lastStatus === 'Converted'
                            //                         ? 'bg-teal-100 text-teal-800' // Teal for converted entries
                            //                         : 'bg-gray-100 text-gray-800'
                            //                 }`}
                            //             >
                            //                 {row?.lastStatus}
                            //             </div>
                            //         ),
                            //     },
                            //     { accessor: 'created_on', title: 'Follow up ', sortable: true, width: 120 },
                            //     { accessor: 'assigned', title: 'Assigned to', sortable: true },
                            //     { accessor: 'value', title: 'Value', sortable: true },

                            //     {
                            //         accessor: 'actions',
                            //         title: 'Actions',
                            //         render: (row: any) => (
                            //             <div className="mx-auto flex w-max items-center gap-4">
                            //                 <Tippy content="Quick Edit" className="rounded-lg bg-black p-1 text-sm text-white">
                            //                     <button
                            //                         type="button"
                            //                         className="flex hover:text-primary"
                            //                         onClick={() => {
                            //                             // Toggle row expansion
                            //                             state.expandedRow === row.id ? setState({ expandedRow: null }) : setState({ expandedRow: row.id });
                            //                         }}
                            //                     >
                            //                         <IconNotesEdit />
                            //                     </button>
                            //                 </Tippy>

                            //                 <button type="button" className="flex hover:text-primary" onClick={() => router.push(`/viewLead?id=${row.id}`)}>
                            //                     <IconEye />
                            //                 </button>
                            //                 <button className="flex hover:text-info" onClick={() => router.push(`/updateLead?id=${row.id}`)}>
                            //                     <IconEdit className="h-4.5 w-4.5" />
                            //                 </button>
                            //             </div>
                            //         ),
                            //         style: {
                            //             position: 'sticky', // Sticky position
                            //             right: 0, // Fix to the right side
                            //             background: '#fff', // Background color for better visibility
                            //             zIndex: 2, // Ensure it's above other elements
                            //         },
                            //     },
                            // ]}
                            highlightOnHover
                            totalRecords={state.data?.length}
                            recordsPerPage={state.pageSize}
                            minHeight={200}
                            page={null}
                            onPageChange={(p) => {}}
                            withBorder={true}
                            styles={{
                                root: {
                                    overflowX: 'auto', // Enable horizontal scroll
                                },
                            }}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                            rowExpansion={{
                                collapseProps: {
                                    transitionDuration: 500,
                                    animateOpacity: false,
                                    transitionTimingFunction: 'ease-out',
                                },
                                allowMultiple: false,
                                content: ({ record, collapse }) =>
                                    state.expandedRow === record.id ? (
                                        <div>
                                            <QuickEdit collapse={() => collapse()} />
                                        </div>
                                    ) : null,
                            }}
                        />
                    </div>
                    
                    <div className="mt-5 flex justify-end gap-3">
                        <button disabled={!state.previous} onClick={handlePreviousPage} className={`btn ${!state.previous ? 'btn-disabled' : 'btn-primary'}`}>
                            <IconArrowBackward />
                        </button>
                        <button disabled={!state.next} onClick={handleNextPage} className={`btn ${!state.next ? 'btn-disabled' : 'btn-primary'}`}>
                            <IconArrowForward />
                        </button>
                    </div>
                </div>

                <div className="panel   mt-3 flex items-center justify-between">
                    <div className="  flex items-center">
                        {orderFilter?.map((link, index) => (
                            <React.Fragment key={index}>
                                <div
                                    onClick={() => {
                                        setState({ orderDateFilter: link });
                                        if (state.orderSubMenu == 'Sales by product') {
                                            setState({ activeAccordion: 'topSellers' });
                                        }
                                    }}
                                    className={`dark:hover:text-primary-dark hover: px-4 py-2 font-bold ${link == state.orderDateFilter ? 'text-primary' : ' border-gray-300'} border-r`}
                                >
                                    {link?.split(' ')?.map((word, i) => (
                                        <React.Fragment key={i}>
                                            <span className="text-md cursor-pointer">{word}</span>
                                            {i !== link.split(' ').length - 1 && <span className=" "></span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </React.Fragment>
                        ))}
                        <div className="flex items-center   gap-4 pl-5">
                            <div className="">
                                <input
                                    type="datetime-local"
                                    value={state.orderStartDate}
                                    onChange={(e) => {
                                        setState({ orderStartDate: e.target.value });
                                    }}
                                    id="dateTimeCreated"
                                    name="dateTimeCreated"
                                    className="form-input"
                                    // min={mintDateTime(state.orderStartDate)}
                                />
                            </div>
                            <div className="">
                                <input
                                    type="datetime-local"
                                    value={state.orderEndDate}
                                    onChange={(e) => {
                                        setState({ orderEndDate: e.target.value });
                                    }}
                                    id="dateTimeCreated"
                                    name="dateTimeCreated"
                                    className="form-input"
                                    // min={mintDateTime(state.orderStartDate)}
                                />
                            </div>
                            <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => router.push('/createLead')}>
                                Go
                            </button>
                        </div>
                    </div>
                    {/* <button className="btn btn-primary w-full lg:mt-0 lg:w-auto" onClick={() => setState({ isOpen: true })}>
                                        <IconFilter />
                                    </button> */}
                </div>
                <div className="mt-2 flex h-[410px] flex-wrap gap-5">
                    <div className="panel flex h-[400px] w-full flex-col items-center  justify-center p-3">
                        <div className="mb-2 flex w-full items-center  gap-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Sales Pipeline Stages</h5>
                        </div>
                        <Funnel data={pipelineData} />
                        {/* <ReactApexChart series={stageChart.series} options={stageChart.options} className="rounded-lg bg-white dark:bg-black" type="pie" height={300} width={'100%'} /> */}
                    </div>
                </div>
                <div className=" panel">
                    <DataTable
                        className="table-responsive"
                        records={salesPipelineData}
                        columns={[
                            {
                                accessor: 'stage',
                                title: 'Stage',
                                width: 100,
                            },
                            {
                                accessor: 'deals',
                                title: 'Number of Deals',
                                render: (row: any) => <div className="flex items-center">{row.deals}</div>,
                                width: 100,
                            },
                            {
                                accessor: 'totalValue',
                                title: 'Total Value ($)',
                                render: (record) => record.totalValue.toLocaleString(), // Format number
                                width: 100,
                            },
                            {
                                accessor: 'status',
                                title: 'Status',
                                render: (record) => getStatusBadge(record.status), // Render Badge
                                width: 100,
                            },
                        ]}
                        // sortStatus={sortStatus}
                        // onSortStatusChange={setSortStatus}
                        highlightOnHover
                        totalRecords={state.data?.length}
                        recordsPerPage={state.pageSize}
                        minHeight={200}
                        page={null}
                        onPageChange={(p) => {}}
                        withBorder={true}
                        styles={{
                            root: {
                                overflowX: 'auto', // Enable horizontal scroll
                            },
                        }}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        rowExpansion={{
                            collapseProps: {
                                transitionDuration: 500,
                                animateOpacity: false,
                                transitionTimingFunction: 'ease-out',
                            },
                            allowMultiple: false,
                            content: ({ record, collapse }) =>
                                state.expandedRow === record.id ? (
                                    <div>
                                        <QuickEdit collapse={() => collapse()} />
                                    </div>
                                ) : null,
                        }}
                    />
                </div>
                <div className="mt-5 flex justify-end gap-3">
                    <button disabled={!state.previous} onClick={handlePreviousPage} className={`btn ${!state.previous ? 'btn-disabled' : 'btn-primary'}`}>
                        <IconArrowBackward />
                    </button>
                    <button disabled={!state.next} onClick={handleNextPage} className={`btn ${!state.next ? 'btn-disabled' : 'btn-primary'}`}>
                        <IconArrowForward />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;
