import { useState } from "react";
import { Form, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export default function ImageUpload({
  id,
  name,
  register,
  registerOptions,
  errors,
  title,
  ...props
}) {
  const [preview, setPreview] = useState();

  const onPreviewPicture = (e) => {
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files && e.target.files[i]) {
        if (e.target.files[i].size > 5 * 1000 * 1000) {
          toast.error("File with maximum size of 5MB is allowed");
          return false;
        }
        images.push(URL.createObjectURL(e.target.files[i]));
        setPreview(images);
      }
    }
  };

  return (
    <>
      <Form.Group controlId={id} className="mb-3">
        <Form.Label>{title}</Form.Label>
        <Form.Control
          type="file"
          name={name}
          accept="image/*"
          {...register(name, registerOptions)}
          onChange={onPreviewPicture}
          isInvalid={!!errors}
          {...props}
        />
        <Form.Control.Feedback type="invalid" className="mb-2">
          {errors?.message}
        </Form.Control.Feedback>
      </Form.Group>
      {preview && (
        <>
          {preview.map((img, i) => (
            <Image
              src={img}
              key={i}
              alt="image preview"
              style={{ width: "40px", height: "40px" }}
              className="rounded-4 object-fit-cover mb-3 me-2"
            />
          ))}
        </>
      )}
    </>
  );
}

ImageUpload.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.func,
  registerOptions: PropTypes.object,
  errors: PropTypes.object,
};
