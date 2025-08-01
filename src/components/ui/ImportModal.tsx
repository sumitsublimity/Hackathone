"use client";

import ImportIcon from "@/../public/icons/import.svg";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // adjust path if needed

import DragAndDropFile from "@/components/DragAndDropFile";
import { Button } from "@/components/ui/button"; // your styled button
import Image from "next/image";
import { useEffect, useState } from "react";
import { useExportCSV } from "@/services/hook/useExportCSV";

export interface ExportParams {
    year?: string;
    siteID?: string;
    isTemplate?: string;
}
export interface ImportParams {
    apiCall: (file: File) => void;
    params?: ExportParams;
    url?: string;
}

const ImportDialog = ({ apiCall, params, url }: ImportParams) => {
    const { exportCSV, isSuccess } = useExportCSV();
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleFileAccepted = (file: File) => {
        console.log("File accepted:", file)
        setSelectedFile(file)
    };

    const downloadSampleCSVFun = () => {
        if (params) {
            exportCSV(params, url);
        } else {
            // Optionally handle the case where params is undefined
            console.warn("Cannot download sample CSV: params is undefined.");
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setOpen(false)
        }
    }, [isSuccess])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-full inline-flex items-center gap-2 text-sm bg-darkGreen hover:bg-darkGreen hover:brightness-90 cursor-pointer">
                    <Image src={ImportIcon} alt="Import" className="text-white" />
                    Import
                </Button>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader>
                    <DialogTitle asChild>
                        <div className="flex flex-col gap-2 my-2">
                            <h1 className="text-2xl font-semibold text-gray-800">Import File</h1>
                            <p className="text-sm text-muted-foreground">How do you want to import your file?</p>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Upload formatted CSV file</p>
                            <p className="text-sm text-muted-foreground">
                                Import a CSV file that's already formatted to fit the template. <br />
                                <span className="text-peach cursor-pointer hover:underline" onClick={() => {
                                    downloadSampleCSVFun()
                                }}>
                                    Download sample CSV
                                </span>
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <DragAndDropFile
                    onFileAccepted={handleFileAccepted}
                    accept={{ "text/csv": [".csv"] }}
                />

                <DialogFooter className="mt-5 w-full flex flex-row justify-between sm:justify-between">
                    <DialogClose asChild>
                        <Button
                            variant="default"
                            className="bg-peach cursor-pointer hover:bg-peach hover:brightness-90"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        className="bg-darkGreen cursor-pointer hover:bg-darkGreen hover:brightness-120"
                        onClick={() => {
                            if (selectedFile) {
                                apiCall(selectedFile);
                                setOpen(false)
                            }
                        }}
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImportDialog;
