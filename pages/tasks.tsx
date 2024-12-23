import { Models, PrivateRouter, Validation } from '@/utils/imports.utils';
import React, { useEffect, useState } from 'react';
import { Dropdown, Failure, Success, objIsEmpty, sortData, useSetState } from '@/utils/functions.utils';
import CommonLoader from './elements/commonLoader';
import dynamic from 'next/dynamic';
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';
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
import TextInput from '@/components/TextInput';
import NumberInput from '@/components/NumberInput';
import CustomeDatePicker from '@/common_component/datePicker';
import IconLoader from '@/components/Icon/IconLoader';
import moment from 'moment';
import * as Yup from 'yup';
import TextArea from '@/components/TextArea';
import Modal from '@/common_component/modal';
import Tippy from '@tippyjs/react';
import IconUserPlus from '@/components/Icon/IconUserPlus';
import ReadMore from '@/common_component/readMore';
import IconRefresh from '@/components/Icon/IconRefresh';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Tasks = () => {
    const router = useRouter();
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    const [state, setState] = useSetState({
        data: [],
        loading: false,
        subLoading: false,
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
        range: [0, 10000],
        maxPrice: 10000,

        // New Data
        isOpenOpp: false,
        stageList: [],
        currencyList: [],
        ownerList: [],
        hasMoreLead: '',
        currentLeadPage: 1,
        isOpenTask: false,
        logStageList: [],
        focusSegmentList: [],
        leadList: [],
        contactList: [],
        isOpenAssign: false,
        assigned_to: '',
        assignment_note: '',
        taskId: '',
        employeeList: [],
        isOpenViewTask: false,
        taskViewId: '',
        taskDetails: '',
        start_date: null,
        end_date: null,
        isOpen: false,
        createdByList: [],
        popupHeight: 'auto',
        task_date_time: null,
    });

    useEffect(() => {
        getData();
        employeeList();
        stageList();
        getLogStageList();
        leadList();
        ownerList();
        createdByList();
    }, []);

    const debouncedSearch = useDebounce(state.search, 500);

    useEffect(() => {
        if (filters()) {
            filterData(state.currentPage);
        } else {
            getData(state.currentPage);
        }
    }, [state.currentPage, debouncedSearch, state.start_date, state.end_date]);

    useEffect(() => {
        setState({ currentPage: 1 });
    }, [debouncedSearch, state.start_date, state.end_date]);

    useEffect(() => {
        if (state.data?.length > 0) {
            const sortedData = sortData(state.data, sortStatus.columnAccessor, sortStatus.direction);
            setState({ data: sortedData });
        }
    }, [sortStatus]);

    const getData = async (page = 1) => {
        try {
            setState({ loading: true });
            const userString = localStorage.getItem('crmUser');
            const user = userString ? JSON.parse(userString) : null;

            const body = {
                id: user?.id,
            };

            const response: any = await Models.task.list(body, page);
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
        if (state.search || state.start_date || state.end_date || state.owner || state.lead || state.assigned_to) {
            filter = true;
        }
        return filter;
    };

    const filterData = async (page = 1) => {
        try {
            setState({ loading: true });
            let body = bodyData();
            if (!objIsEmpty(body)) {
                const response: any = await Models.task.list(body, page);

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

    const stageList = async () => {
        try {
            const res: any = await Models.opportunity.oppDropdowns('stage');
            const dropdownList = Dropdown(res, 'stage');
            setState({ stageList: dropdownList });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const ownerList = async () => {
        try {
            setState({ subLoading: true });
            const res = await Models.lead.dropdowns('owner');
            const dropdownList = Dropdown(res, 'username');
            setState({ ownerList: dropdownList, subLoading: false });
        } catch (error) {
            setState({ subLoading: false });

            console.log('error: ', error);
        }
    };

    const createdByList = async () => {
        try {
            setState({ subLoading: true });
            const res = await Models.lead.dropdowns('created_by');
            const dropdownList = Dropdown(res, 'username');
            setState({ createdByList: dropdownList, subLoading: false });
        } catch (error) {
            setState({ subLoading: false });

            console.log('error: ', error);
        }
    };

    const employeeList = async (page = 1) => {
        try {
            setState({ subLoading: true });
            const res = await Models.lead.dropdowns('assigned_to');
            const dropdownList = Dropdown(res, 'username');
            setState({ employeeList: dropdownList, subLoading: false });
        } catch (error) {
            setState({ subLoading: false });

            console.log('error: ', error);
        }
    };

    const getContactList = async (val) => {
        try {
            const res: any = await Models.contact.listByLeadId(val.value, 1);
            const dropdown = Dropdown(res.results, 'name');
            setState({ contactList: dropdown, contactCount: res?.count, contactNext: res.next });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const leadList = async () => {
        try {
            setState({ subLoading: true });
            const res: any = await Models.lead.list(state.currentLeadPage);
            const dropdownList = Dropdown(res?.results, 'name');

            setState({ leadList: dropdownList, subLoading: false, hasMoreLead: res.next });
        } catch (error) {
            setState({ subLoading: false });

            console.log('error: ', error);
        }
    };

    const getLogStageList = async () => {
        try {
            setState({ subLoading: true });
            const res: any = await Models.log.logStage();
            const dropdownList = Dropdown(res, 'stage');

            setState({ logStageList: dropdownList, subLoading: false });
        } catch (error) {
            setState({ subLoading: false });
        }
    };

    const bodyData = () => {
        let body: any = {};
        if (state.search) {
            body.key = state.search;
        }
        if (state.owner) {
            body.owner = state.owner?.value;
        }
        if (state.lead) {
            body.lead = state.lead?.value;
        }
        if (state.assigned_to) {
            body.assigned_to = state.assigned_to?.value;
        }
        if (state.start_date) {
            body.start_date = moment(state.start_date).format('YYYY-MM-DD');
        }
        if (state.end_date) {
            body.end_date = moment(state.end_date).format('YYYY-MM-DD');
        }

        return body;
    };

    const tableData = (res: any) => {
        const data = res?.map((item) => {
            return {
                ...item,
                leadData: { value: item.contact?.lead_id, label: item.contact?.lead_name },
                contactData: { value: item.contact?.id, label: item.contact?.name },
                leadName: item.contact?.lead_name,
                task: item?.tasktype?.label,
                contact: item?.contact?.name,
                category: item.category,
                created_by: item?.created_by?.username,
                date: moment(item?.task_date_time).format('YYYY-MM-DD'),
                description: item?.task_detail ? item?.task_detail : '',
                assigned_to: item?.assigned_to?.length > 0 ? item?.assigned_to?.map((item) => item?.username).join(', ') : item.created_by?.username,
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
            console.log('error: ', error);
        }
    };

    const createAndUpdateTask = async () => {
        try {
            setState({ taskLoading: true });

            const validateField = {
                lead: state.lead?.value,
                contact: state.contact?.value,
                task_date_time: state.task_date_time ? moment(state.task_date_time).format('YYYY-MM-DD') : '',
            };
            await Validation.createTask.validate(validateField, { abortEarly: false });

            const body = {
                contact_id: state.contact?.value,
                task_detail: state.details,
                task_date_time: moment(state.task_date_time).format('YYYY-MM-DD'),
            };

            if (state.taskId) {
                const res: any = await Models.task.update(body, state.taskId);
                clearTaskData();
                setState({ taskLoading: false });
                Success(res.message);
                getData();
            } else {
                const res: any = await Models.task.create(body);
                clearTaskData();
                setState({ taskLoading: false });
                Success(res.message);
                getData();
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err?.message; // Set the error message for each field
                });
                setState({ errors: validationErrors, taskLoading: false });
            } else {
                setState({ taskLoading: false });
            }
        }
    };

    const editTaskData = (row) => {
        setState({
            taskId: row.id,
            isOpenTask: true,
            lead: row?.leadData,
            contact: row?.contactData,
            details: row?.task_detail,
            task_date_time: new Date(row?.task_date_time),
        });
    };

    const clearTaskData = () => {
        setState({
            details: '',
            isOpenTask: false,
            errors: '',
            taskId: '',
            lead: '',
            contact: '',
            task_date_time: '',
        });
    };

    const clearAssignData = () => {
        setState({
            assigned_to: '',
            assignment_note: '',
            isOpenAssign: false,
            errors: '',
            assignLoad: false,
        });
    };

    const assignedTask = async () => {
        try {
            setState({ assignLoad: true });
            const validateField = {
                assigned_to: state.assigned_to ? moment(state.assigned_to).format('YYYY-MM-DD') : '',
            };
            await Validation.assignTask.validate(validateField, { abortEarly: false });

            const body = {
                assigned_to: state.assigned_to?.value,
                assignment_note: state.assignment_note,
            };
            const res: any = await Models.task.assignTo(body, state.taskId);
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

    const clearFilter = () => {
        setState({
            search: '',
            start_date: '',
            end_date: '',
            owner: '',
            lead: '',
            assigned_to: '',
            isOpen: false,
        });
        getData();
    };

    return (
        <div className="p-2">
            <div className="panel flex items-center justify-between gap-5 ">
                <div className="flex items-center gap-5 pl-3">
                    <h5 className="text-lg font-semibold ">Tasks</h5>
                </div>
                <div className="flex gap-5">
                    <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => setState({ isOpenTask: true })}>
                        + Create
                    </button>
                </div>
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
                    <CustomeDatePicker value={state.start_date} placeholder="From Date" onChange={(e) => setState({ start_date: e, to_date: null })} className="w-full lg:w-1/3" />
                    <CustomeDatePicker value={state.end_date} placeholder="To Date" onChange={(e) => setState({ end_date: e })} className="w-full lg:w-1/3" />
                    <button className="btn btn-primary lg:mt-0" onClick={() => setState({ isOpen: true })}>
                        <IconFilter />
                    </button>
                </div>
            </div>

            <div className=" mt-2 grid grid-cols-12  gap-4">
                {state.loading || state.subLoading ? (
                    <div className="relative inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                        <CommonLoader />
                    </div>
                ) : (
                    <div className=" col-span-12 flex flex-col   md:col-span-12">
                        <div className=" col-span-12 flex flex-col   md:col-span-12">
                            <div className="flex items-center justify-end pb-2 pr-3">
                                <div className="rounded-lg bg-gray-300 p-1 font-semibold">
                                    {state.currentPage}-{Math.min(state.currentPage * 10, state.totalRecords)} of {state.totalRecords}
                                </div>
                            </div>
                            <DataTable
                                className="table-responsive"
                                records={state.data}
                                columns={[
                                    {
                                        accessor: 'leadName',
                                        title: 'Lead Name',
                                        sortable: true,
                                    },
                                    ,
                                    {
                                        accessor: 'contact',
                                        title: 'Contact Person',
                                        sortable: true,
                                    },
                                    {
                                        accessor: 'date',
                                        sortable: true,
                                    },

                                    { accessor: 'assigned_to', title: 'Assigned to', sortable: true },
                                    {
                                        accessor: 'category',
                                        sortable: true,

                                        render: (row) => (
                                            <div
                                                className={`flex w-max gap-4 rounded-full px-2 py-1 ${
                                                    row?.category === 'Owned Task' ? 'bg-green-200 text-green-800' : 'bg-purple-200 text-purple-800'
                                                }`}
                                            >
                                                {row?.category}
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'description',
                                        render: (row: any) => (
                                            <>
                                                <Tippy content={row?.description} className="rounded-lg bg-white p-2 text-sm shadow-lg">
                                                    <div>{row?.description?.length > 20 ? row?.description?.substring(0, 20) + '...' : row?.description}</div>
                                                </Tippy>
                                            </>
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: 'Actions',
                                        render: (row: any) => (
                                            <>
                                                <div className="mx-auto flex w-max items-center gap-4">
                                                    <Tippy content="Assign To" className="rounded-lg bg-black p-1 text-sm text-white">
                                                        <button type="button" className="flex hover:text-primary" onClick={() => setState({ isOpenAssign: true, taskId: row.id })}>
                                                            <IconUserPlus />
                                                        </button>
                                                    </Tippy>
                                                    <button
                                                        type="button"
                                                        className="flex hover:text-primary"
                                                        onClick={() => {
                                                            setState({ taskDetails: row, taskId: row?.id, isOpenViewTask: true });
                                                        }}
                                                    >
                                                        <IconEye />
                                                    </button>

                                                    <button className="flex hover:text-info" onClick={() => editTaskData(row)}>
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
                                sortStatus={sortStatus}
                                onSortStatusChange={setSortStatus}
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
                open={state.isOpenTask}
                addHeader={state.taskId ? 'Update Task' : 'Create Task'}
                close={() => clearTaskData()}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        <div className="flex flex-col gap-5 ">
                            <CustomSelect
                                title="Lead "
                                value={state.lead}
                                onChange={(e) => {
                                    if (e) {
                                        getContactList(e);
                                    }
                                    setState({ lead: e, contact: '' });
                                }}
                                placeholder={'Lead '}
                                options={state.leadList}
                                error={state.errors?.lead}
                                required
                                loadMore={() => leadListLoadMore()}
                            />

                            <CustomSelect
                                title="Contact"
                                value={state.contact}
                                onChange={(e) => setState({ contact: e })}
                                placeholder={'Contact '}
                                options={state.contactList}
                                error={state.errors?.contact}
                                required
                            />
                        </div>

                        <CustomeDatePicker
                            value={state.task_date_time}
                            placeholder="Task Date"
                            title="Task Date"
                            required
                            onChange={(e) => setState({ task_date_time: e })}
                            error={state.errors?.task_date_time}
                        />

                        <TextArea height="150px" value={state.details} onChange={(e) => setState({ details: e })} placeholder={'Details'} title={'Details'} />

                        <div className="mt-3 flex items-center justify-end gap-3">
                            <button type="button" className="btn btn-outline-danger border " onClick={() => clearTaskData()}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => createAndUpdateTask()}>
                                {state.taskLoading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
            />

            <Modal
                open={state.isOpenAssign}
                addHeader={'Assign Task'}
                close={() => clearAssignData()}
                height={state.popupHeight}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        <div className="flex flex-col gap-5 ">
                            <CustomSelect
                                title="Assigned To"
                                value={state.assigned_to}
                                onChange={(e) => setState({ assigned_to: e })}
                                placeholder={'Assigned To'}
                                options={state.employeeList}
                                error={state.errors?.assigned_to}
                                required
                                menuOpen={(isOpen) => setState({ popupHeight: isOpen ? 500 : 'auto' })}
                            />
                        </div>

                        <TextArea height="150px" value={state.assignment_note} onChange={(e) => setState({ assignment_note: e })} placeholder={'Details'} title={'Details'} />

                        <div className="mt-3 flex items-center justify-end gap-3">
                            <button type="button" className="btn btn-outline-danger border " onClick={() => clearAssignData()}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => assignedTask()}>
                                {state.assignLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
            />

            <Modal
                open={state.isOpenViewTask}
                addHeader={'Task Details'}
                close={() => setState({ isOpenViewTask: false, taskViewId: '', taskDetails: '' })}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        {/* Display Task Details */}
                        <div className="mb-4 space-y-3">
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="font-semibold">Task:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="text-right">{state.taskDetails?.task || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="font-semibold">Created By:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="text-right">{state.taskDetails?.created_by || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="font-semibold">Category:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className={`rounded px-2 py-1 text-right ${state.taskDetails?.category === 'Owned Task' ? 'bg-green-200 text-green-800' : 'bg-purple-200 text-purple-800'}`}>
                                        {state.taskDetails?.category || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="font-semibold">Task Type:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="text-right">{state.taskDetails?.tasktype?.label || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="font-semibold">Task Date:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="text-right">{moment(state.taskDetails?.task_date_time).format('MMMM DD, YYYY') || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="font-semibold">Created On:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="text-right">{moment(state.taskDetails?.created_on).format('MMMM DD, YYYY') || 'N/A'}</span>
                                </div>
                            </div>
                            {state.taskDetails?.task_detail && (
                                <div className="flex">
                                    <div className="w-[30%]">
                                        <span className="font-semibold">Details:</span>
                                    </div>
                                    <div className="w-[70%]">
                                        <ReadMore children={state.taskDetails?.task_detail || 'No details available'} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            />

            <SideMenu
                title="Filter"
                open={state.isOpen}
                close={() => setState({ isOpen: false })}
                cancelOnClick={() => clearFilter()}
                submitOnClick={() => filterData(state.currectPage)}
                submitLoading={state.loading}
                canceTitle="Reset"
                renderComponent={() => (
                    <div>
                        <div className=" mb-5 mt-5 flex flex-col gap-4 md:mt-0  md:justify-between">
                            <CustomSelect title="Owner" value={state.owner} onChange={(e) => setState({ owner: e })} placeholder={'Owner'} options={state.ownerList} />

                            <CustomSelect
                                title="Lead "
                                value={state.lead}
                                onChange={(e) => {
                                    setState({ lead: e, contact: '' });
                                }}
                                placeholder={'Lead '}
                                options={state.leadList}
                                loadMore={() => leadListLoadMore()}
                            />
                            <CustomSelect title="Assign To" value={state.assigned_to} onChange={(e) => setState({ assigned_to: e })} placeholder={'Assign To'} options={state.createdByList} />

                            {/* <div className=" flex justify-end gap-3">
                                <button type="button" className="btn btn-primary" onClick={() => filterData()}>
                                    Submit
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => clearFilter()}>
                                    Reset
                                </button>
                            </div> */}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default PrivateRouter(Tasks);
