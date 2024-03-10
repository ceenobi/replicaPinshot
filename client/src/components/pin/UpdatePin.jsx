import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Form, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FormFields } from "@layouts";
import { registerOptions } from "@utils";
import { pinService, searchService } from "@services";
import { MyModal, ImageUpload, MyButton } from "@components";
import { IoMdSend } from "react-icons/io";
import { uploadToCloudinary } from "@config";

export default function UpdatePin({ pin, setData }) {
  const [show, setShow] = useState(false);
  const [tag, setTag] = useState("");
  const [tagArray, setTagArray] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: pin?.title,
      description: pin?.description,
      tags: pin?.tags,
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addTag = () => {
    if (tag !== "") {
      setTagArray(tagArray, tagArray.push(tag));
      setTag("");
    }
  };

  const deletePinTag = async (index) => {
    try {
      const res = await searchService.deleteATag(pin._id, index);
      toast.success(res.data);
      const { data } = await pinService.getAPin(pin._id);
      setData(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  const deleteInputTag = (index) => {
    const newOptions = [...tagArray];
    newOptions.splice(index, 1);
    setTagArray(newOptions);
  };

  const populateTags = [...tagArray, pin?.tags];
  const flattenTags = populateTags.flatMap((tag) => tag);
  const addNewTags = flattenTags.filter((tag) => tag !== null);

  const onSubmitHandler = async ({ title, description, image }) => {
    try {
      let pinImages = [];
      if (image) {
        const uploadPromises = Array.from(image).map(async (singleImage) => {
          const upload = await uploadToCloudinary(singleImage);
          return upload.data.secure_url;
        });
        const uploadedUrls = await Promise.all(uploadPromises);
        pinImages.push(...uploadedUrls);
      }
      const { status, data } = await pinService.updateAPin(
        pin._id,
        title,
        description,
        pinImages,
        addNewTags
      );
      if (status === 200) {
        toast.success(data.msg);
        const res = await pinService.getAPin(pin._id);
        setData(res.data);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  return (
    <>
      <FaEdit
        className="cursor"
        size="20px"
        onClick={handleShow}
        title="edit your post"
      />
      <MyModal show={show} handleClose={handleClose} title="Edit post">
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <FormFields
            register={register}
            errors={errors?.title}
            registerOptions={registerOptions?.title}
            className="my-4"
            id="title"
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
          />
          <FormFields
            register={register}
            errors={errors?.description}
            registerOptions={registerOptions?.description}
            as="textarea"
            rows={2}
            className="my-4"
            id="description"
            name="description"
            label="Description"
            placeholder="Description"
          />
          <ImageUpload
            id="image"
            name="image"
            title="Upload images"
            multiple={true}
            register={register}
          />
          <div className="my-4">
            <div className="w-100 d-flex gap-4 align-items-center">
              <Form.Group controlId="tags" className="w-100">
                <Form.Label className="">Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  size="lg"
                  className="w-100"
                  value={tag.toLowerCase()}
                  onChange={(e) => setTag(e.target.value)}
                />
                <p className="small">Add a single tag per entry</p>
              </Form.Group>
              <IoMdSend size="25px" className="cursor" onClick={addTag} />
            </div>
            <div className="d-flex gap-2 mb-3 flex-wrap">
              {pin?.tags?.map((tag, i) => (
                <Badge
                  key={i}
                  className="cursor"
                  bg="secondary"
                  onClick={deletePinTag}
                >
                  {tag}
                  <span className="text-white fw-bold ms-2">x</span>
                </Badge>
              ))}
              {tagArray.map((tag, i) => (
                <Badge
                  key={i}
                  className="cursor"
                  bg="secondary"
                  onClick={() => deleteInputTag(i)}
                >
                  {tag}
                  <span className="text-white fw-bold ms-2">x</span>
                </Badge>
              ))}
            </div>
          </div>
          <MyButton
            text={isSubmitting ? <ClipLoader color="#ffffff" /> : "Update"}
            style={{ backgroundColor: "var(--orangeLight)" }}
            disabled={isSubmitting}
            type="submit"
            className="w-100"
          />
        </Form>
      </MyModal>
    </>
  );
}

UpdatePin.propTypes = {
  pin: PropTypes.any,
  setData: PropTypes.any,
};
