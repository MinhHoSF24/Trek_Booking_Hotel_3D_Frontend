'use client'
import { useState, ChangeEvent } from "react";
import { analytics } from "../../../../public/firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function UpLoadImage() {
  const [fileuploads, setFileUploads] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFileUploads(files);
      const previews: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            previews.push(e.target.result as string);
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const upload = async () => {
    if (fileuploads !== null && fileuploads.length > 0) {
      const urls: string[] = [];
      for (let i = 0; i < fileuploads.length; i++) {
        const file = fileuploads[i];
        const storageRef = ref(analytics, 'Trek_Image/' + file.name);
        const uploadTask = uploadBytes(storageRef, file);
  
        const snapshot = await uploadTask;
  
        const downloadURL = await getDownloadURL(snapshot.ref);
        urls.push(downloadURL);
      }
      setImageUrls(urls);
    } else {
      alert("Please select one or more files.");
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange}></input>
      <button onClick={upload}>Upload</button>
      {imagePreviews.map((preview, index) => (
        <img key={index} src={preview} alt={`Preview ${index}`} style={{ maxWidth: "100px", margin: "5px" }} />
      ))}
      {imageUrls.length > 0 && (
        <div>
          <h2>Image URLs:</h2>
          <p>{imageUrls}</p>
          <ul>
            {imageUrls.map((url, index) => (
              <li key={index}><img src={url} alt={`Uploaded Image ${index}`} style={{ maxWidth: "100px" }} /></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
