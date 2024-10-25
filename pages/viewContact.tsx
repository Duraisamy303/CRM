import React, { useEffect } from 'react';
import CommonLoader from './elements/commonLoader';
import { Dropdown, Success, addCommasToNumber, showDeleteAlert, useSetState } from '@/utils/functions.utils';
import { useRouter } from 'next/router';
import Models from '@/imports/models.import';

import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconUser from '@/components/Icon/IconUser';
import TextInput from '@/components/TextInput';
import NumberInput from '@/components/NumberInput';
import CustomSelect from '@/components/Select';
import CheckboxInput from '@/components/Checkbox';
import IconLoader from '@/components/Icon/IconLoader';
import { createLeadValidation } from '@/utils/validation.utils';
import { Validation } from '@/utils/imports.utils';
import * as Yup from 'yup';
import ViewLabel from '@/components/viewLabel';
import SideMenu from '@/common_component/sideMenu';
import OppCard from '@/components/oppCard';
import IconPlus from '@/components/Icon/IconPlus';
import { notifyError, notifySuccess } from '@/components/toast';
import Swal from 'sweetalert2';
import Modal from '@/common_component/modal';
import LogCard from '@/components/logCard';
import TextArea from '@/components/TextArea';
import CustomeDatePicker from '@/common_component/datePicker';
import moment from 'moment';
import IconEdit from '@/components/Icon/IconEdit';

export default function ViewLead() {
    const router = useRouter();

    const id = router?.query?.id;

    const [state, setState] = useSetState({
        loading: false,
        data: {},
        isOpen: false,
        logList: [],
        isOpenCreateContact: false,
        statusList: [],
        leadSourceList: [],
        createdByList: [],
        department: '',
        designation: '',
        phoneNumber: '',
        email: '',
        lead_source: '',
        contact_status: '',
        contact_name: '',
        logStageList: [],
        follow_up_date_time: null,
        details: '',
        isOpenEdit: false,
        createdby: null,
        logCreatedBy: null,
        isOpenLog: false,
    });

    useEffect(() => {
        getDate();
        getLogList();
        getLogStageList();
        getContactStatusList();
        getContactLeadSourceList();
        createdByList();
        getFocusSegmentList();
    }, [id]);

    const getDate = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.contact.details(id);
            setState({
                loading: false,
                data: res,
                contact_name: res.name,
                designation: res.designation,
                department: res.department,
                phoneNumber: res.phone_number,
                email: res.email_id,
                lead_source: { value: res.lead_source?.id, label: res?.lead_source?.source },
                createdby: { value: res.created_by?.id, label: res?.created_by?.username },
                contact_status: { value: res.status?.id, label: res?.status?.status },
            });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const getLogList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.log.listByContactId(id);
            setState({ logList: res?.results, loading: false });
        } catch (error) {
            setState({ loading: false });
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

    const getFocusSegmentList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.lead.dropdowns('focus_segment');
            const dropdownList = Dropdown(res, 'focus_segment');
            setState({ focusSegmentList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const getContactStatusList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.contact.dropdowns('contactstatus');
            const dropdownList = Dropdown(res, 'status');
            setState({ statusList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const getContactLeadSourceList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.contact.dropdowns('lead_source');
            const dropdownList = Dropdown(res, 'source');
            setState({ leadSourceList: dropdownList, loading: false });
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

    const deleteOpp = async (id) => {
        showDeleteAlert(
            async () => {
                try {
                    // Call your delete API function here, e.g., await deleteOpportunity(id);
                    // Assume the delete operation is successful
                    notifySuccess('Opportunity deleted successfully.');

                    // Optionally, you might want to update your state or list of opportunities here

                    // Show success alert
                    Swal.fire('Deleted!', 'Your opportunity has been deleted.', 'success');
                } catch (error) {
                    // Handle the error case
                    notifyError('An error occurred while deleting the opportunity.');
                    Swal.fire('Error!', 'An error occurred while deleting the opportunity.', 'error');
                }
            },
            () => {
                Swal.fire('Cancelled', 'Your opportunity is safe :)', 'info');
            },
            'Are you sure you want to delete opportunity?'
        );
    };

    const createLog = async () => {
        try {
            setState({ createContactLoad: true });
            const body = {
                follow_up_date_time: moment(state.follow_up_date_time).format('YYYY-MM-DD'),
                details: state.details,
                log_stage: state.logStage?.value,
                focus_segment: state.focus_segment?.value,
                createdBy: state.logCreatedBy?.value,
            };

            const res = await Models.log.create(body, id);
            Success('Log created successfully');
            clearLogData();
            getLogList();
        } catch (error) {
            setState({ createContactLoad: false });
        }
    };

    const updateLog = async () => {
        try {
            setState({ createContactLoad: true });
            const body = {
                follow_up_date_time: moment(state.follow_up_date_time).format('YYYY-MM-DD'),
                details: state.details,
                log_stage: state.logStage?.value,
                focus_segment: state.focus_segment?.value,
                createdBy: state.logCreatedBy?.value,
            };

            const res = await Models.log.update(body, state.logId);
            Success('Log Updated successfully');
            clearLogData();
            getLogList();
        } catch (error) {
            setState({ createContactLoad: false });
        }
    };

    const updateContact = async () => {
        try {
            setState({ createContactLoad: true });
            const body = {
                lead: id,
                status: state.contact_status?.value,
                lead_source: state.lead_source?.value,
                created_by: state.createdby?.value,
                department: state.department,
                designation: state.designation,
                phone_number: state.phoneNumber,
                email_id: state.email,
                is_active: state.is_active,
                name: state.contact_name,
            };

            const res = await Models.contact.update(body, id);
            Success('Contact updated successfully');
            setState({ isOpenEdit: false });
            getLogList();
            getDate();
        } catch (error) {
            setState({ createContactLoad: false });
        }
    };

    const onEditLog = (item) => {
        setState({
            logId: item.id,
            isOpenLog: true,
            logCreatedBy: { value: item?.created_by?.id, label: item?.created_by?.username },
            details: item.details,
            logStage: { value: item?.log_stage?.id, label: item?.log_stage?.stage },
            focus_segment: { value: item?.focus_segment?.id, label: item?.focus_segment?.name },
            follow_up_date_time: new Date(item.follow_up_date_time),
        });
    };

    const clearContactData = () => {
        setState({
            isOpenEdit: false,
        });
    };

    const clearLogData = () => {
        setState({
            isOpenLog: false,
            logCreatedBy: '',
            logId: '',
            logStage: '',
            focus_segment: '',
            follow_up_date_time: '',
            details: '',
        });
    };

    return state.loading ? (
        <CommonLoader />
    ) : (
        <div className="relative h-[100vh]  overflow-scroll bg-[#dbe7ff] bg-cover p-2">
            <div className="panel  flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">{`${state.data?.name} (Contact)`}</h5>
                </div>
            </div>
            <div className=" mt-4 grid grid-cols-12  gap-4">
                <div className=" col-span-12 flex flex-col   md:col-span-5">
                    <div className="panel flex flex-col gap-5 rounded-2xl">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                    <IconUser className="text-[#82de69]" />
                                </div>
                                <div className=" " style={{ fontSize: '20px' }}>
                                    Basic Information
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary p-2" onClick={() => setState({ isOpenEdit: true })}>
                                <IconEdit />
                            </button>
                        </div>
                        <ViewLabel label={'Name'} value={state.data?.name} />
                        <ViewLabel label={'Email'} value={state.data?.email_id} />
                        <ViewLabel label={'Phone'} value={state.data?.phone_number} />
                        <ViewLabel label={'Status'} value={state.data?.status?.status} />
                        <ViewLabel label={'Lead Source'} value={state.data?.lead_source?.source} />
                        <ViewLabel label={'Lead'} value={state.data?.lead?.name} />
                        <ViewLabel label={'Department'} value={state.data?.department} />
                        <ViewLabel label={'Designation'} value={state.data?.designation} />
                    </div>
                </div>

                <div className="panel col-span-12 flex flex-col gap-5 rounded-2xl md:col-span-7 ">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                <IconUser className="text-[#82de69]" />
                            </div>
                            <div className=" " style={{ fontSize: '20px' }}>
                                Log History {`(${state.logList?.length})`}
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary p-2" onClick={() => setState({ isOpenLog: true })}>
                            <IconPlus />
                        </button>
                    </div>
                    <div className="max-h-[600px] overflow-y-scroll">
                        {state.logList?.map((item) => (
                            <div key={item.id} className="mt-1">
                                <LogCard editIcon={true} data={item} onPress={() => router.push(`/opportunity?id=${item.id}`)} onEdit={() => onEditLog(item)} onDelete={() => deleteOpp(item.id)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Modal
                open={state.isOpenLog}
                addHeader={state.logId ? 'Update Log' : 'Create Log'}
                close={() => clearLogData()}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        {!state.logId && (
                            <div className="flex flex-col gap-5 ">
                                <CustomSelect
                                    title="Focus Segment"
                                    value={state.focus_segment}
                                    onChange={(e) => setState({ focus_segment: e })}
                                    placeholder={'Focus Segment'}
                                    options={state.focusSegmentList}
                                    required
                                    error={state.errors?.focus_segment}
                                />

                                <CustomSelect
                                    title="Created By"
                                    value={state.logCreatedBy}
                                    onChange={(e) => setState({ logCreatedBy: e })}
                                    placeholder={'Created By'}
                                    options={state.createdByList}
                                    error={state.errors?.createdby}
                                    required
                                />
                            </div>
                        )}
                        <CustomeDatePicker value={state.follow_up_date_time} title="Follow Up" onChange={(e) => setState({ follow_up_date_time: e })} />
                        <CustomSelect
                            title="Log Stage"
                            value={state.logStage}
                            onChange={(e) => setState({ logStage: e })}
                            placeholder={'Log Stage'}
                            options={state.logStageList}
                            error={state.errors?.lead_status}
                            required
                        />
                        <TextArea height="150px" value={state.details} onChange={(e) => setState({ details: e })} placeholder={'Details'} title={'Details'} />

                        <div className="mt-3 flex items-center justify-end gap-3">
                            <button type="button" className="btn btn-outline-danger border " onClick={() => clearLogData()}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => (state.logId ? updateLog() : createLog())}>
                                {state.submitLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
            />

            {/* <Modal
                open={state.isOpenEdit}
                addHeader={'Update Contact'}
                close={() => clearContactData()}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        <TextInput title="Name" value={state.contact_name} onChange={(e) => setState({ contact_name: e })} placeholder={'Name'} error={state.errors?.name} required />
                        <TextInput title="Designation" value={state.designation} onChange={(e) => setState({ designation: e })} placeholder={'Designation'} error={state.errors?.name} required />
                        <TextInput title="Department" value={state.department} onChange={(e) => setState({ department: e })} placeholder={'Department'} error={state.errors?.department} required />
                        <NumberInput title="Phone Number" value={state.phoneNumber} onChange={(e) => setState({ phoneNumber: e })} placeholder={'Phone Number'} required />
                        <TextInput title="Email" value={state.email} onChange={(e) => setState({ email: e })} placeholder={'Email'} error={state.errors?.email} required />
                        <CustomSelect
                            title="Lead Source"
                            value={state.lead_source}
                            onChange={(e) => setState({ lead_source: e })}
                            placeholder={'Lead Source'}
                            options={state.leadSourceList}
                            error={state.errors?.lead_source}
                            required
                        />{' '}
                        <CustomSelect
                            title="Created By"
                            value={state.createdby}
                            onChange={(e) => setState({ createdby: e })}
                            placeholder={'Created By'}
                            options={state.createdByList}
                            error={state.errors?.createdby}
                            required
                        />
                        <CustomSelect
                            title="Contact Status"
                            value={state.contact_status}
                            onChange={(e) => setState({ contact_status: e })}
                            placeholder={'Contact Status'}
                            options={state.statusList}
                            error={state.errors?.lead_status}
                            required
                        />
                        <div className="  w-full">
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <CheckboxInput checked={state.is_active} label={'Active'} onChange={(e) => setState({ is_active: e })} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-3">
                            <button type="button" className="btn btn-outline-danger border " onClick={() => clearContactData()}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => updateContact()}>
                                {state.submitLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
            /> */}

            <SideMenu
                open={state.isOpenEdit}
                close={() => clearContactData()}
                title={'Update Contact'}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 ">
                        <TextInput title="Name" value={state.contact_name} onChange={(e) => setState({ contact_name: e })} placeholder={'Name'} error={state.errors?.name} required />
                        <TextInput title="Designation" value={state.designation} onChange={(e) => setState({ designation: e })} placeholder={'Designation'} error={state.errors?.name} required />
                        <TextInput title="Department" value={state.department} onChange={(e) => setState({ department: e })} placeholder={'Department'} error={state.errors?.department} required />
                        <NumberInput title="Phone Number" value={state.phoneNumber} onChange={(e) => setState({ phoneNumber: e })} placeholder={'Phone Number'} required />
                        <TextInput title="Email" value={state.email} onChange={(e) => setState({ email: e })} placeholder={'Email'} error={state.errors?.email} required />
                        <CustomSelect
                            title="Lead Source"
                            value={state.lead_source}
                            onChange={(e) => setState({ lead_source: e })}
                            placeholder={'Lead Source'}
                            options={state.leadSourceList}
                            error={state.errors?.lead_source}
                            required
                        />{' '}
                        {/* <CustomSelect
                            title="Created By"
                            value={state.createdby}
                            onChange={(e) => setState({ createdby: e })}
                            placeholder={'Created By'}
                            options={state.createdByList}
                            error={state.errors?.createdby}
                            required
                        /> */}
                        <CustomSelect
                            title="Contact Status"
                            value={state.contact_status}
                            onChange={(e) => setState({ contact_status: e })}
                            placeholder={'Contact Status'}
                            options={state.statusList}
                            error={state.errors?.lead_status}
                            required
                        />
                        {/* <div className="  w-full">
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <CheckboxInput checked={state.is_active} label={'Active'} onChange={(e) => setState({ is_active: e })} />
                            </div>
                        </div> */}
                        <div className="mt-3 flex items-center justify-end gap-3">
                            <button type="button" className="btn btn-outline-danger border " onClick={() => clearContactData()}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => updateContact()}>
                                {state.submitLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
