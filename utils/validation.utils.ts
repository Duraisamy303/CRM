import * as Yup from 'yup';

export const createLeadValidation = Yup.object().shape({
    name: Yup.string().required('Lead Name is required'),
    lead_owner: Yup.string().required('Lead Owner is required'),
    // company_email: Yup.string().email('Invalid email').required('Company Email is required'),
    // company_website: Yup.string().url('Invalid URL'),
    created_by: Yup.string().required('Created By is required'),
    annual_revenue: Yup.number().nullable().required('Annual Revenue is required').typeError('Annual Revenue must be a number'),
    tags: Yup.array().min(1, 'At least one tag is required'),
    focus_segment: Yup.string().required('Focus Segment is required'),
    market_segment: Yup.string().required('Market Segment is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    vertical: Yup.string().required('Vertical is required'),

    
});

export const createOppValidation = Yup.object().shape({
    lead: Yup.string().required('Lead is required'),
    opp_name: Yup.string().required('Name is required'),
    owner: Yup.string().required('Owner is required'),
    opp_stage: Yup.string().required('Stage is required'),
    opportunity_value: Yup.string().required('Opportunity Value is required'),
    recurring_value_per_year: Yup.string().required('Recurring Value Per Year is required'),
    currency_type: Yup.string().required('Currency Type is required'),
    closing_date: Yup.string().required('Closing Date is required'),
    probability_in_percentage: Yup.string().required('Probability In Percentage is required'),
});

export const createOppsValidation = Yup.object().shape({
    opp_name: Yup.string().required('Name is required'),
    owner: Yup.string().required('Owner is required'),
    opp_stage: Yup.string().required('Stage is required'),
    opportunity_value: Yup.string().required('Opportunity Value is required'),
    recurring_value_per_year: Yup.string().required('Recurring Value Per Year is required'),
    currency_type: Yup.string().required('Currency Type is required'),
    closing_date: Yup.string().required('Closing Date is required'),
    probability_in_percentage: Yup.string().required('Probability In Percentage is required'),
});

export const createNote = Yup.object().shape({
    note: Yup.string().required('Notes is required'),
});

export const updateLog = Yup.object().shape({
    logStage: Yup.string().required('Log Stage is required'),
});

export const createLog = Yup.object().shape({
    logStage: Yup.string().required('Log Stage is required'),
    focus_segment: Yup.string().required('Focus Segment is required'),
});

export const createContact = Yup.object().shape({
    contact_status: Yup.string().required('Contact status is required'),
    lead_source: Yup.string().required('Lead source is required'),
    department: Yup.string().required('Department is required'),
    designation: Yup.string().required('Designation is required'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    email: Yup.string().required('Email is required').email('Must be a valid email'),
    contact_name: Yup.string().required('Contact name is required'),
});

export const createTask = Yup.object().shape({
    lead: Yup.string().required('Lead is required'),
    contact: Yup.string().required('Contact is required'),
    task_date_time:Yup.string().required('Task date is required')
});

export const assignTask = Yup.object().shape({
    assigned_to: Yup.string().required('Select assigned user'),
});
