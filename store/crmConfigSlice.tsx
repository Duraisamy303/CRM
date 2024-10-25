import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    leadId: '',
};

const crmConfigSlice = createSlice({
    name: 'crm',
    initialState: initialState,
    reducers: {
        leadId(state, { payload }) {
            state.leadId = payload;
        },
    },
});

export const { leadId } = crmConfigSlice.actions;

export default crmConfigSlice.reducer;
