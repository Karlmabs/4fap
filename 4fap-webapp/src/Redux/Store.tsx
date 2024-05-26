import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import HeaderBookmarkSlice from "./Reducers/HeaderBookmarkSlice";
import LayoutSlice from "./Reducers/LayoutSlice";
import ThemeCustomizerSlice from "./Reducers/ThemeCustomizerSlice";
import LanguageSlice from "./Reducers/LanguageSlice";
import FileManagerSlice from "./Reducers/FileManagerSlice";
import AuthSlice from "@/Redux/Reducers/AuthSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, AuthSlice);

const Store = configureStore({
  reducer: {
    layout: LayoutSlice,
    headerBookMark: HeaderBookmarkSlice,
    themeCustomizer: ThemeCustomizerSlice,
    langSlice: LanguageSlice,
    fileManager: FileManagerSlice,
    auth: persistedReducer,
  },
});

export const persistor = persistStore(Store);

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
