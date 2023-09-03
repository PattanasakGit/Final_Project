import React, { useState } from 'react';
import { uploadFiles } from './Test';

const TestPage = () => {
  const [isUploadSuccess, setIsUploadSuccess] = useState<boolean | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleUploadComplete = (success: boolean) => {
    setIsUploadSuccess(success);
  };

  const onUploadClick = () => {
    uploadFiles(
      'TestUpload',
      handleUploadComplete,
      setUploadProgress // ส่ง setUploadProgress เพื่ออัปเดตค่า progress
    );
  };

  return (
    <div style={{ margin: '10rem' }}>
      <h1>Upload an Image</h1>
      {isUploadSuccess !== null && (
        <p>Upload {isUploadSuccess ? 'successful' : 'failed'}</p>
      )}
      <p>Progress: {uploadProgress}%</p> {/* แสดงค่า progress */}
      <button onClick={onUploadClick}>Upload Image</button>
    </div>
  );
};

export default TestPage;
