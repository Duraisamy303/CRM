import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    leadId: '',
    oppId: '',
};

const crmConfigSlice = createSlice({
    name: 'crm',
    initialState: initialState,
    reducers: {
        leadId(state, { payload }) {
            state.leadId = payload;
        },
        oppId(state, { payload }) {
            state.oppId = payload;
        },
    },
});

export const { leadId, oppId } = crmConfigSlice.actions;

export default crmConfigSlice.reducer;
