import React, { useEffect } from 'react';
import CommonLoader from './elements/commonLoader';
import { Dropdown, Success, addCommasToNumber, capitalizeFLetter, roundOff, showDeleteAlert, useSetState } from '@/utils/functions.utils';
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
import { leadId } from '@/store/crmConfigSlice';
import OppLabel from '@/components/oppLabel';
import NoteComponent from '@/components/noteComponent';
import { DataTable } from 'mantine-datatable';
import ReadMore from '@/common_component/readMore';
import StageCard from '@/components/StageCard';

export default function ViewLead() {
    const router = useRouter();
    const id = router?.query?.id;

    const dispatch = useDispatch();

    const [state, setState] = useSetState({
        loading: false,
        data: {},
        isOpen: false,
        contactList: [],
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
        createdby: '',
        contact_name: '',
        logList: [],
        isOpenLog: false,
        opportunityList: [],
        isOpenAddNote: false,
        note: '',
        noteId: '',
        errors: '',
        notesList: [],
        stageHistoryList: [],
        noteLoad: false,
        isOpenViewNote: false,
        noteViewId: '',
        noteDetails: '',
    });

    useEffect(() => {
        getDate();
        notesList();
        stageHistoryList();
    }, [id]);

    const getDate = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.opportunity.details(id);
            setState({
                loading: false,
                data: res,
            });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const createAndUpdateNote = async () => {
        try {
            setState({ noteLoad: true });
            if (state.noteId) {
                const body = {
                    note_by: 4, // Need to change token id
                    opportunity_id: id,
                    note: state.note,
                };

                await Validation.createNote.validate(body, { abortEarly: false });
                await Models.opportunity.updateNote(body, state.noteId);
                Success('Note updated successfully');
                setState({ isOpenAddNote: false, note: '', errors: '', noteLoad: false, noteId: '' });
                notesList();
                setState({ noteLoad: false });
            } else {
                const body = {
                    note_by: 4, // Need to change token id
                    opportunity_id: id,
                    note: state.note,
                };

                await Validation.createNote.validate(body, { abortEarly: false });
                await Models.opportunity.createNote(body);
                Success('Note added successfully');
                setState({ isOpenAddNote: false, note: '', errors: '', noteLoad: false });
                notesList();
                setState({ noteLoad: false });
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err?.message; // Set the error message for each field
                });
                setState({ errors: validationErrors });
                setState({ noteLoad: false });
            } else {
            }
        }
    };

    const notesList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.opportunity.notesListById(id);
            setState({ notesList: res, note: '', loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const stageHistoryList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.opportunity.stageHistoryList(id);
            tableData(res);
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const tableData = (res: any) => {
        const data = res?.map((item) => {
            return {
                ...item,
                date: moment(item?.date).format('YYYY-MM-DD hh:mm a'),
                stage: item.stage.stage,
                moved_by: item.moved_by?.username,
            };
        });

        setState({ stageHistoryList: data, loading: false });
    };

    return state.loading ? (
        <CommonLoader />
    ) : (
        <div className="relative h-[100vh]  overflow-scroll bg-[#dbe7ff] bg-cover p-2">
            <div className="panel  flex items-center justify-between gap-5">
                <div className="flex items-center gap-5 pl-3">
                    <h5 className="text-lg font-semibold dark:text-white-light">{`${capitalizeFLetter(state.data?.name)} (Opportunity)`}</h5>
                </div>
                <div className="flex gap-5">
                    <button
                        type="button"
                        className="btn btn-primary w-full md:mb-0 md:w-auto"
                        onClick={() => {
                            setState({
                                isOpenAddNote: true,
                                notes: '',
                                errors: '',
                            });
                        }}
                    >
                        Add Notes
                    </button>
                </div>
            </div>

            <div className=" mt-2 grid grid-cols-12  gap-2">
                <div className="col-span-12 flex flex-col md:col-span-12">
                    <div className="panel flex flex-col gap-3 rounded-2xl p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl bg-[#deffd7]">
                                <IconUser className="text-[#82de69]" />
                            </div>
                            <div style={{ fontSize: '20px' }}>Basic Information</div>
                        </div>

                        {/* Using the updated OppLabel component with three labels and values */}
                        <OppLabel label1="Opportunity Name" value1={state.data?.name} label2="Lead" value2={state.data?.lead?.name} label3="Owner" value3={state.data?.owner?.username} />
                        <OppLabel
                            label1="Probability"
                            value1={`${state.data?.probability_in_percentage}%`}
                            label2="Currency"
                            value2={state.data?.currency_type?.currency_short}
                            label3="Stage"
                            value3={state.data?.stage?.stage}
                        />
                        <OppLabel
                            label1="Opportunity Value"
                            value1={roundOff(state.data?.opportunity_value)}
                            label2="Recurring Value"
                            value2={(state.data?.recurring_value_per_year)}
                            label3="Closing Date"
                            value3={state.data?.closing_date}
                        />
                        {/* <OppLabel
                            label1="Probability"
                            value1={`${state.data?.probability_in_percentage}%`}
                            label2="Created On"
                            value2={state.data?.created_on}
                            label3="Status"
                            value3={state.data?.is_active ? 'Active' : 'Inactive'}
                        /> */}
                    </div>
                </div>

                {/* <div className="panel mt-4 flex flex-col gap-5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#ffeeee]">
                                <IconUser className="text-[#fe70f2]" />
                            </div>
                            <div className=" " style={{ fontSize: '20px' }}>
                                Notes
                            </div>
                        </div>

                        <TextArea height="150px" value={state.notes} onChange={(e) => setState({ notes: e })} placeholder={'Notes'} />
                    </div> */}
                {state.notesList?.length > 0 && (
                    <div className="panel col-span-12 flex max-h-[400px] flex-col overflow-scroll rounded-2xl md:col-span-12 p-3">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                    <IconUser className="text-[#82de69]" />
                                </div>
                                <div className=" " style={{ fontSize: '20px' }}>
                                    Notes{`(${state.notesList?.length})`}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary "
                                onClick={() =>
                                    setState({
                                        isOpenAddNote: true,
                                        notes: '',
                                        errors: '',
                                    })
                                }
                            >
                                <IconPlus />
                            </button>
                        </div>
                        <div className="max-h-[600px] overflow-y-scroll">
                            {state.notesList?.map((item) => (
                                <div key={item.id} className="mt-3">
                                    <NoteComponent
                                        data={item}
                                        onPress={() => router.push(`/opportunity?id=${item.id}`)}
                                        onEdit={() => {
                                            setState({ noteId: item.id, isOpenAddNote: true, note: item.note });
                                        }}
                                        onView={() => setState({ isOpenViewNote: true, noteDetails: item })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {state.stageHistoryList?.length > 0 && (
                <div className="panel col-span-12 mt-2 flex max-h-[400px] flex-col  overflow-scroll rounded-2xl md:col-span-12 p-3">
                    <div className="flex justify-between">
                        <div className="flex w-full justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                    <IconUser className="text-[#82de69]" />
                                </div>
                                <div className=" " style={{ fontSize: '20px' }}>
                                    Stage History {`(${state.stageHistoryList?.length})`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="max-h-[600px] overflow-y-scroll">
                        <StageCard data={state.stageHistoryList} />
                    </div>
                </div>
            )}

            <Modal
                open={state.isOpenAddNote}
                addHeader={state.noteId ? 'Update Note' : 'Add Note'}
                close={() => setState({ isOpenAddNote: false, note: '', errors: '', noteId: '' })}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        <TextArea height="150px" value={state.note} onChange={(e) => setState({ note: e })} placeholder={'Notes'} error={state.errors?.note} />

                        <div className="mt-3 flex items-center justify-end gap-3">
                            <button type="button" className="btn btn-outline-danger border " onClick={() => setState({ isOpenAddNote: false, note: '', errors: '', noteId: '' })}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => createAndUpdateNote()}>
                                {state.noteLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
            />

            <Modal
                open={state.isOpenViewNote}
                addHeader={'Note Details'}
                close={() => setState({ isOpenViewNote: false, noteViewId: '', noteDetails: '' })}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        {/* Display Note Details */}
                        <div className="mb-4 space-y-3">
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="w-1/3 font-semibold">Opportunity:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="w-2/3 text-right">{state.noteDetails?.opportunity?.name || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="w-1/3 font-semibold">Note By:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="w-2/3 text-right">{state.noteDetails?.note_by?.username || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="w-1/3 font-semibold">Note Date:</span>
                                </div>
                                <div className="w-[70%]">
                                    <span className="w-2/3 text-right">{moment(state.noteDetails?.note_on).format('MMMM DD, YYYY')}</span>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-[30%]">
                                    <span className="w-1/3 font-semibold">Details:</span>
                                </div>
                                <div className="w-[70%]">
                                    <ReadMore children={state.noteDetails?.note || 'No details available'} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
