import React, { useEffect } from "react";
import { Button, Progress } from "reactstrap";
import { Storage, StorageData } from "@/Constant";
import { Database } from "react-feather";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  setStorageQuota,
  setStorageUsed,
} from "@/Redux/Reducers/FileManagerSlice";

export const StorageSection = () => {
  const { storageUsed, storageQuota } = useAppSelector(
    (store) => store.fileManager
  );
  const { user } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setStorageQuota(user?.storageQuota));
    dispatch(setStorageUsed(Number(user?.storageUsed)));
  }, []);

  return (
    <>
      <ul className="simple-list">
        <li>
          <Button outline color="primary" className="progress-text w-100">
            <Database />
            {Storage}
          </Button>
          <div className="m-t-15">
            <Progress
              color="primary"
              style={{ height: "8px" }}
              value={storageUsed}
              className="sm-progress-bar mb-3"
            />
            <h5>
              {storageUsed} GB of {storageQuota} GB used
            </h5>
          </div>
        </li>
      </ul>
      <hr style={{ opacity: 0.25 }} />
    </>
  );
};
