import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Archive, ArrowUpRight, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteFileMutation, useGetMyFilesQuery } from "@/hooks/use-task";
import { useCallback } from "react";

const HistoryPage = () => {

    // Fetch user files
    const { data, isLoading, error } = useGetMyFilesQuery();
    // Use the delete mutation hook
    const { mutate: deleteFile, isLoading: isDeleting } = useDeleteFileMutation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader />
            </div>
        );
    }

    if (error) {
        console.error("Error fetching user documents:", error);
        return (
            <div className="flex justify-center items-center h-96 text-red-500">
                Failed to load your files. Please try again later.
            </div>
        );
    }

    const files = data || [];

    // Handler for delete button click
    const handleDeleteClick = useCallback((fileId: string) => {
        if (window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
            deleteFile(fileId); // Trigger the mutation
        }
    }, [deleteFile]);


    return (
        <div className="container mx-auto py-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <Archive className="text-indigo-500 size-8 animate-pop" />
                <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">My Files</h1>
            </div>
            <AnimatePresence>
                {files.length === 0 ? (
                    <motion.div
                        className="text-center text-muted-foreground text-lg mt-24"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                    >
                        No saved files found.
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {files.map((file) => (
                            <motion.div
                                key={file._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={{ duration: 0.4, type: "spring" }}
                            >
                                <Card className="bg-white/90 border-0 shadow-xl rounded-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-indigo-800 group-hover:text-indigo-900 transition-colors line-clamp-1">
                                            {file.fileName}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground mb-2 line-clamp-2">
                                            {file.fileName || "No name available"}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-indigo-500 mt-4">
                                            <span>
                                                {file.uploadedAt && (
                                                    <>Uploaded: {format(new Date(file.uploadedAt), "MMM d, yyyy HH:mm")}</>
                                                )}
                                            </span>
                                            <div className="flex gap-2">
                                                <a
                                                    href={file.s3Url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:underline text-blue-600 hover:text-blue-800"
                                                    title="Open File in New Tab"
                                                >
                                                    Open <ArrowUpRight className="size-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteClick(file._id)}
                                                    className="cursor-pointer flex items-center gap-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete File"
                                                    disabled={isDeleting} // Disable during deletion
                                                >
                                                    {isDeleting ? (
                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <Trash2 className="size-4" />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
            <style>
                {`
          .animate-fade-in {
            animation: fadeIn 0.8s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-pop {
            animation: pop 0.7s;
          }
          @keyframes pop {
            0% { transform: scale(0.7);}
            80% { transform: scale(1.15);}
            100% { transform: scale(1);}
          }
        `}
            </style>
        </div>
    );
};

export default HistoryPage;