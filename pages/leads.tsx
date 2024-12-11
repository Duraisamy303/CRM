import IconBitcoin from '@/components/Icon/IconBitcoin';
import IconFilter from '@/components/Icon/IconFilter';
import IconSearch from '@/components/Icon/IconSearch';
import CustomSelect from '@/components/Select';
import { Dropdown, filterByDates, getDateRange, objIsEmpty, useSetState } from '@/utils/functions.utils';
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
import Models from '@/imports/models.import';
import { ROLE } from '@/utils/constant.utils';
import { PrivateRouter } from '@/utils/imports.utils';

const Index = () => {
    const ReactApexChart = dynamic(() => import('react-apexcharts'), {
        ssr: false,
    });

    const router = useRouter();

    const [state, setState] = useSetState({
        state: [],
        activeTab: 'This Month',
        loading: false,
        chartData: {},
        role: '',
        currentPage: 1,
        totalRecords: 0,
        next: null,
        previous: null,
        search: '',
    });

    useEffect(() => {
        getAllData(state.currentPage)
        console.log(state.currentPage);
        
        getData();
        userData();
    }, []);

    useEffect(() => {
        if (state.activeTab == 'Custom') {
            // filterData();
        } else {
            getData();
            // getAllData(state.currentPage)
        }
    }, [state.activeTab]);

    const getAllData = async (page = 1) => {
        try {
            console.log(page);
            
            setState({ loading: true });
            const response: any = await Models.lead.list(page);
            setState({ range: [0, response.max_revenue], maxPrice: response.max_revenue });
            tableData(response?.results);
            console.log(response.results);
            setState({
                loading: false,
                totalRecords: response.count,
                next: response.next,
                previous: response.previous,
            });
        } catch (error) {
            setState({ loading: false });
        }
    };



    


    const tableData = (res) => {
        const data = res?.map((item) => {
            return {
                ...item,
                name: item.name,
                opportunity: item.opportunities?.[0]?.name ,
                created_on: item.created_on,
                created_by: item.created_by?.username || 'Unknown',
                assigned: item.assigned_to?.username || 'Unassigned',
                lastStatus: item.lead_status?.name || 'No Status',
                leadSource: item.lead_source?.source || 'Unknown',
                followUp: item.created_on,
            };
        });

        setState({ data: data });
    };



    const getData = async () => {
        // const res = await Models.lead.list(1);
        try {
            let res;
            if (state.activeTab === 'Year') {
                res = filterByDates('Year');
            } else if (state.activeTab === 'Last Month') {
                res = filterByDates('Last Month');
            } else if (state.activeTab === 'This Month') {
                res = filterByDates('This Month');
            } else if (state.activeTab === 'Last 7 Days') {
                res = filterByDates('Last 7 Days');
            }
            console.log('res: ', res);

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

    const userData = async () => {
        try {
            // setState({ loading: true });
            const res: any = await Models.auth.userDetails();
            setState({ role: res?.designation });
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



    const handleNextPage = () => {
        console.log(state.next);
        
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
            activeTab: 'This Month',
        });
        getData();
    };

    const filterData = async (page = 1) => {
        try {
            setState({ loading: true });
            let body = bodyData();
            if (!objIsEmpty(body)) {
                const response: any = await Models.lead.filter(body, page);

                // tableData(response?.results, state.role);

                setState({
                    loading: false,
                    totalRecords: response.count,
                    next: response.next,
                    previous: response.previous,
                    isOpen: false,
                });
            } else {
                getData();
                setState({
                    loading: false,

                    isOpen: false,
                });
            }
        } catch (error) {
            setState({ loading: false });
        }
    };

    const bodyData = () => {
        let body: any = {};

        if (state.search) {
            body.key = state.search;
        }
        if (state.vertical) {
            body.vertical_id = [state.vertical?.value];
        }
        if (state.focus) {
            body.focus_segment = [state.focus?.value];
        }
        if (state.market) {
            body.market_segment = [state.market?.value];
        }
        if (state.country) {
            body.country_id = [state.country?.value];
        }
        if (state.state) {
            body.state_id = [state.state?.value];
        }
        if (state.range[0] > 0 || state.range[1] != state.maxPrice) {
            (body.min_revenue = state.range[0]), (body.max_revenue = state.range[1]);
        }
        if (state.tags?.length > 0) {
            body.tags = state.tags?.map((item) => item?.value);
        }

        return body;
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
                <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => clearFilter()}>
                    Clear
                </button>
                {/* <button className="btn btn-primary w-full lg:mt-0 lg:w-auto" onClick={() => setState({ isOpen: true })}>
                    <IconFilter />
                </button> */}
            </div>
            <div className="chart-container panel mb-2 mt-2">
                {!state.loading && <ReactApexChart series={state.chartData.series} options={state.chartData.options} type="bar" height={400} width={'100%'} />}
            </div>

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
                    {ROLE.ADMIN == state.role && (
                        <>
                            <CustomSelect
                                options={state.marketList}
                                value={state.bdm}
                                onChange={(e) => setState({ bdm: e })}
                                isMulti={false}
                                placeholder="BDM"
                            // className="w-full lg:w-1/3"
                            />
                            <CustomSelect
                                options={state.marketList}
                                value={state.bde}
                                onChange={(e) => setState({ bde: e })}
                                isMulti={false}
                                placeholder="BDE"
                            // className="w-full lg:w-1/3"
                            />
                        </>
                    )}
                    {ROLE.BDM == state.role && (
                        <CustomSelect
                            options={state.marketList}
                            value={state.bde}
                            onChange={(e) => setState({ bde: e })}
                            isMulti={false}
                            placeholder="BDE"
                        // className="w-full lg:w-1/3"
                        />
                    )}

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
                    records={state.data}
                    columns={[

                        ...(state.role !== "TM" ? [
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
                            }] : []),

                        ...(state.role === "TM"
                            ? [
                                {
                                    accessor: 'name',
                                    sortable: true,
                                    title: 'Company',
                                    render: (row, index) => (
                                        <>
                                            <div className="">{row.name}</div>
                                        </>
                                    ),
                                },
                            ]
                            : []),

                        ...(state.role !== "TM"
                            ? [
                                { accessor: 'opportunity', title: 'Opportunity', sortable: true }
                            ] : []),

                        { accessor: 'created_on', title: 'Date', sortable: true },

                        {
                            accessor: 'created_by',
                            title: 'Contact Person',
                            sortable: true,
                            render: (row: any) => {
                                console.log("createdby...", row.created_by);

                                return (
                                    <div className="flex items-center gap-2 ">
                                        <Tippy content={'9876543210'} className="rounded-lg bg-black p-1 text-sm text-white">
                                            <button type="button" className="flex hover:text-primary">
                                                <span className="font-medium text-gray-800 dark:text-white">
                                                    {row.created_by}
                                                </span>
                                                <IconMobile />
                                            </button>
                                        </Tippy>

                                        {/* Example of an alternative way to display the phone number */}
                                        {/* <a
                                    href={`tel:${row.phone}`}
                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                    onClick={(e) => e.stopPropagation()} // Prevents table row click if applicable
                                  >
                                    ({9876543210})
                                  </a> */}
                                    </div>
                                );
                            },
                        },

                        ...(state.role === "TM"
                            ? [
                                {
                                    accessor: 'leadSource',
                                    title: 'Source',
                                    sortable: true,
                                    render: (row, index) => (
                                        <>
                                            <div className="">{row.lead_source}</div>
                                        </>
                                    ),
                                },
                            ]
                            : []),

                        {
                            accessor: 'lastStatus',
                            title: 'Last Status',
                            sortable: true,
                            render: (row) => (
                                <div
                                    className={`flex w-max gap-4 rounded-full px-2 py-1 ${row?.lastStatus === 'New'
                                        ? 'bg-blue-100 text-blue-800'
                                        : row?.lastStatus === 'Contacted'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : row?.lastStatus === 'Qualified'
                                                ? 'bg-green-100 text-green-800'
                                                : row?.lastStatus === 'Disqualified'
                                                    ? 'bg-red-100 text-red-800'
                                                    : row?.lastStatus === 'Follow-Up'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : row?.lastStatus === 'Converted'
                                                            ? 'bg-teal-100 text-teal-800'
                                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {row?.lastStatus || 'Unknown'}
                                </div>
                            ),
                        },


                        ...(state.role === "DM" || state.role === "ADMIN" || state.role === "BDE"
                            ? [
                                { accessor: 'statusDate', title: 'Status Date', sortable: true },
                            ] :
                            []),

                        ...(state.role === "TM" || state.role === "BDM" || state.role === "BDE"
                            ? [
                                { accessor: 'followUp', title: 'Follow up  ', sortable: true },
                            ] :
                            []),


                        // { accessor: 'created_on', title: 'Follow up  ', sortable: true },
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
                        },
                        //     accessor: 'tags',

                    ]}
                    // sortStatus={sortStatus}


                    highlightOnHover
                    totalRecords={state.data?.length}
                    recordsPerPage={state.pageSize}
                    minHeight={200}
                    page={null}
                    onPageChange={(p) => { }}
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
                            <CustomeDatePicker error={state.errors?.closing_date} value={state.opp_closing_date} placeholder="Date" title="Date" onChange={(e) => setState({ opp_closing_date: e })} />
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

                            {/*CustomSelect  */}

                        </div>
                    </div>
                )}
            />
        </div>
    );
};
export default PrivateRouter(Index);





