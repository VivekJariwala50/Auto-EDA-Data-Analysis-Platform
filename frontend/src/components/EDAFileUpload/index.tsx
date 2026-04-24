import type { FC } from "react";
import { Upload, message } from "antd";
import type { UploadProps } from "antd";
import { parseCsvFile } from "../../features/csv/csvParser";
import { useCsvStore } from "../../store/useCsvStore";

const { Dragger } = Upload;

interface EDAFileUploadProps {
  className?: string;
}

export const EDAFileUpload: FC<EDAFileUploadProps> = ({ className = "" }) => {
  const setDataset = useCsvStore((state) => state.setDataset);

  const props: UploadProps = {
    accept: ".csv",
    multiple: false,
    showUploadList: false,
    className: `eda-dragger-base ${className}`,
    async beforeUpload(file) {
      // Validate File Type
      const isCsv = file.type === "text/csv" || file.name.endsWith(".csv");
      if (!isCsv) {
        message.error("Only CSV files are supported.");
        return Upload.LIST_IGNORE;
      }

      // Size Validation
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        message.error(
          "File is too large! Please upload a CSV smaller than 25MB.",
        );
        return Upload.LIST_IGNORE;
      }

      // Optimized Parsing
      try {
        const dataset = await parseCsvFile(file);
        setDataset(dataset);
        message.success(`Parsed ${dataset.rowCount} rows successfully.`);
      } catch (error) {
        console.error("Parse Error:", error);
        message.error(
          "Failed to parse CSV. The file may be corrupted or incorrectly formatted.",
        );
      }

      return false;
    },
  };

  return (
    <Dragger {...props}>
      <div className="eda-upload-content p-4">
        <p className="upload-title h4 fw-bold">Upload your dataset</p>
        <p className="upload-hint text-muted">
          Drag & drop a <strong>.csv</strong> file here.
        </p>
        <div className="mt-3">
          <span className="badge bg-light text-secondary border">MAX 25MB</span>
        </div>
      </div>
    </Dragger>
  );
};
