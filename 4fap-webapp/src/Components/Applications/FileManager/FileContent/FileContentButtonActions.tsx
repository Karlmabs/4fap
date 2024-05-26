import { Button, Form, Input } from "reactstrap";
import { AddNew, UploadFile } from "@/Constant";
import { PlusSquare, Upload } from "react-feather";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  fileSaved,
  getFile,
  incrementStorage,
  setMyFile,
} from "@/Redux/Reducers/FileManagerSlice";
import { msToTime } from "@/Helper/MsToTime";
import { getFiles, saveFile, uploadFile } from "@/Services/FileService";
import convertSize from "convert-size";
import { toast } from "react-toastify";
import { updateStorageUsed } from "@/Services/UserService";
import { setUserData } from "@/Redux/Reducers/AuthSlice";
import { User } from "@/Types/AuthType";

export const FileContentButtonActions = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { storageUsed } = useAppSelector((store) => store.fileManager);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.auth);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) setSelectedFile(files[0]);
  };

  useEffect(() => {
    getFiles(user?.id as number).then((res) => {
      dispatch(setMyFile(res.data));
    });
  }, [dispatch]);

  const onFileUpload = () => {
    const date = new Date();
    const time = msToTime(date.getMilliseconds(), "ago", "long");

    uploadFile(selectedFile).then((res) => {
      if (selectedFile !== null) {
        saveFile({
          name: `${selectedFile.name}`,
          size: `${convertSize(selectedFile.size)}`,
          modify: `${time}`,
          userId: user?.id,
          minioObjectName: res.data,
          icon: "f-22 fa fa-file-text-o txt-info",
          folderClass: "f-44 fa fa-folder txt-warning",
          title: "Endless Admin",
          folderSize: "10 files",
          modifyFolder: "1 Day ago",
        }).then((response) => {
          dispatch(fileSaved(response.data));
          dispatch(incrementStorage(convertSize(selectedFile.size, "GB")));
          updateStorageUsed(
            user?.id as number,
            storageUsed + convertSize(selectedFile.size, "GB")
          ).then((res) => dispatch(setUserData(res.data as User)));
          toast.success("File Upload Successfully !");
        });
      } else {
        toast.error("Please Select at least one file !");
      }
    });
  };

  return (
    <div className="flex-grow-1 text-end">
      <Form className="d-inline-flex" method="POST" name="myForm">
        <Button color="primary" onClick={() => dispatch(getFile())}>
          <PlusSquare />
          {AddNew}
        </Button>
        <div className="file-data">
          <Input
            id="upfile"
            type="file"
            multiple
            onChange={(e) => onFileChange(e)}
          />
        </div>
      </Form>
      <Button outline color="primary" className="ms-2" onClick={onFileUpload}>
        <Upload />
        {UploadFile}
      </Button>
    </div>
  );
};
