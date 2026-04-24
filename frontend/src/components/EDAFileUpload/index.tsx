import { useState, useRef, useCallback, type FC } from "react";
import { UploadCloud, FileCheck } from "lucide-react";
import { parseCsvFile } from "../../features/csv/csvParser";
import { useCsvStore } from "../../store/useCsvStore";
import "./EDAFileUpload.css";

interface Props { className?: string; }

export const EDAFileUpload: FC<Props> = ({ className = "" }) => {
  const setDataset = useCsvStore((s) => s.setDataset);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "parsing" | "done" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setStatus("error");
      setFileName("Only .csv files are supported");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setStatus("error");
      setFileName("File too large (max 100 MB)");
      return;
    }
    setFileName(file.name);
    setStatus("parsing");
    try {
      const dataset = await parseCsvFile(file);
      setDataset(dataset);
      setRowCount(dataset.rowCount);
      setStatus("done");
    } catch {
      setStatus("error");
      setFileName("Parse failed – check file format");
    }
  }, [setDataset]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  return (
    <div
      className={`eda-dropzone ${dragging ? "dragging" : ""} ${status === "done" ? "done" : ""} ${status === "error" ? "error" : ""} ${className}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={onInputChange}
      />

      {status === "done" ? (
        <div className="eda-status-row">
          <FileCheck size={22} className="eda-icon-success" />
          <div>
            <p className="eda-file-name">{fileName}</p>
            <p className="eda-file-meta">{rowCount.toLocaleString()} rows parsed · Click to replace</p>
          </div>
        </div>
      ) : status === "parsing" ? (
        <div className="eda-status-row">
          <div className="eda-spinner" />
          <p className="eda-parsing-label">Parsing {fileName}…</p>
        </div>
      ) : (
        <>
          <UploadCloud size={32} className={`eda-upload-icon ${status === "error" ? "eda-icon-error" : ""}`} />
          <p className="eda-upload-title">
            {status === "error" ? fileName : "Drop your CSV here"}
          </p>
          <p className="eda-upload-hint">
            {status === "error" ? "Click to try again" : "or click to browse · max 100 MB"}
          </p>
        </>
      )}
    </div>
  );
};
