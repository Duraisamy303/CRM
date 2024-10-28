import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Validation } from '@/utils/imports.utils';
import * as Yup from 'yup';
import TextArea from '@/components/TextArea';
import IconEdit from '@/components/Icon/IconEdit';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { IRootState } from '@/store';
import CustomeDatePicker from '@/common_component/datePicker';
import moment from 'moment';

const UpdateLead = () => {
    const dispatch = useDispatch();

    const router = useRouter();

    const id = router?.query?.id;

    useEffect(() => {
        dispatch(setPageTitle('Update Opportunity'));
    });

    const [state, setState] = useSetState({
        loading: false,
        name: '',
        owner: '',
        ownerList: [],
        createdByList: [],
        stateLoading: false,
        submitLoad: false,
        errors: null,
        created_by: null,
        currencyList: [],
        stageList: [],
        notes: '',
        opportunity_value: '',
        probability_in_percentage: '',
        closing_date: null,
    });

    useEffect(() => {
        ownerList();
        createdByList();
        currencyList();
        stageList();
        getDate();
    }, []);

    const getDate = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.opportunity.details(id);
            setState({ data: res, name: res.name, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('error: ', error);
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
                // lead: crmConfig.leadId,
                name: state.name,
                owner: state.owner?.value,
                stage: state.stage?.value,
                note: state.notes,
                opportunity_value: state.opportunity_value,
                recurring_value_per_year: state.recurring_value_per_year,
                currency_type: state.currency_type?.value,
                closing_date: state.closing_date ? moment(state.closing_date).format('YYYY-MM-DD') : '',
                probability_in_percentage: state.probability_in_percentage,
                file: null,
                created_by: state.created_by?.value,
                is_active: true,
            };

            await Validation.createOppValidation.validate(body, { abortEarly: false });
            const res: any = await Models.opportunity.create(body);
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

    return state.loading ? (
        <CommonLoader />
    ) : (
        <div className="relative h-[100vh]  overflow-scroll bg-[#dbe7ff] bg-cover p-2">
            <div className="panel relative flex gap-5 rounded-2xl pl-[30px]">
                <div className="flex h-[100px] w-[100px] overflow-hidden bg-white" style={{ borderRadius: '50%', position: 'relative' }}>
                    <img src="/assets/images/profile-1.jpeg" alt="Profile" style={{ height: '100%', width: '100%' }} />
                    {/* <button className="absolute bottom-0 right-0 m-1 rounded-full bg-blue-500 p-1 text-white z-10">
                        <IconEdit />
                    </button> */}
                </div>
                <div>
                    <div className="mt-5" style={{ fontSize: '30px', fontWeight: 'bold' }}>
                        Update Opportunity
                    </div>
                    <div className="mt-3" style={{ fontSize: '18px', color: 'grey' }}>
                        Your data journey starts here...
                    </div>
                </div>
            </div>

            <div className=" mt-4 grid grid-cols-12  gap-4">
                <div className=" col-span-12 flex flex-col   md:col-span-5">
                    <div className="panel flex flex-col gap-5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#deffd7]">
                                <IconUser className="text-[#82de69]" />
                            </div>
                            <div className=" " style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                Basic Information
                            </div>
                        </div>
                        <TextInput title=" Name" value={state.name} onChange={(e) => setState({ name: e })} placeholder={'Name'} error={state.errors?.name} required />
                        <CustomSelect title="Owner" value={state.owner} onChange={(e) => setState({ owner: e })} placeholder={'Owner'} options={state.ownerList} error={state.errors?.owner} required />
                    <CustomeDatePicker error={state.errors?.closing_date} value={state.closing_date} placeholder="Closing Date" title="Closing Date" onChange={(e) => setState({ closing_date: e })} />

                    </div>
                    {/* <div className="panel mt-4 flex flex-col gap-5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#ffeeee]">
                                <IconUser className="text-[#fe70f2]" />
                            </div>
                            <div className=" " style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                Notes
                            </div>
                        </div>

                        <TextArea height="150px" value={state.notes} onChange={(e) => setState({ notes: e })} placeholder={'Notes'} />
                    </div> */}
                </div>

                <div className="panel col-span-12 flex flex-col gap-5 rounded-2xl md:col-span-7 ">
                    <div className="flex items-center gap-3">
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-3xl  bg-[#ffefe4]">
                            <IconUser className="text-[#ffbb55]" />
                        </div>
                        <div className=" " style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            More Information
                        </div>
                    </div>
                    <div className=" flex w-full gap-3">
                        <div className="flex w-[50%]">
                            <NumberInput
                                error={state.errors?.opportunity_value}
                                title="Opportunity Value"
                                value={state.opportunity_value}
                                onChange={(e) => setState({ opportunity_value: e })}
                                placeholder={'Opportunity Value'}
                            />
                        </div>
                        <div className=" flex  w-[50%]">
                            <CustomSelect
                                title="Stage"
                                value={state.stage}
                                onChange={(e) => setState({ stage: e })}
                                placeholder={'Stage'}
                                options={state.stageList}
                                required
                                error={state.errors?.stage}
                            />
                        </div>
                    </div>

                    <div className=" flex w-full gap-3">
                        <div className="flex w-[50%]">
                            <NumberInput
                                title="Recurring Value Per Year"
                                value={state.recurring_value_per_year}
                                onChange={(e) => setState({ recurring_value_per_year: e })}
                                placeholder={'Recurring Value Per Year'}
                                error={state.errors?.recurring_value_per_year}
                            />
                        </div>
                        <div className=" flex  w-[50%]">
                            <CustomSelect
                                title="Currency Type"
                                value={state.currency_type}
                                onChange={(e) => setState({ currency_type: e })}
                                placeholder={'Currency Type'}
                                options={state.currencyList}
                                required
                                error={state.errors?.currency_type}
                            />
                        </div>
                    </div>

                    <div className=" flex w-full gap-3">
                        <div className="flex w-[50%]">
                            <NumberInput
                                title="Probability In Percentage"
                                value={state.probability_in_percentage}
                                onChange={(e) => setState({ probability_in_percentage: e })}
                                placeholder={'Probability In Percentage'}
                                error={state.errors?.probability_in_percentage}
                                max={100}
                            />
                        </div>
                        <div className=" flex  w-[50%]">

                            {/* <CustomSelect
                                title="Created By"
                                value={state.created_by}
                                onChange={(e) => setState({ created_by: e })}
                                placeholder={'Created By'}
                                options={state.createdByList}
                                required
                                error={state.errors?.created_by}
                            /> */}
                        </div>
                    </div>

                    {/* <div className="mb-5">
                        <div className="label-container">
                            <label>Upload </label>

                            <input type="file" className="" accept="*" value={state.file} onChange={(e) => setState({ file: e })} />
                        </div>
                    </div> */}

                    {/* <div className="  w-full">
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <CheckboxInput checked={state.is_active} label={'Active'} onChange={(e) => setState({ is_active: e })} />
                        </div>
                    </div> */}
                    <div className="mt-3 flex items-center justify-end gap-3">
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

export default UpdateLead;
