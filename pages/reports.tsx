import { Models, PrivateRouter } from '@/utils/imports.utils';
import React, { useEffect, useState } from 'react';
import { Dropdown, Failure, addCommasToNumber, objIsEmpty, useSetState } from '@/utils/functions.utils';
import CommonLoader from './elements/commonLoader';
import IconSearch from '@/components/Icon/IconSearch';
import CustomSelect from '@/components/Select';
import IconFilter from '@/components/Icon/IconFilter';
import Funnel from '@/common_component/funnelChart';
import dynamic from 'next/dynamic';
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
        reportStage: {},
    });

    useEffect(() => {
        verticalList();
        countryList();
        ownerList();
        marketSegmentList();
        funnelChartCount();
        reportLead();
        reportStage();
        reportOpportunity();
    }, []);

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

    const funnelChartCount = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.report.funnelCount();
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

    const reportOpportunity = async () => {
        try {
            const res: any = await Models.report.reportOpportunity();

            setState({ reportData: res });
        } catch (error) {
            setState((prevState) => ({ ...prevState, loading: false }));
            console.error('Error fetching reportOpportunity data:', error);
        }
    };

    const reportStage = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.report.reportStage();
            console.log('reportStage: ', res);

            setState({ reportStage: res, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const reportLead = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.report.reportLead();
            // const dropdownList = Dropdown(res, 'country_name');
            const data = [
                { name: 'Lead', value: res?.leads_count },
                { name: 'Opportunity', value: res?.opportunities_count },
                { name: 'S2C', value: res?.s2c_count },
                { name: 'Win', value: res?.win_count },
            ];
            setState({ reportLead: data, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const opportunityChart: any = {
        series: [state?.reportData?.open?.count || 0, state?.reportData?.lost?.count || 0, state?.reportData?.win?.count || 0],
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
            labels: ['Open', 'Loss', 'Win'],
            colors: ['#4361ee', '#805dca', '#00ab55'],
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

    const stageChart: any = {
        series: [state?.reportStage?.count || 0, state?.reportStage?.recurring_value || 0, state?.reportStage?.total_value || 0],
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
            labels: ['Count', 'Recurring Value', 'Total Value'],
            colors: ['#4361ee', '#805dca', '#00ab55'],
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
    reportStage;

    const barChart: any = {
        series: [
            {
                name: 'Sales',
                data: [44, 55, 41, 67, 22, 43, 21, 70],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#4361ee'],
            xaxis: {
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
                axisBorder: {
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                opposite: false,
                reversed: false,
            },
            grid: {
                borderColor: '#e0e6ed',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            fill: {
                opacity: 0.8,
            },
        },
    };

    return (
        <div className="p-2">
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">Reports</h5>
                </div>
                <div className="flex gap-5">
                    <button type="button" className="btn btn-primary w-full md:w-auto" onClick={() => window.open('/apps/product/add', '_blank')}>
                        + Create
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            <div className="panel mb-5 flex  items-center gap-5">
                <CustomSelect options={state.ownerList} value={state.owner} onChange={(e) => setState({ owner: e })} isMulti={false} placeholder={'Owner'} />
                <CustomSelect
                    value={state.vertical}
                    onChange={(e) => {
                        if (e) {
                            setState({ focus_segment: '', vertical: e });
                            getFocusSegmentList(e);
                        } else {
                            setState({ focus_segment: '', vertical: '' });
                        }
                    }}
                    placeholder={'Vertical'}
                    options={state.verticalList}
                    required
                    error={state.errors?.vertical}
                />
                <CustomSelect options={state.focusList} value={state.focus_segment} onChange={(e) => setState({ focus_segment: e })} isMulti={false} placeholder={'Focus Segment'} />
                <CustomSelect options={state.marketSegmentList} value={state._segment} onChange={(e) => setState({ _segment: e })} isMulti={false} placeholder={'Market Segment'} />
                <CustomSelect
                    value={state.country}
                    onChange={(e) => {
                        if (e) {
                            stateList(e);
                        }
                        setState({ country: e, state: '' });
                    }}
                    placeholder={'Country'}
                    options={state.countryList}
                    required
                    error={state.errors?.country}
                />
                <CustomSelect value={state.state} onChange={(e) => setState({ state: e })} placeholder={'State'} options={state.stateList} error={state.errors?.state} required />
            </div>

            <div className="flex flex-wrap gap-5">
                <div className="panel w-full items-center   justify-center md:w-[48%]">
                    <div className="mb-2 flex w-full items-center  gap-5">
                        <h5 className="text-lg font-semibold dark:text-white-light">Lead</h5>
                    </div>
                    <div className="">
                        <Funnel height={600} width={600} data={state.funnelData} />
                    </div>
                </div>

                <div className="panel flex w-full flex-col  md:w-[48%]">
                    <div className="mb-2 flex  gap-5">
                        <h5 className="text-lg font-semibold dark:text-white-light">Opportunities</h5>
                    </div>
                    <ReactApexChart series={opportunityChart?.series} options={opportunityChart?.options} className="rounded-lg bg-white dark:bg-black" type="pie" height={300} width={'100%'} />
                </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-5">
                <div className="panel flex w-full flex-col  md:w-[48%]">
                    <div className="mb-2 flex  gap-5">
                        <h5 className="text-lg font-semibold dark:text-white-light">Stage</h5>
                    </div>
                    <ReactApexChart series={stageChart.series} options={stageChart.options} className="rounded-lg bg-white dark:bg-black" type="pie" height={300} width={'100%'} />
                </div>

                <div className="panel w-full items-center   justify-center md:w-[48%]">
                    <div className="mb-2 flex w-full items-center justify-center gap-5">
                        <h5 className="text-lg font-semibold dark:text-white-light">Funnel</h5>
                    </div>
                    <div className="">
                        <ReactApexChart series={barChart.series} options={barChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateRouter(Reports);
