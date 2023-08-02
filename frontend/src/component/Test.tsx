// // FileUpload.tsx
// import React, { useState, ChangeEvent } from 'react';
// import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
// import { storage } from './firebase';

// interface FileUploadProps {
//     onUploadSuccess: (downloadUrl: string) => void;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
//     const [progress, setProgress] = useState<number>(0);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [file, setFile] = useState<File | null>(null);

//     const onFileUpload = async () => {
//         if (!file) return;
//         setIsLoading(true);
//         const storageRef = ref(storage, `/images/${file.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         uploadTask.on(
//             'state_changed',
//             (snapshot) => {
//                 const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//                 setProgress(progress);
//             },
//             (error) => {
//                 console.log(error);
//                 setIsLoading(false);
//             },
//             async () => {
//                 try {
//                     const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
//                     onUploadSuccess(downloadUrl);
//                     setIsLoading(false);
//                 } catch (error) {
//                     console.error('Error getting download URL:', error);
//                     setIsLoading(false);
//                 }
//             }
//         );
//     };

//     const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setFile(e.target.files[0]);
//         }
//     };

//     return (
//         <>
//             <input type="file" onChange={onFileChange} />
//             <button onClick={onFileUpload}>Upload!</button>
//             <div className="break"></div>
//             {isLoading && <p>File upload <b>{progress}%</b></p>}
//         </>
//     );
// };

// export default FileUpload;









// FileUpload.tsx
import React, { useState, ChangeEvent, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from './firebase';
import { Image } from 'antd';


interface FileUploadProps {
    onUploadSuccess: (downloadUrls: string[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [file, setFile] = useState<File | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...filesArray]);
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }

    };

    const onUploadSelectedImages = async () => {
        setIsLoading(true);
        const uploadedImageUrls: string[] = [];

        for (const selectedImage of selectedImages) {
            const storageRef = ref(storage, `/images/products/${Date.now()}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedImage);

            await new Promise<void>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                        reject();
                    },
                    async () => {
                        try {
                            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            uploadedImageUrls.push(downloadUrl);
                            resolve();
                        } catch (error) {
                            console.error('Error getting download URL:', error);
                            reject();
                        }
                    }
                );
            });
        }

        onUploadSuccess(uploadedImageUrls);

        setIsLoading(false);
        setSelectedImages([]);
    };

    const onRemoveImage = (index: number) => {
        setSelectedImages((prevSelectedImages) => {
            const newSelectedImages = [...prevSelectedImages];
            const removedImage = newSelectedImages.splice(index, 1)[0]; // ลบภาพออกจาก index
            URL.revokeObjectURL(URL.createObjectURL(removedImage)); // ลบ URL ออกจากเซสชัน
            return newSelectedImages;
        });
    };

    const renderSelectedImagesPreview = ({ disableUploadButton }: any) => {
        return (
            <div className="image-grid">
                {selectedImages.map((selectedImage, index) => (
                    <div key={index} className="image-card">
                        <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt={`Selected Image ${index}`}
                            style={{ borderRadius: '15px' }}
                            className='IMG_Upload'
                        />
                        <br />
                        <button className='Btn_cancle_upload' onClick={() => onRemoveImage(index)}>ลบ</button>
                    </div>
                ))}
                {selectedImages.length < 6 && !disableUploadButton && (
                    <button onClick={handleUploadButtonClick} className='Btn_select_file' style={{ width: 'auto' }}>
                        เลือกภาพ{<br />}เพื่ออัปโหลด
                    </button>
                )}
            </div>
        );
    };


    const handleUploadButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click(); // เมื่อคลิกปุ่มอัปโหลด ให้เรียกใช้ click ของ input
        }
    };

    return (
        <>
            <input type="file" style={{ display: 'none' }} onChange={onFileChange} ref={inputRef} />
            {selectedImages.length === 0 && (
                <button onClick={handleUploadButtonClick} className='Btn_select_file' style={{ width: 'auto' }}>
                    เลือกภาพเพื่ออัปโหลด
                </button>
            )}
            {selectedImages.length > 0 && (
                <div className="file-upload-container">
                    {renderSelectedImagesPreview({ disableUploadButton: selectedImages.length >= 6 })}
                    <button onClick={onUploadSelectedImages} className='Btn_upload'>อัพโหลดไปยัง cloud</button>
                </div>
            )}
            {isLoading && (
                <div className="file-upload-progress">
                    <p>File upload <b>{progress}%</b></p>
                </div>
            )}
        </>
    );
};

export default FileUpload;
