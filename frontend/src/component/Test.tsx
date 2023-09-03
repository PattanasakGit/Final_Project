import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from './system/firebase';
import { ChangeEvent, useRef, useState } from 'react';
import Swal from 'sweetalert2';
const url_frontend = 'http://localhost:3000';

const [selectedImages, setSelectedImages] = useState<File[]>([]);
const [img, setImg] = useState<string | null>(null); // URL.createObjectURL(selectedImage)
const inputRef = useRef<HTMLInputElement | null>(null); // Ref สำหรับ input file element
const [isLoading, setIsLoading] = useState<boolean>(false);
const [progress, setProgress] = useState<number>(0);




export const uploadFiles = async (path: string, onUploadComplete: (success: boolean) => void, setProgress: (progress: number) => void
) => {

    // ฟังก์ชันเรียกเมื่อมีการเลือกไฟล์รูปภาพ
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            setSelectedImages([selectedImage]);
            setImg(URL.createObjectURL(selectedImage)); // Show selected image before uploading
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    // ฟังก์ชันอัปโหลดรูปภาพที่เลือก
    const onUploadSelectedImage = async () => {

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        setIsLoading(true);
        const selectedImage = selectedImages[0];
        const storageRef = ref(storage, `/${path}/${formattedDate}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress); // เรียกใช้ setProgress เพื่ออัปเดตค่า progress
            },
            (error) => {
                console.log(error);
                onUploadComplete(false);
            },
            async () => {
                try {
                    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    onUploadComplete(true);
                } catch (error: any) {
                    console.error('Error getting download URL:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'พบข้อผิดพลาด',
                        text: error.message,
                        showCancelButton: false,
                        // showConfirmButton: false,
                    })
                    onUploadComplete(false); // เรียก callback เมื่อเกิดข้อผิดพลาด
                    return false;
                }
            }
        );


        const handleUploadButtonClick = () => {
            if (inputRef.current) {
                inputRef.current.click(); // เมื่อคลิกปุ่มอัปโหลด ให้เรียกใช้ click ของ input
            }
        };

        function alert_before_upload() {
            onUploadSelectedImage();
        }
    }
    return (
        <div>
            <input type='file' onChange={onFileChange} ref={inputRef} style={{ display: 'none' }} />
            <button onClick={() => inputRef.current?.click()}>เลือกรูปภาพ</button>
        </div>
    );

}
