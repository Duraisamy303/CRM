import { Models, PrivateRouter } from '@/utils/imports.utils';
import React, { useEffect, useState, Fragment } from 'react';
import { Dropdown, Failure, addCommasToNumber, objIsEmpty, useSetState } from '@/utils/functions.utils';
import CommonLoader from './elements/commonLoader';
import IconSearch from '@/components/Icon/IconSearch';
import CustomSelect from '@/components/Select';
import IconFilter from '@/components/Icon/IconFilter';
import Funnel from '@/common_component/funnelChart';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import IconHome from '@/components/Icon/IconHome';
import IconLeads from '@/components/Icon/IconLead';
import SideMenu from '@/common_component/sideMenu';
import CustomeDatePicker from '@/common_component/datePicker';
import moment from 'moment';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
const Reports = () => {
    const [state, setState] = useSetState({
        ownerList: [],
        loading: false,
        countryList: [],
        stateList: [],
        verticalList: [],
        focusList: [],
        marketSegmentList: [],
        funnelData: {},
        reportLead: null,
        reportOpportunity: {},
        reportData: {},
        isMounted: false,
        isOpen: false,
        from_date: null,
        to_date: null,
        activeTab: 'Lead',
        oppRecValue: '',
        oppoValue: '',
        oppoCount: '',
        currentLeadPage: 1,
        hasMoreLead: '',
        leadList: [],
        lead: '',
        isShowOppCount: false,
        isShowOppValue: false,
        isShowOppRec: false,
        isShowIncom: false,
        incommingOpportunity: {},
        leadSource: {},
        isShowLead: false,
        isShowIncomLead: false,
        incomLead: {},
    });

    useEffect(() => {
        verticalList();
        countryList();
        ownerList();
        marketSegmentList();
        leadList();
    }, []);

    useEffect(() => {
        reportOpportunity();
        reportLead();
        funnelChartCount();
    }, []);

    useEffect(() => {
        reportOpportunity(true);
        reportLead(true);
        funnelChartCount(true);
    }, [state.activeTab]);

    const filters = () => {
        let filter = false;
        if (state.vertical || state.focus_segment || state.market_segment || state.country || state.state || state.owner || state.lead || state.from_date || state.to_date) {
            filter = true;
        }
        return filter;
    };

    const countryList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('country');
            const dropdownList = Dropdown(res, 'country_name');
            setState({ countryList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const stateList = async (country) => {
        try {
            setState({ stateLoading: true });
            const res = await Models.lead.stateList(country?.value);
            const dropdownList = Dropdown(res, 'state_name');
            setState({ stateList: dropdownList, stateLoading: false });
        } catch (error) {
            setState({ stateLoading: false });

            console.log('error: ', error);
        }
    };

    const ownerList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('owner');
            const dropdownList = Dropdown(res, 'username');
            setState({ ownerList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const verticalList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('vertical');
            const dropdownList = Dropdown(res, 'vertical');
            setState({ verticalList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const getFocusSegmentList = async (verticalData: any) => {
        try {
            const res: any = await Models.lead.focusIdBasedVericalList(verticalData?.value);
            let focusList: [];
            if (res?.length > 0) {
                focusList = res?.map((item) => ({ value: item?.id, label: item?.focus_segment }));
            }

            setState({ focusList: focusList });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const marketSegmentList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('market_segment');
            const dropdownList = Dropdown(res, 'market_segment');
            setState({ marketSegmentList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const funnelChartCount = async (filter = false) => {
        try {
            setState({ loading: true });
            let body = {};
            if (filter) {
                if (filters()) {
                    body = bodyData();
                }
            }
            const res: any = await Models.report.funnelCount(body);
            const data = [
                { name: 'Lead', value: res?.leads_count },
                { name: 'Opportunity', value: res?.opportunities_count },
                { name: 'S2C', value: res?.s2c_count },
                { name: 'Win', value: res?.win_count },
            ];
            setState({ funnelData: data, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const bodyData = () => {
        let body: any = {};

        if (state.vertical) {
            body.vertical = state.vertical?.value;
        }
        if (state.lead) {
            body.lead = state.lead?.value;
        }
        if (state.focus_segment) {
            body.focus_segment = state.focus_segment?.value;
        }
        if (state.owner) {
            body.owner = state.owner?.value;
        }
        if (state.market_segment) {
            body.market_segment = state.market_segment?.value;
        }
        if (state.country) {
            body.country = state.country?.value;
        }
        if (state.state) {
            body.state = state.state?.value;
        }
        if (state.from_date) {
            body.start_date = moment(state.from_date).format('YYYY-MM-DD');
        }

        if (state.to_date) {
            body.end_date = moment(state.to_date).format('YYYY-MM-DD');
        }

        return body;
    };

    const reportOpportunity = async (filter = false) => {
        try {
            let body = {};
            if (filter) {
                if (filters()) {
                    body = bodyData();
                }
            }

            let res: any = await Models.report.reportOpportunity(body);

            const formatName = (name) => {
                if (name === 'no_decision') return 'No Decision';
                if (name === 'Oops-Follow up') return 'Oops Follow Up';
                return name.replace(/\b\w/g, (char) => char.toUpperCase());
            };

            const counts = Object.keys(res)
                .filter((name) => name !== 'total' && name !== 'monthly_data')
                .map((name) => ({
                    name: formatName(name),
                    count: res[name].count,
                }));

            const values = Object.keys(res)
                .filter((name) => name !== 'total' && name !== 'monthly_data')
                .map((name) => ({
                    name: formatName(name),
                    value: res[name].value,
                }));

            const recurringValues = Object.keys(res)
                .filter((name) => name !== 'total' && name !== 'monthly_data')
                .map((name) => ({
                    name: formatName(name),
                    recurring_value: res[name]?.recurring_value || 0,
                }));

            const countSeries = counts?.map((item) => item?.count);
            const countLabels = counts?.map((item) => item?.name);

            const valueSeries = values?.map((item) => item?.value);
            const valueLabels = values?.map((item) => item?.name);

            const recurringValueSeries = recurringValues?.map((item) => item?.recurring_value);
            const recurringValueLabels = recurringValues?.map((item) => item?.name);

            const monthSeries = res?.monthly_data?.map((item) => item.count); // Get counts for the data series
            const monthLabels = res?.monthly_data?.map((item) => item.month); // Get month labels for the x-axis

            const checkArrayValues = countSeries?.some((value) => value !== 0);
            const checkArrayRec = valueSeries?.some((value) => value !== 0);
            const checkArrayCount = recurringValueSeries?.some((value) => value !== 0);
            const checkArrayIncom = monthSeries?.some((value) => value !== 0);

            const count = {
                series: countSeries,
                options: {
                    chart: {
                        height: 300,
                        type: 'pie',
                        zoom: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    labels: countLabels,
                    colors: ['#4361ee', '#805dca', '#00ab55', '#ff6b6b', '#ffd93d', '#6bc1ff', '#ffa502', '#38ada9', '#fa983a'],
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                            },
                        },
                    ],
                    stroke: {
                        show: false,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            };

            const value = {
                series: valueSeries,
                options: {
                    chart: {
                        height: 300,
                        type: 'pie',
                        zoom: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    labels: valueLabels,
                    colors: ['#ff6b6b', '#ffbe76', '#badc58', '#f9ca24', '#30336b', '#4834d4', '#22a6b3', '#be2edd', '#dff9fb'],
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                            },
                        },
                    ],
                    stroke: {
                        show: false,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            };

            const rec = {
                series: recurringValueSeries,
                options: {
                    chart: {
                        height: 300,
                        type: 'pie',
                        zoom: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    labels: recurringValueLabels,
                    colors: ['#e056fd', '#686de0', '#f0932b', '#eb4d4b', '#7ed6df', '#6ab04c', '#ff7979', '#f6e58d', '#e84118'],
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                            },
                        },
                    ],
                    stroke: {
                        show: false,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            };

            const incomOpp = {
                series: [
                    {
                        name: 'Count',
                        data: monthSeries,
                    },
                ],
                options: {
                    chart: {
                        height: 325,
                        type: 'line', // Change to 'line' for a line chart
                        fontFamily: 'Nunito, sans-serif',
                        zoom: { enabled: false },
                        toolbar: { show: false },
                    },
                    dataLabels: { enabled: false },
                    stroke: {
                        show: true,
                        curve: 'smooth',
                        width: 2,
                        lineCap: 'square',
                    },
                    dropShadow: {
                        enabled: true,
                        opacity: 0.2,
                        blur: 10,
                        left: -7,
                        top: 22,
                    },
                    colors: ['#1B55E2'], // Use a single color since there's one series
                    markers: {
                        size: 5,
                    },
                    labels: monthLabels, // Set month labels
                    xaxis: {
                        axisBorder: { show: false },
                        axisTicks: { show: false },
                        labels: {
                            style: {
                                fontSize: '12px',
                                cssClass: 'apexcharts-xaxis-title',
                            },
                        },
                    },
                    yaxis: {
                        tickAmount: 7,
                        labels: {
                            style: {
                                fontSize: '12px',
                                cssClass: 'apexcharts-yaxis-title',
                            },
                        },
                        opposite: false,
                    },
                    grid: {
                        borderColor: '#E0E6ED',
                        strokeDashArray: 5,
                        xaxis: { lines: { show: false } },
                        yaxis: { lines: { show: true } },
                        padding: { top: 0, right: 0, bottom: 0, left: 0 },
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right',
                        fontSize: '16px',
                        markers: { width: 10, height: 10, offsetX: -2 },
                        itemMargin: { horizontal: 10, vertical: 5 },
                    },
                    tooltip: {
                        marker: { show: true },
                        x: { show: false },
                    },
                },
            };

            setState({
                oppoCount: count,
                oppoValue: value,
                oppRecValue: rec,
                isShowOppCount: checkArrayCount,
                isShowOppValue: checkArrayValues,
                isShowOppRec: checkArrayRec,
                isShowIncom: checkArrayIncom,
                incommingOpportunity: incomOpp,
            });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const reportLead = async (filter = false) => {
        try {
            setState({ loading: true });
            let body = {};
            if (filter) {
                if (filters()) {
                    body = bodyData();
                }
            }
            const res: any = await Models.report.reportLead(body);
            console.log('res: ', res);

            const counts = res?.chart_data?.monthly_data?.map((item) => ({
                name: item?.month,
                count: item?.count,
            }));

            const countSeries = counts?.map((item) => item?.count);
            const countLabels = counts?.map((item) => item?.name);

            const labels = Object.keys(res?.lead_source_counts); // ["Webinars and Events", "Social Media Ads", "Industry Publications", "Cold Calling"]
            const data = Object.values(res?.lead_source_counts);
            const checkArrayValues = data?.some((value) => value !== 0);
            const incomLeads = countSeries?.some((value) => value !== 0);

            const incomLead = {
                series: [
                    {
                        name: 'Count',
                        data: countSeries,
                    },
                ],
                options: {
                    chart: {
                        height: 325,
                        type: 'line', // Change to 'line' for a line chart
                        fontFamily: 'Nunito, sans-serif',
                        zoom: { enabled: false },
                        toolbar: { show: false },
                    },
                    dataLabels: { enabled: false },
                    stroke: {
                        show: true,
                        curve: 'smooth',
                        width: 2,
                        lineCap: 'square',
                    },
                    dropShadow: {
                        enabled: true,
                        opacity: 0.2,
                        blur: 10,
                        left: -7,
                        top: 22,
                    },
                    colors: ['#1B55E2'], // Use a single color since there's one series
                    markers: {
                        size: 5,
                    },
                    labels: countLabels, // Set month labels
                    xaxis: {
                        axisBorder: { show: false },
                        axisTicks: { show: false },
                        labels: {
                            style: {
                                fontSize: '12px',
                                cssClass: 'apexcharts-xaxis-title',
                            },
                        },
                    },
                    yaxis: {
                        tickAmount: 7,
                        labels: {
                            style: {
                                fontSize: '12px',
                                cssClass: 'apexcharts-yaxis-title',
                            },
                        },
                        opposite: false,
                    },
                    grid: {
                        borderColor: '#E0E6ED',
                        strokeDashArray: 5,
                        xaxis: { lines: { show: false } },
                        yaxis: { lines: { show: true } },
                        padding: { top: 0, right: 0, bottom: 0, left: 0 },
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right',
                        fontSize: '16px',
                        markers: { width: 10, height: 10, offsetX: -2 },
                        itemMargin: { horizontal: 10, vertical: 5 },
                    },
                    tooltip: {
                        marker: { show: true },
                        x: { show: false },
                    },
                },
            };

            const pieChart = {
                series: data,
                options: {
                    chart: {
                        type: 'pie',
                        height: 350,
                        fontFamily: 'Nunito, sans-serif',
                        toolbar: { show: false },
                    },
                    labels: labels,
                    colors: ['#4361ee', '#805dca', '#00ab55', '#ff6b6b'], // Define custom colors for the pie segments

                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                        fontSize: '14px',
                        markers: {
                            width: 10,
                            height: 10,
                        },
                        itemMargin: {
                            horizontal: 10,
                            vertical: 5,
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (val) => `${val}`, // Display value on tooltip
                        },
                    },
                },
            };
            setState({ leadSource: pieChart, reportLead: res, loading: false, isShowLead: checkArrayValues, incomLead: incomLead, isShowIncomLead: incomLeads });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const leadList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.lead.list(state.currentLeadPage);
            const dropdownList = Dropdown(res?.results, 'name');
            setState({ leadList: dropdownList, loading: false, hasMoreLead: res.next });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const leadListLoadMore = async () => {
        try {
            if (state.hasMoreLead) {
                const res: any = await Models.lead.list(state.currentLeadPage + 1);
                const newOptions = Dropdown(res?.results, 'name');
                setState({
                    leadList: [...state.leadList, ...newOptions],
                    hasMoreLead: res.next,
                    currentLeadPage: state.currentLeadPage + 1,
                });
            } else {
                setState({
                    leadList: state.leadList,
                });
            }
        } catch (error) {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const tabClassNames = (selected: boolean) =>
        `${selected ? ' text-lg !border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
        -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black text-lg `;

    const clearFilter = () => {
        setState({
            state: '',
            vertical: '',
            country: '',
            market_segment: '',
            focus_segment: '',
            isOpen: false,
            owner: '',
            from_date: null,
            to_date: null,
            lead: '',
        });
        reportOpportunity();
        reportLead();
        funnelChartCount();
    };

    return (
        <div className="p-2">
            <div className="panel mb-3 flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">Reports</h5>
                </div>
                
            </div>

            <div className="panel mb-3 flex items-center justify-between">
                <Tab.Group>
                    <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                        {['Lead', 'Opportunity', 'Sales'].map((tab) => (
                            <Tab as={Fragment} key={tab}>
                                {({ selected }) => (
                                    <button
                                        onClick={() => {
                                            setState({
                                                activeTab: tab,
                                            });
                                        }}
                                        className={tabClassNames(selected)}
                                    >
                                        {tab}
                                    </button>
                                )}
                            </Tab>
                        ))}
                    </Tab.List>
                </Tab.Group>
                <button className="btn btn-primary p-2" onClick={() => setState({ isOpen: true })}>
                    <IconFilter />
                </button>
            </div>
            {state.activeTab == 'Lead' ? (
                <>
                    <div className="flex flex-wrap gap-5">
                        <div className="panel w-full items-center   justify-center ">
                            <div className="mb-2 flex w-full items-center  gap-5">
                                <h5 className="text-lg font-semibold dark:text-white-light">Lead Source</h5>
                            </div>
                            {state.isShowLead ? (
                                <ReactApexChart
                                    series={state.leadSource?.series}
                                    options={state.leadSource?.options}
                                    className="rounded-lg bg-white dark:bg-black"
                                    type="pie"
                                    height={300}
                                    width={'100%'}
                                />
                            ) : (
                                <div className="flex items-center justify-center">No Data Found</div>
                            )}
                        </div>
                    </div>
                    <div className="panel mt-3 flex w-full flex-col">
                        <div className="mb-2 flex w-full items-center  gap-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Incoming Lead</h5>
                        </div>
                        {state.isShowIncomLead ? (
                            <ReactApexChart series={state.incomLead?.series} options={state.incomLead?.options} type="area" height={325} width={'100%'} />
                        ) : (
                            <div className="flex items-center justify-center">No Data Found</div>
                        )}
                    </div>
                </>
            ) : state.activeTab == 'Opportunity' ? (
                <>
                    <div className="mt-2 flex flex-wrap gap-5">
                        <div className="panel flex w-full flex-col  md:w-[48%]">
                            <div className="mb-2 flex w-full items-center  gap-5">
                                <h5 className="text-lg font-semibold dark:text-white-light">Count</h5>
                            </div>
                            {state.isShowOppCount ? (
                                <ReactApexChart
                                    series={state.oppoCount.series}
                                    options={state.oppoCount.options}
                                    className="rounded-lg bg-white dark:bg-black"
                                    type="pie"
                                    height={300}
                                    width={'100%'}
                                />
                            ) : (
                                <div className="flex items-center justify-center">No Data Found</div>
                            )}
                        </div>

                        <div className="panel flex w-full flex-col  md:w-[48%]">
                            <div className="mb-2 flex w-full items-center  gap-5">
                                <h5 className="text-lg font-semibold dark:text-white-light">Value</h5>
                            </div>
                            {state.isShowOppValue ? (
                                <ReactApexChart
                                    series={state.oppoValue?.series}
                                    options={state.oppoValue?.options}
                                    className="rounded-lg bg-white dark:bg-black"
                                    type="pie"
                                    height={300}
                                    width={'100%'}
                                />
                            ) : (
                                <div className="flex items-center justify-center">No Data Found</div>
                            )}
                        </div>

                        <div className="panel flex w-full flex-col ">
                            <div className="mb-2 flex w-full items-center  gap-5">
                                <h5 className="text-lg font-semibold dark:text-white-light">Recurring Value</h5>
                            </div>
                            {state.isShowOppRec ? (
                                <ReactApexChart
                                    series={state.oppRecValue?.series}
                                    options={state.oppRecValue?.options}
                                    className="rounded-lg bg-white dark:bg-black"
                                    type="pie"
                                    height={300}
                                    width={'100%'}
                                />
                            ) : (
                                <div className="flex items-center justify-center">No Data Found</div>
                            )}
                        </div>
                    </div>
                    <div className="panel mt-3 flex w-full  flex-col">
                        <div className="mb-2 flex w-full items-center  gap-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Incoming Opportunity</h5>
                        </div>
                        {state.isShowIncom ? (
                            <ReactApexChart series={state.incommingOpportunity?.series} options={state.incommingOpportunity?.options} type="area" height={325} width={'100%'} />
                        ) : (
                            <div className="flex items-center justify-center">No Data Found</div>
                        )}
                    </div>
                </>
            ) : (
                <div className="mt-2 flex flex-wrap gap-5">
                    <div className="panel flex w-full flex-col items-center justify-center   ">
                        <div className="mb-2 flex w-full items-center  gap-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Sales</h5>
                        </div>
                        <Funnel data={state.funnelData} />
                        {/* <ReactApexChart series={stageChart.series} options={stageChart.options} className="rounded-lg bg-white dark:bg-black" type="pie" height={300} width={'100%'} /> */}
                    </div>
                </div>
            )}

            <SideMenu
                title="Filter"
                open={state.isOpen}
                close={() => clearFilter()}
                renderComponent={() => (
                    <div className=" flex flex-col gap-5">
                        <CustomSelect title="Lead " value={state.lead} onChange={(e) => setState({ lead: e })} placeholder={'Lead'} options={state.leadList} loadMore={() => leadListLoadMore()} />
                        <CustomSelect options={state.ownerList} value={state.owner} onChange={(e) => setState({ owner: e })} isMulti={false} placeholder={'Owner'} title={'Owner'} />
                        <CustomSelect
                            value={state.vertical}
                            onChange={(e) => {
                                if (e) {
                                    setState({ focus_segment: '', vertical: e, focusList: [] });
                                    getFocusSegmentList(e);
                                } else {
                                    setState({ focus_segment: '', vertical: '', focusList: [] });
                                }
                            }}
                            placeholder={'Vertical'}
                            title={'Vertical'}
                            options={state.verticalList}
                            error={state.errors?.vertical}
                        />
                        <CustomSelect
                            options={state.focusList}
                            value={state.focus_segment}
                            onChange={(e) => setState({ focus_segment: e })}
                            isMulti={false}
                            placeholder={'Focus Segment'}
                            title={'Focus Segment'}
                        />
                        <CustomSelect
                            options={state.marketSegmentList}
                            value={state.market_segment}
                            onChange={(e) => setState({ market_segment: e })}
                            isMulti={false}
                            placeholder={'Market Segment'}
                            title={'Market Segment'}
                        />
                        <CustomSelect
                            value={state.country}
                            onChange={(e) => {
                                if (e) {
                                    stateList(e);
                                }
                                setState({ country: e, state: '' });
                            }}
                            placeholder={'Country'}
                            title={'Country'}
                            options={state.countryList}
                            error={state.errors?.country}
                        />
                        <CustomSelect value={state.state} onChange={(e) => setState({ state: e })} placeholder={'State'} title={'State'} options={state.stateList} error={state.errors?.state} />
                        <CustomeDatePicker value={state.from_date} placeholder="From" title="From Date" onChange={(e) => setState({ from_date: e, to_date: null })} />
                        <CustomeDatePicker value={state.to_date} placeholder="To" title="To Date" onChange={(e) => setState({ to_date: e })} />
                        <div className=" flex justify-end gap-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    funnelChartCount(true);
                                    reportLead(true);
                                    reportOpportunity(true);
                                    setState({ isOpen: false });
                                }}
                            >
                                Submit
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => clearFilter()}>
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default PrivateRouter(Reports);
