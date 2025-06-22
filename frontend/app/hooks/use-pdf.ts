// const usePdfActions = () => {
//     // Only upload functionality remains, no userDocuments state here
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // IMPORTANT: Replace this with the actual base URL of your backend API
//     const BACKEND_API_BASE_URL = 'http://localhost:5000'; // Example: 'https://your-backend-app.com'

//     const uploadPdf = useCallback(async (pdfBlob: Blob, fileName: string, userId: string) => {
//         setIsLoading(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append('pdfFile', pdfBlob, fileName);
//         formData.append('userId', userId);

//         try {
//             const response = await fetch(`${BACKEND_API_BASE_URL}/api-v1/files/upload`, {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to upload PDF');
//             }

//             const result = await response.json();
//             console.log('Upload successful:', result);
//             return result;
//         } catch (err: any) {
//             console.error('Error during PDF upload:', err);
//             setError(err.message);
//             throw err;
//         } finally {
//             setIsLoading(false);
//         }
//     }, [BACKEND_API_BASE_URL]);

//     // Removed fetchUserDocuments function as per request

//     return {
//         // userDocuments is removed
//         isLoading, // Renamed from isUploading to isLoading for general purpose use in hook
//         error,
//         uploadPdf,
//         // fetchUserDocuments is removed
//     };
// };

