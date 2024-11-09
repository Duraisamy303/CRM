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
    });

    useEffect(() => {
        verticalList();
        getMarketSegmentList();
        countryList();
        tagList();
        ownerList();
        createdByList();
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
                is_active: state.is_active,
                vertical: state.vertical?.value,
            };

            await Validation.createLeadValidation.validate(body, { abortEarly: false });
            const res: any = await Models.lead.create(body);
            setState({ submitLoad: false });
            Success(res?.message);
            router.replace('/');
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
                            title="Lead Owner"
                            value={state.lead_owner}
                            onChange={(e) => setState({ lead_owner: e })}
                            placeholder={'Lead Owner'}
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
                                Company Information
                            </div>
                        </div>

                        <TextInput title="Company Email" value={state.company_email} onChange={(e) => setState({ company_email: e })} placeholder={'Company Email'} />
                        <TextInput title="Company Website" value={state.company_website} onChange={(e) => setState({ company_website: e })} placeholder={'Company Website'} />
                        <TextInput title="Company Number" value={state.company_number} onChange={(e) => setState({ company_number: e })} placeholder={'Company Number'} />
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

                  
                    <div className="mt-20 flex items-center justify-end gap-3">
                        <button type="button" className="btn btn-outline-danger border " onClick={() => router.replace('/')}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => handleSubmit()}>
                            {state.submitLoad ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateRouter(CreateLead);
