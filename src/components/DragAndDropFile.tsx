import { UploadIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection, Accept } from "react-dropzone";
import ExportIcon from "@/../public/icons/export-black.svg";
import CSVIcon from "@/../public/icons/CSV.svg";
import Image from "next/image";

interface DragAndDropFileProps {
    onFileAccepted: (file: File) => void;
    accept?: Accept;
    maxFiles?: number;
}

const DragAndDropFile: React.FC<DragAndDropFileProps> = ({
    onFileAccepted,
    accept = { "text/csv": [".csv"] },
    maxFiles = 1,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                setSelectedFile(null);
                const message = fileRejections[0]?.errors?.[0]?.message ?? "Invalid file";
                setError(message);
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setSelectedFile(file);
                setError(null);
                onFileAccepted(file);
            }
        },
        [onFileAccepted]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        multiple: maxFiles > 1,
        accept,
    });

    const removeFile = () => {
        setSelectedFile(null);
        setError(null);
    };

    // Display accepted file types
    let acceptLabel = ".file";
    if (typeof accept === "object") {
        const exts = Object.values(accept).flat();
        acceptLabel = exts.length > 0 ? exts.join(", ") : ".file";
    }

    return (


        <div className="w-full">
            <div
                {...getRootProps({

                })}
                className={` cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-colors ` +
                    (isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white")}
            >
                <input {...getInputProps()} />
                <div className="text-sm text-gray-600 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                        <Image
                            src={ExportIcon}
                            alt="Export"
                            className="text-black"
                        />
                    </div>

                    <div>
                        Drag and drop a <strong>{acceptLabel}</strong> file, or click to select
                    </div>
                </div>

            </div>

            {error && (
                <div className="text-sm text-red-600 font-medium mt-2">{error}</div>
            )}

            {selectedFile && (
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50 mt-3 relative">
                    <div className="text-blue-600 text-xs font-bold px-2 py-1 rounded">
                        <Image
                            src={CSVIcon}
                            alt="Export"
                            className="text-black"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-coffee">{selectedFile.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            {(selectedFile.size / 1024).toFixed(2)} KB / .csv
                        </div>
                    </div>
                    <button
                        onClick={removeFile}
                        className="absolute right-2 top-2 text-sm text-coffee"
                        title="Remove file"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default DragAndDropFile;
