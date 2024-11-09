import React, { useEffect } from 'react';
import CommonLoader from './elements/commonLoader';
import { Dropdown, Success, capitalizeFLetter, convertUrlToFile, getFileNameFromUrl, roundOff, showDeleteAlert, useSetState } from '@/utils/functions.utils';
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
import { DataTable } from 'mantine-datatable';
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
import { leadId, oppId } from '@/store/crmConfigSlice';
import IconEye from '@/components/Icon/IconEye';
import IconEdit from '@/components/Icon/IconEdit';
import IconMenuContacts from '@/components/Icon/Menu/IconMenuContacts';
import IconContacts from '@/components/Icon/IconContact';
import IconUserPlus from '@/components/Icon/IconUserPlus';
import Tippy from '@tippyjs/react';
import IconOpportunity from '@/components/Icon/IconOpportunity';
import OppLabel from '@/components/oppLabel';
import Breadcrumb from '@/common_component/breadcrumb';
import YearPicker from '@/common_component/yearPicker';
import FileUpload from '@/common_component/fileUpload';

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
        opportunityList: [],
        logCount: 0,
        contactCount: 0,
        isOpenOpp: false,
        //Opportunity
        opp_name: '',
        owner: '',
        opportunity_value: '',
        recurring_value_per_year: '',
        currency_type: '',
        probability_in_percentage: '',
        opp_created_by: '',
        opp_closing_date: '',
        opp_stage: '',
        oppLoading: false,
        ownerList: [],
        file: null,
    });

    useEffect(() => {
        getDate();
        getContactList();
        getContactStatusList();
        getContactLeadSourceList();
        createdByList();
        getLogList();
        getOpportunityList();
        currencyList();
        stageList();
        ownerList();
    }, [id]);

    const getDate = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.lead.details(id);
            setState({
                loading: false,
                data: res,
            });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const stageList = async () => {
        try {
            setState({ loading: true });
            const token = localStorage.getItem('crmToken');
            const res: any = await Models.opportunity.oppDropdowns('stage');
            const dropdownList = Dropdown(res, 'stage');
            setState({ stageList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const currencyList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.opportunity.oppDropdowns('currency_type');

            const dropdownList = Dropdown(res, 'currency_short');
            setState({ currencyList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

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

    const getContactList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.contact.listByLeadId(id, 1);
            setState({ contactList: res?.results, loading: false, contactCount: res?.count });
        } catch (error) {
            setState({ loading: false });
        }
    };

    const getOpportunityList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.opportunity.listByLeadId(id);
            tableData(res);
        } catch (error) {
            setState({ loading: false });
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

        setState({ opportunityList: data, loading: false });
    };

    const getLogList = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.lead.logList(id);
            setState({ logList: res?.results, loading: false, logCount: res.count });
        } catch (error) {
            setState({ loading: false });
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

    const createContact = async () => {
        try {
            setState({ createContactLoad: true, errors: {} });

            const validateField = {
                contact_status: state.contact_status?.value,
                lead_source: state.lead_source?.value,
                department: state.department,
                designation: state.designation,
                phoneNumber: state.phoneNumber,
                email: state.email,
                contact_name: state.contact_name,
            };

            const body = {
                lead: id,
                status: state.contact_status?.value,
                lead_source: state.lead_source?.value,
                created_by: 1,
                department: state.department,
                designation: state.designation,
                phone_number: state.phoneNumber,
                email_id: state.email,
                is_active: state.is_active,
                name: state.contact_name,
            };

            await Validation.createContact.validate(validateField, { abortEarly: false });

            await Models.contact.create(body);
            Success('Contact created successfully');
            clearContactData();
            getContactList();
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = error.inner.reduce((acc, err) => {
                    acc[err.path] = err.message;
                    return acc;
                }, {});
                setState({ errors: validationErrors });
            } else {
                console.log('Error: ', error?.message);
            }
        } finally {
            setState({ createContactLoad: false });
        }
    };

    const updateContact = async () => {
        try {
            setState({ createContactLoad: true });
            const validateField = {
                contact_status: state.contact_status?.value,
                lead_source: state.lead_source?.value,
                department: state.department,
                designation: state.designation,
                phoneNumber: state.phoneNumber,
                email: state.email,
                contact_name: state.contact_name,
            };
            const body = {
                lead: id,
                status: state.contact_status?.value,
                lead_source: state.lead_source?.value,
                // created_by: state.createdby?.value,
                department: state.department,
                designation: state.designation,
                phone_number: state.phoneNumber,
                email_id: state.email,
                is_active: state.is_active,
                name: state.contact_name,
            };
            await Validation.createContact.validate(validateField, { abortEarly: false });

            const res = await Models.contact.update(body, state.contactId);
            Success('Contact updated successfully');
            clearContactData();
            getContactList();
            setState({ createContactLoad: false });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = error.inner.reduce((acc, err) => {
                    acc[err.path] = err.message;
                    return acc;
                }, {});
                setState({ errors: validationErrors, createContactLoad: false });
            } else {
                console.log('Error: ', error?.message);
            }
        }
    };

    const createAndUpdateOpportunity = async () => {
        try {
            setState({ oppLoading: true });

            const validateField = {
                opp_name: state.opp_name,
                owner: state.owner?.value,
                opp_stage: state.opp_stage?.value,
                opportunity_value: state.opportunity_value,
                recurring_value_per_year: state.recurring_value_per_year,
                currency_type: state.currency_type?.value,
                closing_date: state.opp_closing_date ? moment(state.opp_closing_date).format('YYYY-MM-DD') : '',
                probability_in_percentage: state.probability_in_percentage,
            };

            // const body = {
            //     lead: id,
            //     name: state.opp_name,
            //     owner: state.owner?.value,
            //     stage: state.opp_stage?.value,
            //     opportunity_value: state.opportunity_value,
            //     recurring_value_per_year: state.recurring_value_per_year,
            //     currency_type: state.currency_type?.value,
            //     closing_date: state.opp_closing_date ? moment(state.opp_closing_date).format('YYYY-MM-DD') : '',
            //     probability_in_percentage: state.probability_in_percentage,
            //     file: null,
            //     created_by: 1,
            //     is_active: true,
            // };

            const formData = new FormData();

            formData.append('lead', id as string);
            formData.append('name', state.opp_name || '');
            formData.append('owner', state.owner?.value || '');
            formData.append('stage', state.opp_stage?.value || '');
            formData.append('opportunity_value', state.opportunity_value || '');
            formData.append('recurring_value_per_year', state.recurring_value_per_year || '');
            formData.append('currency_type', state.currency_type?.value || '');
            formData.append('closing_date', state.opp_closing_date ? moment(state.opp_closing_date).format('YYYY-MM-DD') : '');
            formData.append('probability_in_percentage', state.probability_in_percentage || '');
            if (state.file && state.file instanceof File) {
                formData.append('file', state.file);
            } else {
                formData.append('file', ''); // Make sure to append the file correctly
            }
            await Validation.createOppsValidation.validate(validateField, { abortEarly: false });
            let res;
            if (state.oppId) {
                res = await Models.opportunity.update(formData, state.oppId);
            } else {
                res = await Models.opportunity.create(formData);
            }
            setState({ oppLoading: false });
            getOpportunityList();
            Success(res?.message);
            clearOppData();
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err?.message; // Set the error message for each field
                });
                setState({ errors: validationErrors });
                setState({ oppLoading: false });
            } else {
                setState({ oppLoading: false });
            }
            setState({ oppLoading: false });
        }
    };

    const onEditCantact = (item) => {
        setState({
            contactId: item.id,
            isOpenCreateContact: true,
            contact_name: item.name,
            designation: item.designation,
            email: item.email_id,
            department: item.department,
            is_active: item.is_active,
            lead_source: { value: item?.lead_source?.id, label: item?.lead_source?.source },
            createdby: { value: item?.created_by?.id, label: item?.created_by?.username },
            contact_status: { value: item?.status?.id, label: item?.status?.status },
            phoneNumber: item.phone_number,
        });
    };

    const clearContactData = () => {
        setState({
            contact_name: '',
            department: '',
            designation: '',
            phoneNumber: '',
            email: '',
            lead_source: '',
            createdby: '',
            contact_status: '',
            is_active: false,
            contactId: '',
            isOpenCreateContact: false,
            errors: '',
            createContactLoad: false,
        });
    };

    const clearOppData = () => {
        setState({
            oppId: '',
            opp_name: '',
            owner: '',
            opportunity_value: '',
            recurring_value_per_year: '',
            currency_type: '',
            probability_in_percentage: '',
            opp_created_by: '',
            opp_closing_date: '',
            opp_stage: '',
            isOpenOpp: false,
            oppLoading: false,
            errors: '',
            file: null,
        });
    };

    const editOppData = async (row) => {
        if (row?.file_url) {
            const fileName = getFileNameFromUrl(row?.file_url);
            const files = await convertUrlToFile(row?.file_url, fileName);
            console.log('files: ', files);
            setState({ file: files });
        }
        setState({
            oppId: row.id,
            isOpenOpp: true,
            opp_name: row.name,
            owner: { value: row.owner.id, label: row.owner.username },
            opportunity_value: row.opportunity_value,
            recurring_value_per_year: row.recurring_value_per_year,
            currency_type: { value: row.currency_type.id, label: row.currency_type.currency_short },
            probability_in_percentage: row.probability_in_percentage,
            opp_created_by: { value: row.created_by.id, label: row.created_by.username },
            opp_closing_date: new Date(row.closing_date),
            opp_stage: { value: row.stage.id, label: row.stage.stage },
            notes: row.note,
        });
    };

    const getProbabilityPercentage = async (e) => {
        try {
            if (e) {
                const res: any = await Models.opportunity.getProbabilityPercentage(e?.value);
                setState({ probability_in_percentage: res.probability });
            } else {
                setState({ probability_in_percentage: '' });
            }
        } catch (error) {}
    };

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Lead', path: '' },
    ];

    return state.loading ? (
        <CommonLoader />
    ) : (
        <div className="relative h-auto  overflow-scroll bg-[#dbe7ff] bg-cover p-2">
            <Breadcrumb items={breadcrumbItems} />

            <div className="panel flex items-center justify-between gap-5 pl-3">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">{`${capitalizeFLetter(state.data?.name)} (Lead)`}</h5>
                </div>
                <div className="flex gap-5">
                    <button
                        type="button"
                        className="btn btn-primary md:mb-0 md:w-auto"
                        onClick={() => {
                            setState({ isOpenOpp: true });
                        }}
                    >
                        Add Opportunity
                    </button>

                    <Tippy content="Add Contact" placement="top" className="rounded-md bg-black p-1 text-sm text-white">
                        <button type="button" className="btn btn-primary md:mb-0 md:w-auto" onClick={() => setState({ isOpenCreateContact: true })}>
                            <IconUserPlus />
                        </button>
                    </Tippy>
                </div>
            </div>

            {state.contactList?.length > 0 ? (
                <div className="mt-2 grid gap-2 md:grid-cols-12">
                    <div className="col-span-12 flex flex-col md:col-span-8">
                        <div className="panel flex min-h-[345px] flex-col gap-2 rounded-2xl p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl bg-[#deffd7]">
                                    <IconUser className="text-[#82de69]" />
                                </div>
                                <div style={{ fontSize: '20px' }}>Lead Information</div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <ViewLabel label="Lead Name" value={state.data?.name} />
                                <ViewLabel label="Lead Owner" value={state.data?.lead_owner?.username} />
                                {state.data?.company_email && <ViewLabel label="Company Email" value={state.data?.company_email} />}
                                {state.data?.company_website && <ViewLabel label="Company Website" value={state.data?.company_website} />}
                                {state.data?.company_number && <ViewLabel label="Company Number" value={state.data?.company_number} />}
                                {state.data?.annual_revenue && <ViewLabel label="Annual Revenue" value={roundOff(state.data?.annual_revenue)} />}
                                {state.data?.focus_segment && <ViewLabel label="Focus Segment" value={state.data?.focus_segment?.focus_segment} />}
                                {state.data?.market_segment && <ViewLabel label="Market Segment" value={state.data?.market_segment?.market_segment} />}
                                {state.data?.tags?.length > 0 && <ViewLabel label="Tags" value={state.data.tags.map((item) => item?.tag).join(', ')} />}
                                {state.data?.fax && <ViewLabel label="Fax" value={Number(state.data?.fax)} />}
                                {state.data?.country && <ViewLabel label="Country" value={state.data?.country?.country_name} />}
                                {state.data?.state && <ViewLabel label="State" value={state.data?.state?.state_name} />}
                            </div>
                        </div>
                    </div>

                    {/* Contacts Section */}
                    <div className="panel col-span-12 flex flex-col gap-1 rounded-2xl p-3 md:col-span-4">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl bg-[#deffd7]">
                                    <IconUser className="text-[#82de69]" />
                                </div>
                                <div style={{ fontSize: '20px' }}>Contacts {`(${state.contactCount})`}</div>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={() => setState({ isOpenCreateContact: true })}>
                                <IconPlus />
                            </button>
                        </div>

                        <div className="max-h-[580px] overflow-y-scroll">
                            {state.contactList?.map((item) => (
                                <div key={item.id} className="mt-3">
                                    <OppCard
                                        data={item}
                                        onPress={() => {
                                            dispatch(leadId(id));
                                            router.push(`/viewContact?id=${item.id}`);
                                        }}
                                        onEdit={() => onEditCantact(item)}
                                        onDelete={() => deleteOpp(item.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-span-12 mb-2 mt-2 flex flex-col md:col-span-12">
                    <div className="panel flex flex-col gap-3 rounded-2xl p-3">
                        {/* Header */}
                        <div className="flex w-full justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl bg-[#deffd7]">
                                    <IconUser className="text-[#82de69]" />
                                </div>
                                <div style={{ fontSize: '20px' }}>Lead Information</div>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={() => router.push(`/updateLead?id=${id}`)}>
                                <IconEdit />
                            </button>
                        </div>

                        {/* Data Rows with Responsive Layout */}
                        <OppLabel
                            label1="Lead Name"
                            value1={state.data?.name}
                            label2="Lead Owner"
                            value2={state.data?.lead_owner?.username}
                            label3="Annual Revenue"
                            value3={roundOff(state.data?.annual_revenue)}
                        />
                        <OppLabel
                            label1="Company Website"
                            value1={state.data?.company_website}
                            label2="Company Number"
                            value2={state.data?.company_number}
                            label3="Company Email"
                            value3={state.data?.company_email}
                        />
                        <OppLabel
                            label1="Vertical"
                            value1={state.data?.focus_segment?.vertical?.vertical}
                            label2="Focus Segment"
                            value2={state.data?.focus_segment?.focus_segment}
                            label3="Market Segment"
                            value3={state.data?.market_segment?.market_segment}
                        />
                        <OppLabel
                            label1="Tags"
                            value1={state.data.tags?.length > 0 ? state.data.tags.map((item) => item?.tag).join(', ') : ''}
                            label2="Fax"
                            value2={Number(state.data?.fax)}
                            label3="Country"
                            value3={state.data?.country?.country_name}
                        />
                        <OppLabel
                            label1="State"
                            value1={state.data?.state?.state_name}
                            label2="Status"
                            value2={state.data?.is_active ? 'Active' : 'Inactive'}
                            label3="Created By"
                            value3={state.data?.created_by?.username}
                        />
                    </div>
                </div>
            )}
            <>
                {state.opportunityList?.length > 0 && (
                    <div className="panel col-span-12 mt-2 flex flex-col gap-5 rounded-2xl p-3 md:col-span-12">
                        <div className="flex justify-between">
                            <div className="flex w-full justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                        <IconUser className="text-[#82de69]" />
                                    </div>
                                    <div className=" " style={{ fontSize: '20px' }}>
                                        Opportunities {`(${state.opportunityList?.length})`}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary "
                                    onClick={() => {
                                        // dispatch(leadId(id));
                                        // router.push('/createOpportunity');
                                        setState({ isOpenOpp: true });
                                    }}
                                >
                                    <IconPlus />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-[600px] overflow-y-scroll">
                            <DataTable
                                className="table-responsive"
                                records={state.opportunityList}
                                columns={[
                                    {
                                        accessor: 'name',
                                        sortable: true,

                                        width: '220px',
                                    },
                                    { accessor: 'opportunity_value', sortable: true, title: 'Opportunity Value', render: (row: any) => <div>{roundOff(row?.opportunity_value)}</div> },
                                    { accessor: 'probability_in_percentage', sortable: true, title: 'Probability (%)' },
                                    { accessor: 'recurring_value_per_year', sortable: true, title: 'Recurring Value ', render: (row: any) => <div>{roundOff(row?.recurring_value_per_year)}</div> },
                                    { accessor: 'stages', sortable: true, title: 'Stage', width: '220px' },
                                    { accessor: 'currency', sortable: true, title: 'Currency Type' },
                                    { accessor: 'closing_date', sortable: true, title: 'Closing Date' },
                                    {
                                        accessor: 'actions',
                                        title: 'Actions',
                                        render: (row: any) => (
                                            <>
                                                <div className="mx-auto flex w-max items-center gap-4">
                                                    <button
                                                        type="button"
                                                        className="flex hover:text-danger"
                                                        onClick={() => {
                                                            dispatch(oppId(row?.id));
                                                            dispatch(leadId(id));

                                                            router.push(`/viewOpportunity?id=${row.id}`);
                                                        }}
                                                    >
                                                        <IconEye />
                                                    </button>
                                                    <button className="flex hover:text-info" onClick={() => editOppData(row)}>
                                                        <IconEdit className="h-4.5 w-4.5" />
                                                    </button>
                                                </div>
                                            </>
                                        ),
                                    },
                                ]}
                                highlightOnHover
                                totalRecords={state.opportunityList?.length}
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
                        </div>
                    </div>
                )}
                {state.logList?.length > 0 && (
                    <div className="panel col-span-12 mt-2 flex flex-col  rounded-2xl p-3 md:col-span-12">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                    <IconUser className="text-[#82de69]" />
                                </div>
                                <div className=" " style={{ fontSize: '20px' }}>
                                    Log History {`(${state.logCount})`}
                                </div>
                            </div>
                        </div>
                        <div className="max-h-[600px] overflow-y-scroll">
                            <LogCard data={state.logList} onPress={(item) => router.push(`/opportunity?id=${item.id}`)} onDelete={(item) => deleteOpp(item.id)} editIcon={false} />
                        </div>
                    </div>
                )}
            </>

            <SideMenu
                title={state.contactId ? 'Update Contact' : 'Add Contact'}
                open={state.isOpenCreateContact}
                close={() => clearContactData()}
                cancelOnClick={() => clearContactData()}
                submitOnClick={() => (state.contactId ? updateContact() : createContact())}
                submitLoading={state.createContactLoad}
                renderComponent={() => (
                    <div className="flex flex-col gap-3 ">
                        <TextInput title="Name" value={state.contact_name} onChange={(e) => setState({ contact_name: e })} placeholder={'Name'} error={state.errors?.contact_name} required />
                        <TextInput
                            title="Designation"
                            value={state.designation}
                            onChange={(e) => setState({ designation: e })}
                            placeholder={'Designation'}
                            error={state.errors?.designation}
                            required
                        />
                        <TextInput title="Department" value={state.department} onChange={(e) => setState({ department: e })} placeholder={'Department'} error={state.errors?.department} required />
                        <NumberInput
                            title="Phone Number"
                            value={state.phoneNumber}
                            onChange={(e) => setState({ phoneNumber: e })}
                            placeholder={'Phone Number'}
                            error={state.errors?.phoneNumber}
                            required
                        />
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
                            title="Contact Status"
                            value={state.contact_status}
                            onChange={(e) => setState({ contact_status: e })}
                            placeholder={'Contact Status'}
                            options={state.statusList}
                            error={state.errors?.contact_status}
                            required
                        />
                    </div>
                )}
            />

            <SideMenu
                title={state.oppId ? 'Update Opportunity' : 'Add Opportunity'}
                open={state.isOpenOpp}
                cancelOnClick={() => clearOppData()}
                submitOnClick={() => createAndUpdateOpportunity()}
                submitLoading={state.oppLoading}
                close={() => clearOppData()}
                renderComponent={() => (
                    <div className="flex flex-col gap-3">
                        <FileUpload
                            onFileSelect={(file) => setState({ file })}
                            buttonText="Upload Document"
                            iconSrc="/assets/images/fileUplaod.jpg"
                            accept=".pdf,.doc,.docx,.txt"
                            isImageAllowed={false} // Only allow non-image files
                            value={state.file}
                        />
                        <TextInput title="Name" value={state.opp_name} onChange={(e) => setState({ opp_name: e })} placeholder={'Name'} error={state.errors?.opp_name} required />
                        <CustomSelect
                            title="Lead Owner"
                            value={state.owner}
                            onChange={(e) => setState({ owner: e })}
                            placeholder={'Lead '}
                            options={state.ownerList}
                            error={state.errors?.owner}
                            required
                        />
                        <NumberInput
                            error={state.errors?.opportunity_value}
                            title="Opportunity Value"
                            value={state.opportunity_value}
                            onChange={(e) => setState({ opportunity_value: e })}
                            placeholder={'Opportunity Value'}
                            required
                        />

                        <NumberInput
                            title="Recurring Value Per Year"
                            value={state.recurring_value_per_year}
                            onChange={(e) => setState({ recurring_value_per_year: e })}
                            placeholder={'Recurring Value Per Year'}
                            error={state.errors?.recurring_value_per_year}
                            required
                        />
                        {/* <YearPicker
                            required
                            error={state.errors?.recurring_value_per_year}
                            title="Recurring Value Per Year"
                            value={state.recurring_value_per_year}
                            onChange={(year) => {
                                setState({ recurring_value_per_year: year });
                            }}
                        /> */}
                        {/* <CustomSelect
                            title="Stage"
                            value={state.opp_stage}
                            onChange={(e) => setState({ opp_stage: e })}
                            placeholder={'Stage'}
                            options={state.stageList}
                            required
                            error={state.errors?.opp_stage}
                        /> */}
                        <CustomSelect
                            title="Stage"
                            value={state.opp_stage}
                            onChange={(e) => {
                                setState({ opp_stage: e });
                                getProbabilityPercentage(e);
                            }}
                            placeholder={'Stage'}
                            options={state.stageList}
                            required
                            error={state.errors?.opp_stage}
                        />
                        <NumberInput
                            title="Probability In Percentage"
                            value={state.probability_in_percentage}
                            onChange={(e) => setState({ probability_in_percentage: e })}
                            placeholder={'Probability In Percentage'}
                            error={state.errors?.probability_in_percentage}
                            max={100}
                            required
                        />
                        {/* <CustomSelect
                            title="Created By"
                            value={state.opp_created_by}
                            onChange={(e) => setState({ opp_created_by: e })}
                            placeholder={'Created By'}
                            options={state.createdByList}
                            required
                            error={state.errors?.created_by}
                        /> */}
                        <CustomeDatePicker
                            error={state.errors?.closing_date}
                            value={state.opp_closing_date}
                            placeholder="Closing Date"
                            title="Closing Date"
                            onChange={(e) => setState({ opp_closing_date: e })}
                            required
                        />
                        <CustomSelect
                            title="Currency Type"
                            value={state.currency_type}
                            onChange={(e) => setState({ currency_type: e })}
                            placeholder={'Currency Type'}
                            options={state.currencyList}
                            required
                            error={state.errors?.currency_type}
                        />

                        {/* <div className="mt-3 flex items-center justify-end gap-3">
                            <button type="button" className="btn btn-outline-danger border " onClick={() => clearOppData()}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => createAndUpdateOpportunity()}>
                                {state.oppLoading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div> */}
                    </div>
                )}
            />
        </div>
    );
}
