import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!) {
      fileUpload(file: $file) {
        url
      }
    }
  `;
  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => {
      setImage(data.fileUpload.url);
    },
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile({ variables: { file } });
  };

  return (
    <div>
      <h2>File upload</h2>
      <input type="file" onChange={fileChangeHandler} />
      {image && (
        <>
          <img
            src={image}
            alt={image}
            style={{ width: "250px", height: "250px" }}
          />
          <p>Your image url: {image}</p>
        </>
      )}
    </div>
  );
};

export default UploadForm;
