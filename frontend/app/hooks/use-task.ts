import { deleteData, fetchData, postData, updateData } from "@/lib/fetch-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetMyFilesQuery = () => {
    return useQuery({
        queryKey: ["my-files", "files"],
        queryFn: async () => await fetchData(`/files/`),
    })
};

export const useDeleteFileMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (fileId: string) =>
            deleteData(`/files/${fileId}`),
        onSuccess: (_, fileId) => {
            // Invalidate and refetch the 'my-files' query to update the list
            queryClient.invalidateQueries({ queryKey: ["my-files"] });
            console.log(`File with ID ${fileId} deleted successfully. Refetching files.`);
        },
        onError: (error, fileId) => {
            console.error(`Error deleting file ${fileId}:`, error);
            alert(`Failed to delete file: ${error.message}`); // Inform the user
        },
    })
}
