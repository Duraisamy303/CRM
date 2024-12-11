import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { useRouter } from 'next/router';
import IconUser from '@/components/Icon/IconUser';
import IconMail from '@/components/Icon/IconMail';
import IconPhoneCall from '@/components/Icon/IconPhoneCall';
import Image from 'next/image';
import { Dropdown, Failure, Success, useSetState } from '@/utils/functions.utils';
import TextInput from '@/components/TextInput';
import NumberInput from '@/components/NumberInput';
import CustomSelect from '@/components/Select';
import CheckboxInput from '@/components/Checkbox';
import Models from '@/imports/models.import';
import CommonLoader from './elements/commonLoader';
import IconLoader from '@/components/Icon/IconLoader';
import * as Yup from 'yup';
import { PrivateRouter, Validation } from '@/utils/imports.utils';
import Breadcrumb from '@/common_component/breadcrumb';
import { LEADTYPE } from '@/utils/constant.utils';

const UpdateLead = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Update Lead'));
    });

    const router = useRouter();
    const id = router?.query?.id;

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
        stateLoading: false,
        submitLoad: false,
        createdByList: [],
        created_by: null,
        verticalList: [],
        vertical: '',
    });

    useEffect(() => {
        getDate();
        verticalList();
        getMarketSegmentList();
        countryList();
        tagList();
        sourceList();
        assignList();
        leadManagerList();
        departmentList();
        statusList()
    }, [id]);

    const getDate = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.lead.details(id);
            console.log('res: ', res);
            setState({
                loading: false,
                ...res,
                focus_segment: { value: res.focus_segment?.id, label: res.focus_segment?.focus_segment } || null,
                market_segment: { value: res.market_segment?.id, label: res.market_segment?.market_segment } || null,
                lead_owner: { value: res.lead_owner?.id, label: res.lead_owner?.username } || null || '',
                country: { value: res.country?.id, label: res.country?.country_name } || null,
                state: { value: res.state?.id, label: res.state?.state_name } || null,
                tags: res.tags?.map((item) => ({ value: item.id, label: item?.tag })) || [],
                is_active: res.is_active ?? false,
                created_by: { value: res.created_by?.id, label: res.created_by?.username } || null,
                vertical: { value: res.focus_segment?.vertical?.id, label: res.focus_segment?.vertical?.vertical },
                lead_type: { value: res.lead_type, label: res.lead_type },
                lead_source: { value: res.lead_source?.id, label: res.lead_source?.source },
                lead_source_from: { value: res.lead_source_from?.id, label: res.lead_source_from?.source_from },
                assigned_to: { value: res.assigned_to?.id, label: res.assigned_to?.username },
                department: { value: res.department?.id, label: res.department?.department },
                status: { value: res.lead_status?.id, label: res.lead_status?.name },
            });
            getFocusSegmentList({ value: res.focus_segment?.vertical?.id });
            stateList({ value: res.country?.id });
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

    const assignList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.bdmAndBDE();
            const dropdownList = Dropdown(res, 'full_name');
            setState({ assignList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const departmentList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.departmentList();
            console.log('res: ', res);
            const dropdownList = Dropdown(res, 'department');
            setState({ departmentList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };


    const statusList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.statusList();
            const dropdownList = Dropdown(res, 'name');
            setState({ statusList: dropdownList, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
        }
    };

    const leadManagerList = async () => {
        try {
            setState({ loading: true });
            const res = await Models.lead.leadManager();
            const dropdownList = Dropdown(res, 'full_name');
            setState({ leadManagerList: dropdownList, loading: false });
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
                created_by: state.created_by?.value,
                country: state.country?.value,
                state: state.state?.value,
                company_number: state.company_number,
                company_email: state.company_email,
                company_website: state.company_website,
                fax: state.fax,
                annual_revenue: state.annual_revenue,
                tags: tags,
                market_segment: state.market_segment?.value,
                is_active: true,
                vertical: state.vertical?.value,
                assignTo: state.assignTo?.value,
                lead_type: state.lead_type?.value,
                assigned_to: state.assigned_to?.value,
                lead_source: state.lead_source?.value,
                lead_source_from: state.lead_source_from?.value,
                department: state.department?.value,
                status: state.status?.value,
            };

            await Validation.createLeadValidation.validate(body, { abortEarly: false });

            const res: any = await Models.lead.update(body, id);
            console.log("res: ", res);
            setState({ submitLoad: false });
            Success(res?.message);
            if (typeof window !== 'undefined') {
                window.history.back();
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err?.message; // Set the error message for each field
                });
                setState({ errors: validationErrors });
                setState({ submitLoad: false });
            } else {
                console.log('Error: ', error?.message);
                setState({ submitLoad: false });
            }
            setState({ submitLoad: false });
        }
    };

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

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Update Lead', path: '' },
    ];

    const remainder = [
        { label: 'Next Week', value: " 'Next Week" },
        { label: 'Next Month', value: " 'Next Month" },
        { label: 'After One Month', value: " 'After One Month" },
        { label: 'After Two Month', value: " 'After Two Month" },
        { label: 'After six Month', value: " 'After six Month" },
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
        <div className="relative h-auto overflow-scroll bg-[#dbe7ff] bg-cover p-2">
            <Breadcrumb items={breadcrumbItems} />

            <div className="panel  flex  gap-5 ">
                <div className="flex items-center gap-2">
                    <div className="flex h-[50px] w-[50px] overflow-hidden bg-white" style={{ borderRadius: 50 }}>
                        <img src="/assets/images/profile-1.jpeg" height={'100%'} width={'100%'} />
                    </div>
                    <div>
                        <h5 className="font-semibold " style={{ fontSize: '18px' }}>
                            Update Lead
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
                            options={state.leadManagerList}
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

                    <div className=" flex w-full items-center  gap-3 ">
                        <div className="flex w-[50%] ">
                            <CustomSelect
                                title="Department"
                                value={state.department}
                                onChange={(e) => setState({ department: e })}
                                placeholder={'Department'}
                                options={state.departmentList}
                                error={state.errors?.department}
                                required
                            />
                        </div>
                        <div className="flex w-[50%] ">
                            <CustomSelect
                                title="Status"
                                value={state.status}
                                onChange={(e) => setState({ status: e })}
                                placeholder={'Status'}
                                options={state.statusList}
                                error={state.errors?.status}
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
        </div>
    );
};

export default PrivateRouter(UpdateLead);
