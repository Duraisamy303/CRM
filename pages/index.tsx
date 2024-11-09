import { Models, PrivateRouter, Validation } from '@/utils/imports.utils';
import React, { useEffect } from 'react';
import { Dropdown, Success, objIsEmpty, roundOff, useSetState } from '@/utils/functions.utils';
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
import Header from '@/components/Layouts/Header';
import Chip from '@/components/chip';
import Tippy from '@tippyjs/react';
import IconUserPlus from '@/components/Icon/IconUserPlus';
import Modal from '@/common_component/modal';
import TextArea from '@/components/TextArea';
import IconLoader from '@/components/Icon/IconLoader';
import moment from 'moment';
import * as Yup from 'yup';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Index = () => {
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
        tagList: [],
        tags: [],
        isOpenAssign: false,
        createdByList: [],
        assigned_to: '',
        popupHeight: 'auto',
    });

    useEffect(() => {
        getData();
        getMarketSegmentList();
        countryList();
        verticalList();
        tagList();
        createdByList();
    }, []);

    const debouncedSearch = useDebounce(state.search, 500);

    useEffect(() => {
        if (filters()) {
            filterData();
        } else {
            getData(state.currentPage);
        }
    }, [state.currentPage, debouncedSearch, state.vertical, state.focus, state.market]);

    const getData = async (page = 1) => {
        try {
            setState({ loading: true });
            const response: any = await Models.lead.list(page);
            setState({ range: [response.min_revenue, response.max_revenue], maxPrice: response.max_revenue });
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
                setState({ range: [response.min_revenue, response.max_revenue], maxPrice: response.max_revenue });

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
        if (state.tags?.length > 0) {
            body.tags = state.tags?.map((item) => item?.value);
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
            tags: [],
        });
        getData();
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

    const tagList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('tags');
            const dropdownList = Dropdown(res, 'tag');
            setState({ tagList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const createdByList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('created_by');
            const dropdownList = Dropdown(res, 'username');
            setState({ createdByList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
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
                country: item?.country?.country_name,
                focus_segment: item.focus_segment.focus_segment,
                state: item?.state?.state_name || [],
                lead_owner: item?.lead_owner?.username,
                created_by: item?.created_by?.username,
                name: item?.name,
                vertical: item?.focus_segment?.vertical?.vertical || item?.vertical?.vertical,
                annual_revenue: roundOff(item?.annual_revenue),
                tags: item?.tags,
            };
        });

        setState({ data: data });
    };
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

    const clearAssignData = () => {
        setState({
            assigned_to: '',
            isOpenAssign: false,
            errors: '',
            assignLoad: false,
            leadId: '',
        });
    };

    const assignedLead = async () => {
        try {
            setState({ assignLoad: true });
            const validateField = {
                assigned_to: state.assigned_to ? moment(state.assigned_to).format('YYYY-MM-DD') : '',
            };
            await Validation.assignTask.validate(validateField, { abortEarly: false });

            const body = {
                assigned_to: state.assigned_to?.map((item) => item?.value),
            };
            const res: any = await Models.lead.leadAssign(state.leadId, body);
            Success(res.message);
            clearAssignData();
            setState({ assignLoad: false });
            getData();
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err?.message; // Set the error message for each field
                });
                setState({ errors: validationErrors, assignLoad: false });
            } else {
                setState({ assignLoad: false });
            }
        }
    };

    return (
        <>
            <div className="p-2">
                <div className="panel  flex items-center justify-between gap-5 ">
                    <div className="flex items-center gap-5 pl-3">
                        <h5 className="text-lg font-semibold ">Leads</h5>
                    </div>
                    <div className="flex gap-5">
                        <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => router.push('/createLead')}>
                            + Create
                        </button>
                    </div>
                </div>
                <div className="panel mt-2 flex flex-col items-center justify-between gap-5 lg:flex-row">
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

                    <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row">
                        <CustomSelect
                            value={state.vertical}
                            onChange={(e) => {
                                if (e) {
                                    setState({ focus: '', vertical: e });
                                    getFocusSegmentList(e);
                                } else {
                                    setState({ focus: '', vertical: '' });
                                }
                            }}
                            placeholder={'Vertical'}
                            options={state.verticalList}
                            required
                            error={state.errors?.vertical}
                            className="w-full lg:w-64" // Make the width responsive
                        />
                        <CustomSelect
                            options={state.focusList}
                            value={state.focus}
                            onChange={(e) => setState({ focus: e })}
                            isMulti={false}
                            placeholder={'Focus Segment'}
                            className="w-full lg:w-64" // Make the width responsive
                        />
                        <CustomSelect
                            options={state.marketList}
                            value={state.market}
                            onChange={(e) => setState({ market: e })}
                            isMulti={false}
                            placeholder={'Market Segment'}
                            className="w-full lg:w-64" // Make the width responsive
                        />
                    </div>

                    <button className="btn btn-primary lg:mt-0" onClick={() => setState({ isOpen: true })}>
                        <IconFilter />
                    </button>
                </div>

                <div className=" mt-2 grid grid-cols-12  gap-4">
                    {/*  */}
                    {state.loading ? (
                        <div className="relative inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                            <CommonLoader />
                        </div>
                    ) : (
                        <div className=" col-span-12 flex flex-col   md:col-span-12">
                            <div className="flex items-center justify-end pb-2 pr-3">
                                <div className="rounded-lg bg-gray-300 p-1 font-semibold">
                                    {state.currentPage}-{Math.min(state.currentPage * 10, state.totalRecords)} of {state.totalRecords}
                                </div>
                            </div>

                            <div>
                                <DataTable
                                    className="table-responsive"
                                    records={state.data}
                                    columns={[
                                        {
                                            accessor: 'name',
                                            width: 130,
                                            // render: (row, index) => (
                                            //     <>
                                            //         <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'hidden' }}>{row?.name}</div>
                                            //          {row.tags?.length > 0 &&
                                            //             row.tags?.map((item) => (
                                            //                 <div className="flex gap-2 p-0.5">
                                            //                     <div>
                                            //                         <Chip label={item.tag} />
                                            //                     </div>
                                            //                 </div>
                                            //             ))}
                                            //     </>
                                            // ),
                                        },
                                        {
                                            accessor: 'Tags',
                                            width: 150,

                                            render: (row, index) => (
                                                <>
                                                    {row.tags?.length > 0 && (
                                                        <Tippy
                                                            content={
                                                                <div className="rounded-lg bg-white p-2 text-sm shadow-lg">
                                                                    {row.tags.map((item, index) => (
                                                                        <div key={index} className="p-0.5">
                                                                            <Chip label={item.tag} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }
                                                        >
                                                            <div className="flex gap-2 p-0.5">{row.tags[0]?.tag}</div>
                                                        </Tippy>
                                                    )}
                                                </>
                                            ),
                                        },
                                        { accessor: 'vertical' },
                                        {
                                            accessor: 'focus_segment',
                                            title: 'Focus Segment',
                                        },

                                        {
                                            accessor: 'annual_revenue',

                                            title: 'Annual Revenue',
                                        },
                                        { accessor: 'lead_owner', title: 'Lead Owner' },
                                        { accessor: 'country', width: '120px' },
                                        { accessor: 'state', title: 'State' },
                                        {
                                            accessor: 'created_on',
                                            title: 'Date',
                                            width: 130,
                                        },

                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            render: (row: any) => (
                                                <>
                                                    <div className="mx-auto flex w-max items-center gap-4">
                                                        <Tippy content="Assign To" className="rounded-lg bg-black p-1 text-sm text-white">
                                                            <button type="button" className="flex hover:text-primary" onClick={() => setState({ isOpenAssign: true, leadId: row.id })}>
                                                                <IconUserPlus />
                                                            </button>
                                                        </Tippy>
                                                        <button type="button" className="flex hover:text-primary" onClick={() => router.push(`/viewLead?id=${row.id}`)}>
                                                            <IconEye />
                                                        </button>
                                                        <button className="flex hover:text-info" onClick={() => router.push(`/updateLead?id=${row.id}`)}>
                                                            <IconEdit className="h-4.5 w-4.5" />
                                                        </button>

                                                        {/* <button type="button" className="flex hover:text-danger" onClick={() => {}}>
                                            <IconTrashLines />
                                        </button> */}
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
                                    // selectedRecords={state.selectedRecords}
                                    // onSelectedRecordsChange={(val) => {
                                    //     setState({ selectedRecords: val });
                                    // }}
                                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                                />
                            </div>
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

                <Modal
                    open={state.isOpenAssign}
                    addHeader={'Assign Lead'}
                    height={state.popupHeight}
                    close={() => clearAssignData()}
                    renderComponent={() => (
                        <div className="flex flex-col gap-5 p-5">
                            <div className="flex flex-col gap-5 ">
                                <CustomSelect
                                    title="Assigned To"
                                    value={state.assigned_to}
                                    onChange={(e) => setState({ assigned_to: e })}
                                    placeholder={'Assigned To'}
                                    options={state.createdByList}
                                    error={state.errors?.assigned_to}
                                    required
                                    isMulti
                                    loadMore={() => leadListLoadMore()}
                                    menuOpen={(isOpen) => setState({ popupHeight: isOpen ? 500 : 'auto' })}
                                />
                            </div>

                            <div className="mt-3 flex items-center justify-end gap-3">
                                <button type="button" className="btn btn-outline-danger border " onClick={() => clearAssignData()}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => assignedLead()}>
                                    {state.assignLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                                </button>
                            </div>
                        </div>
                    )}
                />
                <SideMenu
                    title="Filter"
                    open={state.isOpen}
                    close={() => setState({ isOpen: false })}
                    cancelOnClick={() => clearFilter()}
                    submitOnClick={() => filterData()}
                    submitLoading={state.loading}
                    canceTitle="Reset"
                    renderComponent={() => (
                        <div>
                            <div className=" mb-5 mt-5 flex flex-col gap-4 md:mt-0  md:justify-between">
                                <CustomSelect
                                    title="Tags"
                                    value={state.tags}
                                    isMulti={true}
                                    onChange={(e) => setState({ tags: e })}
                                    placeholder={'Tags'}
                                    options={state.tagList}
                                    error={state.errors?.tags}
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
                                    title={'Country'}
                                />

                                <CustomSelect options={state.stateList} value={state.state} onChange={(e) => setState({ state: e })} isMulti={false} placeholder={'State'} title={'State'} />
                                <div id="" className="">
                                    <label className="text-md mb-2 block font-bold text-gray-700">Annual Revenue</label>
                                    <div id="" className="p-2">
                                        <InputRange STEP={1} MIN={0} MAX={state.maxPrice} values={state.range} handleChanges={(data) => setState({ range: data })} />
                                    </div>
                                    <div className="mt-2 flex w-full items-center justify-between">
                                        <span className="">{state?.range[0] ? roundOff(state?.range[0]) : 0}</span>
                                        <span className="">{state?.range[1] ? roundOff(state?.range[1]) : roundOff(state.maxPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        </>
    );
};

export default PrivateRouter(Index);
