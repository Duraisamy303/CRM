import { Models, PrivateRouter } from '@/utils/imports.utils';
import React, { useEffect } from 'react';
import { Dropdown, Failure, addCommasToNumber, objIsEmpty, useSetState } from '@/utils/functions.utils';
import CommonLoader from './elements/commonLoader';
import dynamic from 'next/dynamic';
import { DataTable } from 'mantine-datatable';
import IconEdit from '@/components/Icon/IconEdit';
import IconEye from '@/components/Icon/IconEye';
import { useRouter } from 'next/router';
import CustomSelect from '@/components/Select';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import useDebounce from '@/common_component/useDebounce';
import SideMenu from '@/common_component/sideMenu';
import InputRange from '../common_component/slider';
import IconFilter from '@/components/Icon/IconFilter';
import IconUser from '@/components/Icon/IconUser';
import IconPlus from '@/components/Icon/IconPlus';
import OppCard from '@/components/oppCard';
import IconSearch from '@/components/Icon/IconSearch';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Opportunity = () => {
    const router = useRouter();

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
    });

    useEffect(() => {
        getData();
        getFocusSegmentList();
        getMarketSegmentList();
        countryList();
        verticalList();
    }, []);

    const debouncedSearch = useDebounce(state.search, 500);

    const debouncedrange = useDebounce(state.range, 500);

    useEffect(() => {
        if (filters()) {
            filterData();
        } else {
            getData(state.currentPage);
        }
    }, [state.currentPage, debouncedSearch, debouncedrange, state.vertical, state.focus, state.market, state.country, state.state]);

    const getData = async (page = 1) => {
        try {
            setState({ loading: true });
            const response: any = await Models.opportunity.allList(page);
            console.log("response: ", response);
            tableData(response?.results);

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

    const filters = () => {
        let filter = false;
        if (state.search || state.vertical || state.focus || state.market || state.country || state.state || state.range[0] > 0 || state.range[1] != state.maxPrice) {
            filter = true;
        }
        return filter;
    };

    const filterData = async (page = 1) => {
        try {
            setState({ loading: true });
            let body = bodyData();
            if (!objIsEmpty(body)) {
                const response: any = await Models.lead.filter(body, page);

                tableData(response?.results);

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
            body.annual_revenue = [state.range[0], state.range[1]];
        }

        return body;
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
        });
        getData();
    };

    const getFocusSegmentList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.lead.dropdowns('focus_segment');
            const dropdownList = Dropdown(res, 'focus_segment');
            setState({ focusList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const getMarketSegmentList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('market_segment');
            const dropdownList = Dropdown(res, 'market_segment');
            setState({ marketList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const countryList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('country');
            const dropdownList = Dropdown(res, 'country_name');
            setState({ countryList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });
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

    const stateList = async (country) => {
        try {
            setState({ stateLoading: true });
            const res = await Models.lead.stateList(country?.value);
            const dropdownList = Dropdown(res, 'state_name');
            setState({ stateList: dropdownList, stateLoading: false });
        } catch (error) {
            setState({ stateLoading: false });
        }
    };

    const tableData = (res: any) => {
        const data = res?.map((item) => {
            return {
              ...item,
              name: item?.name,
              opportunity_value: item.opportunity_value,
              probability_in_percentage: item.probability_in_percentage,
              recurring_value_per_year: item?.recurring_value_per_year,
              stages: item.stage.stage,
              currency: item.currency_type.currency_short,
              closing_date: item.closing_date,
            };
        });

        setState({ data: data });
    };

    console.log("data: ", state.data);


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

    return (
        <div className="p-2">
            <div className="panel mb-5 mt-5 flex items-center justify-between gap-5 ">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold ">Tasks</h5>
                </div>
                <div className="flex gap-5">
                    <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => router.push('/createLead')}>
                        + Create
                    </button>
                </div>
            </div>
            <div className=" mt-4 grid grid-cols-12  gap-4">
                <div className=" panel col-span-12 flex max-h-[650px] flex-col gap-5 rounded-2xl md:col-span-3 ">
                    <div className="flex justify-between">
                        <div className="flex w-full items-center justify-between gap-3">
                            <div className=" " style={{ fontSize: '18px' }}>
                                Filter Opportunity by
                            </div>
                            <div className="flex ">
                                {/* <div className=" cursor-pointer  rounded-2xl p-2 font-bold text-primary" style={{ fontSize: '15px' }} onClick={() => filterData()}>
                                    Apply
                                </div> */}

                                <div className=" cursor-pointer  rounded-2xl p-2 font-bold text-primary" style={{ fontSize: '15px' }} onClick={() => clearFilter()}>
                                    Reset
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" overflow-y-scroll">
                        <div className=" mb-5 mt-5 flex flex-col gap-4 md:mt-0  md:justify-between">
                            {/* Search Input */}
                            <div className="relative flex w-full rounded-xl  border border-white-dark/20">
                                <button type="submit" placeholder="Let's find your question in fast way" className="m-auto flex items-center justify-center p-3 text-primary">
                                    <IconSearch className="mx-auto h-5 w-5" />
                                </button>
                                <input
                                    type="text"
                                    value={state.search}
                                    onChange={(e) => setState({ search: e.target.value })}
                                    placeholder="Search"
                                    className="form-input rounded-none border-0 border-l bg-white  py-3 placeholder:tracking-wider focus:shadow-[0_0_5px_2px_rgb(194_213_255_/_62%)] focus:outline-none dark:shadow-[#1b2e4b]"
                                />
                            </div>
                            {/* Category Dropdown */}
                            <CustomSelect options={state.verticalList} value={state.vertical} onChange={(e) => setState({ vertical: e })} isMulti={false} placeholder={'Vertical'} title={'Vertical'} />
                            <CustomSelect
                                options={state.focusList}
                                value={state.focus}
                                onChange={(e) => setState({ focus: e })}
                                isMulti={false}
                                placeholder={'Focus Segment'}
                                title={'Focus Segment'}
                            />
                            <CustomSelect
                                options={state.marketList}
                                value={state.market}
                                onChange={(e) => setState({ market: e })}
                                isMulti={false}
                                placeholder={'Market Segment'}
                                title={'Market Segment'}
                            />
                            <CustomSelect
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
                                title="Country"
                            />

                            <CustomSelect options={state.stateList} value={state.state} onChange={(e) => setState({ state: e })} isMulti={false} placeholder={'State'} title={'State'} />
                            <div id="" className="p-2">
                                <label className="block text-sm font-medium text-gray-700">Annual Revenue</label>

                                <InputRange STEP={1} MIN={0} MAX={state.maxPrice} values={state.range} handleChanges={(data) => setState({ range: data })} />
                                <div className="mt-2 flex w-full items-center justify-between">
                                    <span className="">{state.range[0] ? addCommasToNumber(state.range[0]) : 0}</span>
                                    <span className="">{state.range[1] ? addCommasToNumber(state.range[1]) : addCommasToNumber(state.maxPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {state.loading ? (
                    <div className="relative inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                        <CommonLoader />
                    </div>
                ) : (
                    <div className=" col-span-12 flex flex-col   md:col-span-9">
                        <DataTable
                                className="table-responsive"
                                records={state.data}
                                columns={[
                                    {
                                        accessor: 'name',
                                        sortable: true,

                                        width: '220px',
                                    },
                                    { accessor: 'opportunity_value', sortable: true, title: 'Opportunity Value' },
                                    { accessor: 'probability_in_percentage', sortable: true, title: 'Probability In Percentage' },
                                    { accessor: 'recurring_value_per_year', sortable: true, title: 'Recurring Value Per Year' },
                                    { accessor: 'stages', sortable: true, title: 'Stage', width: '220px' },
                                    { accessor: 'currency', sortable: true, title: 'Currency Type' },
                                    { accessor: 'closing_date', sortable: true, title: 'Closing Date' },
                                    {
                                        accessor: 'actions',
                                        title: 'Actions',
                                        render: (row: any) => (
                                            <>
                                                <div className="mx-auto flex w-max items-center gap-4">
                                                    <button type="button" className="flex hover:text-danger" onClick={() => router.push(`/viewOpportunity?id=${row.id}`)}>
                                                        <IconEye />
                                                    </button>
                                                    <button className="flex hover:text-info" 
                                                    // onClick={() => editOppData(row)}
                                                    >
                                                        <IconEdit className="h-4.5 w-4.5" />
                                                    </button>
                                                </div>
                                            </>
                                        ),
                                    },
                                ]}
                                highlightOnHover
                                totalRecords={state.data?.length}
                                recordsPerPage={state.pageSize}
                                minHeight={200}
                                page={null}
                                onPageChange={(p) => {}}
                                withBorder={true}
                                selectedRecords={state.selectedRecords}
                                onSelectedRecordsChange={(val) => {
                                    setState({ selectedRecords: val });
                                }}
                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                            />
                        <div className="mt-5 flex justify-center gap-3">
                            <button disabled={!state.previous} onClick={handlePreviousPage} className={`btn ${!state.previous ? 'btn-disabled' : 'btn-primary'}`}>
                                <IconArrowBackward />
                            </button>
                            <button disabled={!state.next} onClick={handleNextPage} className={`btn ${!state.next ? 'btn-disabled' : 'btn-primary'}`}>
                                <IconArrowForward />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <SideMenu
                title="Filter"
                open={state.isOpen}
                close={() => setState({ isOpen: false })}
                renderComponent={() => (
                    <div>
                        <div className=" mb-5 mt-5 flex flex-col gap-4 md:mt-0  md:justify-between">
                            {/* Search Input */}

                            {/* Category Dropdown */}
                            <CustomSelect options={state.verticalList} value={state.vertical} onChange={(e) => setState({ vertical: e })} isMulti={false} placeholder={'Vertical'} />
                            <CustomSelect options={state.focusList} value={state.focus} onChange={(e) => setState({ focus: e })} isMulti={false} placeholder={'Focus Segment'} />
                            <CustomSelect options={state.marketList} value={state.market} onChange={(e) => setState({ market: e })} isMulti={false} placeholder={'Market Segment'} />
                            <CustomSelect
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
                            />

                            <CustomSelect options={state.stateList} value={state.state} onChange={(e) => setState({ state: e })} isMulti={false} placeholder={'State'} />
                            <div id="" className="p-2">
                                <label className="block text-sm font-medium text-gray-700">Annual Revenue</label>

                                <InputRange STEP={1} MIN={0} MAX={state.maxPrice} values={state.range} handleChanges={(data) => setState({ range: data })} />
                                <div className="mt-2 flex w-full items-center justify-between">
                                    <span className="">{state.range[0] ? addCommasToNumber(state.range[0]) : 0}</span>
                                    <span className="">{state.range[1] ? addCommasToNumber(state.range[1]) : addCommasToNumber(state.maxPrice)}</span>
                                </div>
                            </div>
                            <div className=" flex justify-end gap-3">
                                <button type="button" className="btn btn-primary" onClick={() => filterData()}>
                                    Submit
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => clearFilter()}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default PrivateRouter(Opportunity);
