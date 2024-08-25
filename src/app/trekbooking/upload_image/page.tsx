'use client'
import Image from 'next/image';
import { useState, ChangeEvent } from "react";
import { analytics } from "../../../../public/firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function UpLoadImage() {
  const [fileupload, setfileupload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageRef, setImageRef] = useState<any | null>(null);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setfileupload(file || null);
  };

  const upload = async () => {
    if (fileupload !== null) {
      const storageRef = ref(analytics, 'Trek_Image/' + fileupload.name);
      await uploadBytes(storageRef, fileupload);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL); // Lưu URL vào state để hiển thị
      //setImageRef(storageRef); // Lưu reference của image để xóa
    } else {
      alert("Please select a file.");
    }
  };

  const deleteImage = async (url: string | null) => {
    if (imageRef !== null && url !== null) {
      await deleteObject(imageRef);
      setImageUrl(null); // Xóa URL khỏi state để không hiển thị nữa
      setImageRef(null); // Xóa reference khỏi state
      alert(`Image at URL: ${url} deleted successfully.`);
    } else {
      alert("No image to delete.");
    }
  };

  const deleteImageByUrl = async (url: string) => {
    try {
      // Tạo tham chiếu lưu trữ từ URL
      const urlObject = new URL(url);
      const imagePath = urlObject.pathname.split('/o/Trek_Image%2F')[1];
      const decodedImagePath = decodeURIComponent(imagePath);
      const storageRef = ref(analytics, 'Trek_Image/' + decodedImagePath);


      await deleteObject(storageRef);
      setImageUrl(null); // Xóa URL khỏi state để không hiển thị nữa
      alert("Image deleted successfully.");
    } catch (error) {
      alert("Error deleting image: " + error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange}></input>
      <button onClick={upload}>Upload</button>
      {imageUrl && ( // Kiểm tra xem imageUrl có tồn tại không trước khi hiển thị
        <div>
          <h2>Image URL:</h2>
          <p>{imageUrl}</p>
          <img src={imageUrl} alt="Uploaded Image" style={{ maxWidth: "100%" }} /> {/* Hiển thị hình ảnh */}
          {/* <button onClick={() => deleteImage(imageUrl)}>Delete Image</button> */}
          <button onClick={() => deleteImageByUrl(imageUrl)}>Delete Image</button>
        </div>
      )}
    </div>
  );
}
