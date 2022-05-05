import { configureStore } from '@reduxjs/toolkit';
import settingReducer from './setting-slice';

const store = configureStore({
    reducer: { setting: settingReducer }, //for multiple slice with any key name
});

export default store;
