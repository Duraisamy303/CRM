import IconBitcoin from '@/components/Icon/IconBitcoin';
import IconFilter from '@/components/Icon/IconFilter';
import IconSearch from '@/components/Icon/IconSearch';
import CustomSelect from '@/components/Select';
import { useSetState } from '@/utils/functions.utils';
import { SimpleGrid } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { DataTable } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import IconMobile from '@/components/Icon/IconMobile';
import IconNotesEdit from '@/components/Icon/IconNotesEdit';
import IconEye from '@/components/Icon/IconEye';
import IconEdit from '@/components/Icon/IconEdit';
import QuickEdit from '@/components/QuickEdit';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import SideMenu from '@/common_component/sideMenu';
import CustomeDatePicker from '@/common_component/datePicker';

export default function index() {
    const ReactApexChart = dynamic(() => import('react-apexcharts'), {
        ssr: false,
    });

    const router = useRouter();

    const [state, setState] = useSetState({
        activeTab: 'This Month',
        loading: false,
        chartData: {},
    });

    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            setState({ loading: true });

            const options = {
                series: [
                    {
                        name: 'Month',
                        data: TeleData.map((data) => data.monthCount), // Flattened data for Month Count
                    },
                    {
                        name: 'Today',
                        data: TeleData.map((data) => data.todayCount), // Flattened data for Today Count
                    },
                ],
                options: {
                    chart: {
                        height: 350, // Adjust the height for the bar chart
                        type: 'bar', // Define the chart type
                        sparkline: {
                            enabled: false, // Not using sparkline here, as it's a bar chart
                        },
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            endingShape: 'rounded',
                        },
                    },
                    stroke: {
                        width: 2,
                        colors: ['transparent'],
                    },
                    xaxis: {
                        categories: TeleData.map((data) => data.title), // Categories for the x-axis
                    },
                    yaxis: {
                        title: {
                            text: 'Count',
                        },
                    },
                    colors: ['#00E396', '#008FFB'], // Colors for the bars
                    tooltip: {
                        y: {
                            formatter: (val: number) => {
                                if (val === undefined || val === null) {
                                    return 'N/A';
                                }
                                return val.toString();
                            },
                        },
                    },
                    responsive: [
                        {
                            breakPoint: 576,
                            options: {
                                chart: {
                                    height: 300, // Adjust for smaller screens
                                },
                            },
                        },
                    ],
                },
            };
            setState({ loading: false, chartData: options });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const orderFilter = ['Year', 'Last Month', 'This Month', 'Last 7 Days', 'Custom'];

    const BDMData = [
        { title: 'Leads', monthCount: 150, todayCount: 25, icon: '🔗', name1: 'Today', name2: 'Month' },
        { title: 'Calls', monthCount: 150, todayCount: 300, icon: '📞', name1: 'Today', name2: 'Month' },
        { title: 'Opportunity', monthCount: 150, todayCount: 300, icon: '💰', name1: 'Today', name2: 'Month' },
        { title: 'Appoinments', monthCount: 150, todayCount: 2, icon: '👨‍💼', name1: 'Today', name2: 'Month' },
        { title: 'Proposals', monthCount: 150, todayCount: 3, icon: '⏳', name1: 'Month', name2: 'Target' },
        { title: 'Closures', monthCount: 150, todayCount: 300, icon: '💵', name1: 'Month', name2: 'Target' },
    ];

    const TeleData = [
        { title: 'Calls', monthCount: 150, todayCount: 250, icon: '🔗', name1: 'Today', name2: 'Month' },
        { title: 'Opportunities', monthCount: 150, todayCount: 300, icon: '💰', name1: 'Today', name2: 'Month' },
        { title: 'Appoinments', monthCount: 150, todayCount: 200, icon: '👨‍💼', name1: 'Today', name2: 'Month' },
        { title: 'Proposals', monthCount: 150, todayCount: 300, icon: '⏳', name1: 'Month', name2: 'Target' },
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

    const sampleData = [
        {
            id: 1,
            name: 'John Smith',
            opportunity: 'Opportunity A',
            created_on: '11-12-2015',
            created_by: 'John Doe',
            lastStatus: 'New',
            assigned: 'Alice',
            value: '5,000',
        },
        {
            id: 2,
            name: 'Emma Johnson',
            opportunity: 'Opportunity B',
            created_on: '10-12-2016',
            created_by: 'Jane Smith',
            lastStatus: 'Contacted',
            assigned: 'Bob',
            value: '3,200',
        },
        {
            id: 3,
            name: 'Noah Wilson',
            opportunity: 'Opportunity C',
            created_on: '11-12-2015',
            created_by: 'Emily Johnson',
            lastStatus: 'Qualified',
            assigned: 'Charlie',
            value: '7,800',
        },
        {
            id: 4,
            name: 'Olivia Lee',
            opportunity: 'Opportunity D',
            created_on: '10-12-2016',
            created_by: 'Michael Brown',
            lastStatus: 'Disqualified',
            assigned: 'David',
            value: '2,500',
        },
        {
            id: 5,
            name: 'Ethan Brown',
            opportunity: 'Opportunity E',
            created_on: '11-12-2014',
            created_by: 'Sarah Davis',
            lastStatus: 'Follow-Up',
            assigned: 'Ella',
            value: '6,200',
        },
        {
            id: 6,
            name: 'Sophia Miller',
            opportunity: 'Opportunity F',
            created_on: '11-12-2015',
            created_by: 'Chris Lee',
            lastStatus: 'Converted',
            assigned: 'Frank',
            value: '10,000',
        },
        {
            id: 7,
            name: 'Browny',
            opportunity: 'Opportunity G',
            created_on: '11-12-2015',
            created_by: 'Laura White',
            lastStatus: 'New',
            assigned: 'Grace',
            value: '4,500',
        },
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

    const clearFilter = () => {
        setState({
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
            range: [0, state.maxPrice],
            tags: [],
        });
        getData();
    };

    const filterData = async (page = 1) => {
        try {
            // setState({ loading: true });
            // let body = bodyData();
            // if (!objIsEmpty(body)) {
            //     const response: any = await Models.lead.filter(body, page);

            //     tableData(response?.results, state.role);

            //     setState({
            //         loading: false,
            //         totalRecords: response.count,
            //         next: response.next,
            //         previous: response.previous,
            //         isOpen: false,
            //     });
            // } else {
            //     getData();
            //     setState({
            //         loading: false,

            //         isOpen: false,
            //     });
            // }
        } catch (error) {
            setState({ loading: false });
        }
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
            <div className="panel   flex items-center justify-between ">
                <div className="  flex items-center">
                    {orderFilter?.map((link, index) => (
                        <React.Fragment key={index}>
                            <div
                                onClick={() => {
                                    setState({ activeTab: link });
                                }}
                                className={`dark:hover:text-primary-dark hover: px-4 py-2 font-bold ${link == state.activeTab ? 'text-primary' : ' border-gray-300'} border-r`}
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
            <div className="chart-container panel mb-2 mt-2">{!state.loading && <ReactApexChart series={state.chartData.series} options={state.chartData.options} type="bar" height={400} width={'100%'} />}</div>

            <div className="panel mt-2 flex flex-col items-center justify-between gap-5 lg:flex-row">
                <div className="relative flex w-full max-w-lg rounded-full border border-gray-300 dark:border-white-dark/30 lg:w-1/3">
                    <button type="submit" className="m-auto flex items-center justify-center px-3 py-2 text-primary">
                        <IconSearch className="h-6 w-6 font-bold" />
                    </button>
                    <input
                        type="text"
                        value={state.search}
                        onChange={(e) => setState({ search: e.target.value })}
                        placeholder="Search"
                        className="form-input w-full rounded-r-full border-0 bg-white py-1.5 pl-0 text-sm placeholder:tracking-wide focus:shadow-lg focus:outline-none dark:bg-gray-800 dark:shadow-[#1b2e4b] dark:placeholder:text-gray-400"
                    />
                </div>
                <div className="flex w-full flex-col gap-4 lg:w-2/3 lg:flex-row">
                    {/* <CustomSelect
                                options={state.marketList}
                                value={state.market}
                                onChange={(e) => setState({ market: e })}
                                isMulti={false}
                                placeholder="Owner"
                                //    className="w-full lg:w-1/3"
                            /> */}

                    {/* <CustomSelect
                        options={state.marketList}
                        value={state.market}
                        onChange={(e) => setState({ market: e })}
                        isMulti={false}
                        placeholder="BDM"
                        // className="w-full lg:w-1/3"
                    /> */}

                    {/* <CustomSelect
                        options={state.marketList}
                        value={state.market}
                        onChange={(e) => setState({ market: e })}
                        isMulti={false}
                        placeholder="BDE"
                        // className="w-full lg:w-1/3"
                    /> */}
                    <CustomSelect
                        options={state.marketList}
                        value={state.market}
                        onChange={(e) => setState({ market: e })}
                        isMulti={false}
                        placeholder="Status"
                        // className="w-full lg:w-1/3"
                    />
                    <CustomeDatePicker
                                    error={state.errors?.closing_date}
                                    value={state.opp_closing_date}
                                    placeholder="Date"
                                    // title="Date"
                                    onChange={(e) => setState({ opp_closing_date: e })}
                                />
                    {/* <CustomeDatePicker value={state.start_date} placeholder="Owner" onChange={(e) => setState({ start_date: e, to_date: null })} className="w-full lg:w-1/3" />
                            <CustomeDatePicker value={state.end_date} placeholder="BDM"  onChange={(e) => setState({ end_date: e })} className="w-full lg:w-1/3" />
                            <CustomeDatePicker value={state.end_date} placeholder="BDE"  onChange={(e) => setState({ end_date: e })} className="w-full lg:w-1/3" /> */}
                    <button className="btn btn-primary lg:mt-0" onClick={() => setState({ isOpen: true })}>
                        <IconFilter />
                    </button>
                </div>
            </div>

            <div className="pb-2 pt-2">
                <SimpleGrid
                    cols={5}
                    spacing="sm"
                    breakpoints={[
                        { maxWidth: 768, cols: 2 },
                        { maxWidth: 576, cols: 1 },
                    ]}
                >
                    {TeleData.map((card, index) => (
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
                            <div className="mb-5">{state.loading && <ReactApexChart series={bitcoin.series} options={bitcoin.options} type="line" height={45} width={'100%'} />}</div>
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
                        { accessor: 'created_on', title: 'Follow up  ', sortable: true },
                        { accessor: 'assigned', title: 'Assigned To', sortable: true },
                        // { accessor: 'value', title: 'Value ', sortable: true },
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
                    //                           href={`tel:${row.phone}`}
                    //                           className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    //                           onClick={(e) => e.stopPropagation()} // Prevents table row click if applicable
                    //                       >
                    //                           ({9876543210})
                    //                       </a> */}
                    //             </div>
                    //         ),
                    //     },
                    //     { accessor: 'opportunity', title: 'Communication', sortable: true },

                    //     { accessor: 'domain', title: 'Domain', sortable: true,render: (row, index) => (
                    //         <>
                    //             <div className="">Web</div>
                    //         </>
                    //     ), },

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
            <SideMenu
                    title="Filter"
                    open={state.isOpen}
                    close={() => setState({ isOpen: false })}
                    cancelOnClick={() => clearFilter()}
                    submitOnClick={() => filterData(state.currentPage)}
                    submitLoading={state.loading}
                    canceTitle="Reset"
                    renderComponent={() => (
                        <div>
                            <div className=" mb-5 mt-5 flex flex-col gap-4 md:mt-0  md:justify-between">
                                <CustomeDatePicker
                                    error={state.errors?.closing_date}
                                    value={state.opp_closing_date}
                                    placeholder="Date"
                                    title="Date"
                                    onChange={(e) => setState({ opp_closing_date: e })}
                                />
                                <CustomSelect
                                    title="Opportunity"
                                    value={state.tags}
                                    isMulti={true}
                                    onChange={(e) => setState({ tags: e })}
                                    placeholder={'Opportunity'}
                                    options={state.tagList}
                                    error={state.errors?.tags}
                                />
                                <CustomSelect
                                    title="Status"
                                    value={state.tags}
                                    isMulti={true}
                                    onChange={(e) => setState({ tags: e })}
                                    placeholder={'Status'}
                                    options={state.tagList}
                                    error={state.errors?.tags}
                                />
                                {/* <CustomSelect
                                    options={state.countryList}
                                    value={state.country}
                                    onChange={(e) => {
                                        if (e) {
                                            stateList(e);
                                        }
                                        setState({ country: e, state: '' });
                                    }}
                                    isMulti={false}
                                    placeholder={'Country'}
                                    title={'Country'}
                                />

                                <CustomSelect options={state.stateList} value={state.state} onChange={(e) => setState({ state: e })} isMulti={false} placeholder={'State'} title={'State'} /> */}
                                {/* <div id="" className="">
                                    <label className="text-md mb-2 block font-bold text-gray-700">Annual Revenue</label>
                                    <div id="" className="p-2">
                                        <InputRange STEP={1} MIN={0} MAX={state.maxPrice} values={state.range} handleChanges={(data) => setState({ range: data })} />
                                    </div>
                                    <div className="mt-2 flex w-full items-center justify-between">
                                        <span className="">{state?.range[0] ? roundOff(state?.range[0]) : 0}</span>
                                        <span className="">{state?.range[1] ? roundOff(state?.range[1]) : roundOff(state.maxPrice)}</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    )}
                />
        </div>

        
    );
}
