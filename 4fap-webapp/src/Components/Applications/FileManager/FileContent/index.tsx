import { ImagePath } from "@/Constant";
import { useAppSelector } from "@/Redux/Hooks";
import { ToastContainer } from "react-toastify";
import { Card, CardHeader } from "reactstrap";
import SearchBar from "../SearchBar";
import { FileContentButtonActions } from "./FileContentButtonActions";
import FileMainContent from "./FileMainContent";

const FileContent = () => {
  const { myFile, searchTerm } = useAppSelector((state) => state.fileManager);

  const fileList = myFile.filter((data) => {
    if (searchTerm == null) return data;
    if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) return data;
  });

  return (
    <Card>
      <CardHeader>
        <div className="d-md-flex d-sm-block">
          <SearchBar />
          <FileContentButtonActions />
        </div>
      </CardHeader>
      {fileList.length ? <FileMainContent fileList={fileList} /> : null}
      <ToastContainer />
    </Card>
  );
};

export default FileContent;
