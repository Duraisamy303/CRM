import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { useRouter } from 'next/router';
import IconUser from '@/components/Icon/IconUser';
import { Dropdown, Failure, Success, useSetState } from '@/utils/functions.utils';
import TextInput from '@/components/TextInput';
import NumberInput from '@/components/NumberInput';
import CustomSelect from '@/components/Select';
import CheckboxInput from '@/components/Checkbox';
import Models from '@/imports/models.import';
import CommonLoader from './elements/commonLoader';
import IconLoader from '@/components/Icon/IconLoader';
import { createLeadValidation } from '@/utils/validation.utils';
import { PrivateRouter, Validation } from '@/utils/imports.utils';
import * as Yup from 'yup';
import Breadcrumb from '@/common_component/breadcrumb';
import Modal from '@/common_component/modal';
import CustomeDatePicker from '@/common_component/datePicker';
import TextArea from '@/components/TextArea';
import SideMenu from '@/common_component/sideMenu';
import FileUpload from '@/common_component/fileUpload';
import { LEADTYPE } from '@/utils/constant.utils';

const CreateLead = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Create Lead'));
    });

    const router = useRouter();

    const [state, setState] = useSetState({
        loading: false,
        name: '',
        focus_segment: null,
        lead_owner: '',
        country: null,
        state: null,
        company_number: '',
        company_email: '',
        company_website: '',
        fax: '',
        annual_revenue: '',
        tags: [],
        market_segment: '',
        is_active: false,
        focusSegmentList: [],
        marketSegmentList: [],
        countryList: [],
        tagList: [],
        ownerList: [],
        stateList: [],
        createdByList: [],
        stateLoading: false,
        submitLoad: false,
        errors: null,
        created_by: null,
        verticalList: [],
        vertical: '',
        isOpenTask: false,
        isOpen: false,
        source_from: null,
        assignList: [],
        sourceList: [],
        sourceFromList: [],
        leadTypeList:[]
    });

    useEffect(() => {
        verticalList();
        getMarketSegmentList();
        countryList();
        tagList();
        ownerList();
        createdByList();
        userList();
        sourceList();
    }, []);

    const getFocusSegmentList = async (verticalData: any) => {
        try {
            const res: any = await Models.lead.focusIdBasedVericalList(verticalData?.value);
            let focusList: [];
            if (res?.length > 0) {
                focusList = res?.map((item) => ({ value: item?.id, label: item?.focus_segment }));
            }

            setState({ focusSegmentList: focusList });
        } catch (error) {
            setState({ loading: false });
        }
    };
    
    const  userList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.dropdowns('assigned_to');
            const dropdownList = Dropdown(res, 'username');
            setState({ assignList: dropdownList, loading: false });
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
            setState({ marketSegmentList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const sourceList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.sourceList();
            const dropdownList = Dropdown(res, 'source');
            setState({ sourceList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
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

    const sourceFromList = async (source) => {
        try {
            const res = await Models.lead.sourceFromList(source?.value);
            const dropdownList = Dropdown(res, 'source_from');
            setState({ sourceFromList: dropdownList });
        } catch (error) {
            // setState({ stateLoading: false });

            console.log('error: ', error);
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

    const handleSubmit = async () => {
        try {
            setState({ submitLoad: true });
            let tags = [];
            if (state.tags?.length > 0) {
                tags = state.tags?.map((item) => item.value);
            }

            const body = {
                name: state.name,
                focus_segment: state.focus_segment?.value,
                lead_owner: state.lead_owner?.value,
                country: state.country?.value,
                state: state.state?.value,
                company_number: state.company_number,
                company_email: state.company_email,
                company_website: state.company_website,
                fax: state.fax,
                annual_revenue: state.annual_revenue ? Number(state.annual_revenue) : null,
                tags: tags,
                market_segment: state.market_segment?.value,
                is_active: true,
                vertical: state.vertical?.value,
                assignTo: state.assignTo?.value,
                source: state.source?.value,
                source_from: state.source_from?.value,
                lead_type: state.lead_type?.value,
                assigned_to: state.assigned_to?.value,
                lead_source: state.lead_source?.value,
                lead_source_from: state.lead_source_from?.value,
            };

            await Validation.createLeadValidation.validate(body, { abortEarly: false });
            const res: any = await Models.lead.create(body);
            console.log('res: ', res);
            setState({ submitLoad: false });
            Success(res?.message);
            router.replace(`/viewLead?id=${res?.data?.id}`);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err?.message; // Set the error message for each field
                });
                console.log('validationErrors: ', validationErrors);

                setState({ errors: validationErrors });
                setState({ submitLoad: false });
            } else {
                console.log('Error: ', error?.message);
                setState({ submitLoad: false });
            }
            setState({ submitLoad: false });
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
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Create Lead', path: '' },
    ];

    const source = [
        { label: 'Online(Web)', value: " 'Online(Web)" },
        { label: 'Social Handles', value: " 'Social Handles" },
        { label: 'References', value: " 'References" },
        { label: 'Fair Directory', value: " 'Fair Directory" },
    ];

    return state.loading ? (
        <CommonLoader />
    ) : (
        <div className="relative h-auto  overflow-scroll bg-[#dbe7ff] bg-cover p-2">
            <Breadcrumb items={breadcrumbItems} />

            <div className="panel  flex  gap-5 ">
                <div className="flex items-center gap-2">
                    <div className="flex h-[50px] w-[50px] overflow-hidden bg-white" style={{ borderRadius: 50 }}>
                        <img src="/assets/images/profile-1.jpeg" height={'100%'} width={'100%'} />
                    </div>
                    <div>
                        <h5 className="font-semibold " style={{ fontSize: '18px' }}>
                            Create Lead
                        </h5>
                        <div className="  " style={{ fontSize: '14px', color: 'grey' }}>
                            Your data journey starts here...
                        </div>
                    </div>
                </div>
            </div>
            <div className=" mt-2 grid grid-cols-12  gap-2">
                <div className=" col-span-12 flex flex-col   md:col-span-5">
                    <div className="panel flex flex-col gap-5 rounded-2xl p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                <IconUser className="text-[#82de69]" />
                            </div>
                            <div className=" " style={{ fontSize: '20px' }}>
                                Basic Information
                            </div>
                        </div>
                        <TextInput title="Lead Name" value={state.name} onChange={(e) => setState({ name: e })} placeholder={'Lead Name'} error={state.errors?.name} required />
                        <CustomSelect
                            title="Lead Manager"
                            value={state.lead_owner}
                            onChange={(e) => setState({ lead_owner: e })}
                            placeholder={'Lead Manager'}
                            options={state.ownerList}
                            error={state.errors?.lead_owner}
                            required
                        />
                    </div>
                    <div className="panel mt-2 flex flex-col gap-5 rounded-2xl p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#ffeeee]">
                                <IconUser className="text-[#fe70f2]" />
                            </div>
                            <div className=" " style={{ fontSize: '20px' }}>
                                Contact Information
                            </div>
                        </div>

                        <TextInput title="Email" value={state.company_email} onChange={(e) => setState({ company_email: e })} placeholder={'Email'} required error={state.errors?.company_email} />
                        <TextInput title="Number" value={state.company_number} onChange={(e) => setState({ company_number: e })} placeholder={'Number'} required error={state.errors?.company_number} />
                        <TextInput
                            title="Website"
                            value={state.company_website}
                            onChange={(e) => setState({ company_website: e })}
                            placeholder={'Website'}
                            required
                            error={state.errors?.company_website}
                        />
                    </div>
                </div>

                <div className="panel col-span-12 flex flex-col gap-5 rounded-2xl p-3 md:col-span-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#ffefe4]">
                            <IconUser className="text-[#ffbb55]" />
                        </div>
                        <div className=" " style={{ fontSize: '20px' }}>
                            More Information
                        </div>
                    </div>
                    <div className=" flex w-full gap-3">
                        <div className="flex w-[50%]">
                            <NumberInput title="Fax" value={state.fax} onChange={(e) => setState({ fax: e })} placeholder={'Fax'} />
                        </div>
                        <div className=" flex  w-[50%]">
                            <NumberInput
                                title="Annual Revenue"
                                value={state.annual_revenue}
                                onChange={(e) => setState({ annual_revenue: e })}
                                placeholder={'Annual Revenue'}
                                error={state.errors?.annual_revenue}
                            />
                        </div>
                    </div>

                    <div className=" flex w-full gap-3">
                        <div className="flex w-[50%]">
                            <CustomSelect
                                title="Vertical"
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
                        </div>

                        <div className="flex w-[50%]">
                            <CustomSelect
                                title="Focus Segment"
                                value={state.focus_segment}
                                onChange={(e) => {
                                    setState({ focus_segment: e });
                                }}
                                placeholder={'Focus Segment'}
                                options={state.focusSegmentList}
                                required
                                error={state.errors?.focus_segment}
                            />
                        </div>
                    </div>

                    <div className=" flex w-full gap-3">
                        <div className="flex w-[50%]">
                            <CustomSelect
                                title="Market Segment"
                                value={state.market_segment}
                                onChange={(e) => setState({ market_segment: e })}
                                placeholder={'Market Segment'}
                                options={state.marketSegmentList}
                                required
                                error={state.errors?.market_segment}
                            />
                        </div>

                        <div className="flex w-[50%]">
                            <CustomSelect
                                title="Tags"
                                value={state.tags}
                                isMulti={true}
                                onChange={(e) => setState({ tags: e })}
                                placeholder={'Tags'}
                                options={state.tagList}
                                error={state.errors?.tags}
                            />
                        </div>
                    </div>
                    <div className=" flex w-full gap-3">
                        <div className=" flex  w-[50%]">
                            <CustomSelect
                                title="Assign To"
                                value={state.assigned_to}
                                onChange={(e) => setState({ assigned_to: e })}
                                placeholder={'Assign To'}
                                options={state.assignList}
                                error={state.errors?.assigned_to}
                                required
                            />
                        </div>

                        <div className="flex w-[50%]">
                            <CustomSelect
                                title="Lead Type"
                                value={state.lead_type}
                                onChange={(e) => setState({ lead_type: e })}
                                placeholder={'Lead Type'}
                                options={LEADTYPE}
                                error={state.errors?.lead_type}
                                required
                            />
                        </div>
                    </div>

                    <div className=" flex w-full gap-3">
                        <div className=" flex  w-[50%]">
                            <CustomSelect
                                title="Country"
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
                        </div>
                        <div className="flex w-[50%]">
                            <CustomSelect
                                title="State"
                                value={state.state}
                                onChange={(e) => setState({ state: e })}
                                placeholder={'State'}
                                options={state.stateList}
                                error={state.errors?.state}
                                required
                            />
                        </div>
                    </div>

                    <div className=" flex w-full items-center  gap-3 ">
                        <div className="flex w-[50%] ">
                            <CustomSelect
                                title="Source"
                                value={state.lead_source}
                                onChange={(e) => {
                                    if (e) {
                                        sourceFromList(e);
                                    }
                                    setState({ lead_source: e, lead_source_from: '' });
                                }}
                                placeholder={'Source'}
                                options={state.sourceList}
                                error={state.errors?.lead_source}
                                required
                            />
                        </div>
                        {state.lead_source && (
                            <div className=" flex w-[50%]">
                                <CustomSelect
                                    title="Source From"
                                    value={state.lead_source_from}
                                    onChange={(e) => setState({ lead_source_from: e })}
                                    placeholder={'Source From'}
                                    error={state.errors?.lead_source_from}
                                    options={state.sourceFromList}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className=" flex items-center justify-end gap-3">
                        {/* <CheckboxInput checked={state.remainder} onChange={() => setState({ isOpenTask: !state.isOpenTask, remainder: !state.remainder })} label="Remainder" /> */}

                        <button type="button" className="btn btn-outline-danger border " onClick={() => router.replace('/')}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => handleSubmit()}>
                            {state.submitLoad ? <IconLoader className=" h-4  w-4 animate-spin" /> : 'Submit'}
                        </button>
                        {/* <button type="button" className="btn btn-primary" onClick={() => setState({ isOpen: true })}>
                            {state.submitLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit and Add Opportunity'}
                        </button> */}
                    </div>
                </div>
            </div>

            <SideMenu
                title={'Add Opportunity'}
                open={state.isOpen}
                width={450}
                close={() => setState({ isOpen: false })}
                cancelOnClick={() => setState({ isOpen: false })}
                submitOnClick={() => setState({ isOpen: false })}
                submitLoading={state.oppLoading}
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
                        <CustomSelect
                            title="Lead "
                            value={state.createlead}
                            onChange={(e) => {
                                // getLeadOwnerByLeadId(e);
                                // setState({ createlead: e });
                            }}
                            placeholder={'Lead '}
                            options={state.leadList}
                            // loadMore={() => leadListLoadMore()}
                        />
                        <TextInput title="Name" value={state.opp_name} onChange={(e) => setState({ opp_name: e })} placeholder={'Name'} error={state.errors?.opp_name} required />
                        <CustomSelect
                            title="Opportunity Owner"
                            value={state.owner}
                            onChange={(e) => setState({ owner: e })}
                            placeholder={'Opportunity Owner'}
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
                        {/* <YearPicker
                            required
                            error={state.errors?.recurring_value_per_year}
                            title="Recurring Value Per Year"
                            value={state.recurring_value_per_year}
                            onChange={(year) => {
                                setState({ recurring_value_per_year: year });
                            }}
                        /> */}
                        {/* <CustomYearSelect
                            title="Recurring Value Per Year"
                            value={state.recurring_value_per_year}
                            onChange={(e) => setState({ recurring_value_per_year: e })}
                            placeholder={'Recurring Value Per Year'}
                            error={state.errors?.recurring_value_per_year}
                            required
                        />  */}

                        <NumberInput
                            title="Recurring Value Per Year"
                            value={state.recurring_value_per_year}
                            onChange={(e) => setState({ recurring_value_per_year: e })}
                            placeholder={'Recurring Value Per Year'}
                            error={state.errors?.recurring_value_per_year}
                            required
                        />
                        <CustomSelect
                            title="Stage"
                            value={state.opp_stage}
                            onChange={(e) => {
                                // setState({ opp_stage: e });
                                // getProbabilityPercentage(e);
                            }}
                            placeholder={'Stage'}
                            options={state.stageList}
                            required
                            error={state.errors?.opp_stage}
                        />
                        <NumberInput
                            title="Probability In Percentage"
                            value={state.probability_in_percentage}
                            onChange={(e) => {
                                setState({ probability_in_percentage: e });
                            }}
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

                        {/* <CustomSelect
                            title="Primary Contact"
                            value={state.createlead}
                            onChange={(e) => {
                                // getLeadOwnerByLeadId(e);
                                // setState({ createlead: e });
                            }}
                            placeholder={'Primary Contact'}
                            options={state.leadList}
                            // loadMore={() => leadListLoadMore()}
                        /> */}

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

            <Modal
                open={state.isOpenTask}
                addHeader={'Create Task'}
                close={() => setState({ isOpenTask: false })}
                renderComponent={() => (
                    <div className="flex flex-col gap-5 p-5">
                        {/* <div className="flex flex-col gap-5 ">
                            <CustomSelect
                                title="Lead "
                                value={state.lead}
                                onChange={(e) => {
                                    if (e) {
                                    }
                                    setState({ lead: e, contact: '' });
                                }}
                                placeholder={'Lead '}
                                options={state.leadList}
                                error={state.errors?.lead}
                                required
                                // loadMore={() => leadListLoadMore()}
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
                        </div> */}

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
                            <button type="button" className="btn btn-outline-danger border " onClick={() => setState({ isOpenTask: false })}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => setState({ isOpenTask: false })}>
                                {state.taskLoading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default PrivateRouter(CreateLead);
