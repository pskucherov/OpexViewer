import { createSlice } from '@reduxjs/toolkit';
const defaultServerUri = 'http://localhost:8000/';
const defaultToken = 't.SDIFGUIUbidsGIDBSG-BKMXCJKjgdfgKDSRHGd-HDFHnbdddfg';
const initialState = { token: defaultToken, serverUri: defaultServerUri, tokenInvalid: false, serverInvalid: false };
const settingSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setToken(state, actions) {state.token = actions.payload},
        setServerUri(state, actions) {state.serverUri = actions.payload},
        setTokenInvalid(state, actions) {state.tokenInvalid = actions.payload},
        setServerInvalid(state, actions) {state.serverInvalid = actions.payload},

    },
});

export default settingSlice.reducer;
export const settingActions = settingSlice.actions;
