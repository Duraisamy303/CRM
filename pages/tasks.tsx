import { Models, PrivateRouter, Validation } from '@/utils/imports.utils';
import React, { useEffect } from 'react';
import { Dropdown, Failure, Success, addCommasToNumber, objIsEmpty, useSetState } from '@/utils/functions.utils';
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

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Tasks = () => {
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
    });

    useEffect(() => {
        getData();
        employeeList();
        stageList();
        getLogStageList();
        leadList();
    }, []);

    const debouncedSearch = useDebounce(state.search, 500);

    useEffect(() => {
        // if (filters()) {
        //     filterData();
        // } else {
        getData(state.currentPage + 1);
        // }
    }, [state.currentPage, debouncedSearch]);

    const getData = async (page = 2) => {
        try {
            setState({ loading: true });

            const body = {
                task_name: state.search,
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

    const stageList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.opportunity.oppDropdowns('stage');
            const dropdownList = Dropdown(res, 'stage');
            setState({ stageList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const employeeList = async (page = 1) => {
        try {
            setState({ loading: true });
            const res: any = await Models.employee.list(page);
            const dropdownList = Dropdown(res?.results, `first_name`);
            setState({ employeeList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const getContactList = async (val) => {
        try {
            const res: any = await Models.contact.listByLeadId(val.value, 1);
            const dropdown = Dropdown(res.results, 'name');
            setState({ contactList: dropdown, loading: false, contactCount: res?.count, contactNext: res.next });
        } catch (error) {
            setState({ loading: false });
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

    const getLogStageList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.log.logStage();
            const dropdownList = Dropdown(res, 'stage');

            setState({ logStageList: dropdownList, loading: false });
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
    const tableData = (res: any) => {
        const data = res?.map((item) => {
            return {
                ...item,
                task: item?.tasktype?.label,
                contact: item?.contact?.name,
                category: item.category,
                created_by: item?.created_by?.username,
                date: item?.created_on,
                task_date_time: item?.task_date_time,
                contacts: item?.contact,
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

    const employeeListLoadMore = async () => {
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
            } else {
                const res: any = await Models.task.create(body);
                clearTaskData();
                setState({ taskLoading: false });

                Success(res.message);
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
            lead: { value: row?.contacts?.lead_id, label: row?.contacts?.lead_name },
            contact: { value: row?.contacts?.id, label: row?.contacts?.name },
            details: row?.task_detail,
            task_date_time: row?.task_date_time,
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
        <div className="p-2">
            <div className="panel mb-5 mt-5 flex items-center justify-between gap-5 ">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold ">Tasks</h5>
                </div>
                <div className="flex gap-5">
                    <button type="button" className="btn btn-primary font-white w-full md:mb-0 md:w-auto" onClick={() => setState({ isOpenTask: true })}>
                        + Create
                    </button>
                </div>
            </div>
            <div className="relative flex w-full max-w-lg rounded-full border border-gray-300 dark:border-white-dark/30">
                <button type="submit" className="m-auto flex items-center justify-center px-3 py-2 text-primary ">
                    <IconSearch className="h-7 w-6 font-bold" /> {/* Icon size slightly reduced */}
                </button>
                <input
                    type="text"
                    value={state.search}
                    onChange={(e) => setState({ search: e.target.value })}
                    placeholder="Search"
                    className="form-input w-full rounded-r-full border-0 bg-white py-1.5 pl-3 pr-8 text-sm placeholder:tracking-wide focus:shadow-lg focus:outline-none dark:bg-gray-800 dark:shadow-[#1b2e4b] dark:placeholder:text-gray-400"
                />
            </div>

            <div className=" mt-4 grid grid-cols-12  gap-4">
                {state.loading ? (
                    <div className="relative inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                        <CommonLoader />
                    </div>
                ) : (
                    <div className=" col-span-12 flex flex-col   md:col-span-12">
                        <DataTable
                            className="table-responsive"
                            records={state.data}
                            columns={[
                                {
                                    accessor: 'task',
                                    sortable: true,
                                    width: '220px',
                                },
                                { accessor: 'contact', sortable: true, width: '220px' },
                                {
                                    accessor: 'category',
                                    sortable: true,
                                    width: '220px',

                                    render: (row) => (
                                        <div className={`flex w-max gap-4 rounded-full px-2 py-1 ${row?.category === 'Owned Task' ? 'bg-green-200 text-green-800' : 'bg-purple-200 text-purple-800'}`}>
                                            {row?.category}
                                        </div>
                                    ),
                                },
                                { accessor: 'created_by', sortable: true, title: 'Created By' },
                                {
                                    accessor: 'task_date_time',
                                    sortable: true,
                                    title: 'Task Date',

                                    render: (row: any) => (
                                        <>
                                            <div className="">{moment(row.task_date_time).format('YYYY-MM-DD')}</div>
                                        </>
                                    ),
                                },
                                { accessor: 'date', sortable: true, title: 'Created On' },
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
                                loadMore={() => leadListLoadMore()}
                            />
                        </div>

                        <CustomeDatePicker
                            value={state.task_date_time}
                            placeholder="Task Date"
                            title="Task Date"
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
                close={() => clearTaskData()}
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
                                loadMore={() => leadListLoadMore()}
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
        </div>
    );
};

export default PrivateRouter(Tasks);
