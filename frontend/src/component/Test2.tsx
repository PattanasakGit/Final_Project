// App.tsx
import React, { useState } from 'react';
import FileUpload from './Test'

const App: React.FC = () => {
  const handleUploadSuccess = (downloadUrl: string) => {
    console.log('Uploaded successfully:', downloadUrl);
    // ใส่โค้ดที่ต้องการทำเมื่ออัปโหลดรูปภาพสำเร็จในส่วนนี้
  };

  return (
    <div style={{margin:'10rem'}}>
      {/* <h1>Upload an Image</h1> */}
      <FileUpload onUploadSuccess={handleUploadSuccess} />
    </div>
  );
};

export default App;





// import { PlusOutlined } from '@ant-design/icons';
// import { Modal, Upload } from 'antd';
// import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
// import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
// import { storage } from './firebase';

// const getBase64 = (file: RcFile): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

// const App: React.FC = () => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([
//     {
//       uid: '-1',
//       name: 'image.png',
//       status: 'done',
//       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     }
//   ]);

//   const handleCancel = () => setPreviewOpen(false);

//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as RcFile);
//     }

//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
//   };

//   const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
//     setFileList(newFileList);

//   const uploadButton = (
//     <div>
//       <PlusOutlined />
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </div>
//   );






// function btnCheck(){
//   console.log(fileList);
// }

  
//   return (
//     <>
//       <div style={{ marginTop: '10rem' }}>
//         <Upload
//           listType="picture-card"
//           fileList={fileList}
//           onPreview={handlePreview}
//           onChange={handleChange}

//         >
//           {fileList.length >= 6 ? null : uploadButton}
//         </Upload>
//         <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
//           <img alt="example" style={{ width: '100%' }} src={previewImage} />
//         </Modal>
//       </div>
//       <div>
//         <button onClick={btnCheck}> กดเพื่อตรวจสอบ </button>
//       </div>
//     </>
//   );
// };

// export default App;
