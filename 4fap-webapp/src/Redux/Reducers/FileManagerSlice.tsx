import { FileContentData, FileManagerSliceType } from "@/Types/FileManagerType";
import { createSlice } from "@reduxjs/toolkit";

const initialState: FileManagerSliceType = {
  fileSidebar: false,
  myFile: [] as FileContentData[],
  searchTerm: "",
  storageUsed: 0,
  storageQuota: 0,
};

const FileManagerSlice = createSlice({
  name: "FileManagerSlice",
  initialState,
  reducers: {
    setMyFile: (state, action) => {
      state.myFile = action.payload;
    },

    setStorageQuota: (state, action) => {
      state.storageQuota = action.payload;
    },

    setStorageUsed: (state, action) => {
      state.storageUsed = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    getFile: () => {
      document.getElementById("upfile")?.click();
    },

    fileSaved: (state, action) => {
      const myFiles = [...state.myFile];
      myFiles.push(action.payload);
      state.myFile = myFiles;
    },

    incrementStorage: (state, action) => {
      state.storageUsed += action.payload;
    },

    /*onFileUpload: (state, action) => {
      const date = new Date();
      const time = msToTime(date.getMilliseconds(), "ago", "long");
      const myFiles = [...state.myFile];

      uploadFile(action).then((res) => {
        if (action.payload !== null) {
          saveFile({
            name: `${action.payload.selectedFile.name}`,
            size: `${convertSize(action.payload.selectedFile.size)}`,
            modify: `${time}`,
            userId: action.payload.user.id,
            minioObjectName: res.data,
            icon: "f-22 fa fa-file-text-o txt-info",
            folderClass: "f-44 fa fa-folder txt-warning",
            title: "Endless Admin",
            folderSize: "10 files",
            modifyFolder: "1 Day ago",
          }).then((response) => {
            myFiles.push(response.data);
          });
          state.myFile = myFiles;
          toast.success("File Upload Successfully !");
        } else {
          toast.error("Please Select at least one file !");
        }
      });
    },*/
  },
});

export const {
  setMyFile,
  setSearchTerm,
  getFile,
  fileSaved,
  incrementStorage,
  setStorageQuota,
  setStorageUsed,
} = FileManagerSlice.actions;

export default FileManagerSlice.reducer;
