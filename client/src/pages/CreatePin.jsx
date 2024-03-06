import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MyButton, ImageUpload } from "@components";
import { PageLayout, FormFields } from "@layouts";
import { Spinner, registerOptions } from "@utils";
import { useFetch, useTitle } from "@hooks";
import { pinService, searchService } from "@services";
import { uploadToCloudinary } from "@config";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

export default function CreatePin() {
  const { data: fetchTags } = useFetch(searchService.getAllTags);
  const [selectTag, setSelectTag] = useState(null);
  const [tag, setTag] = useState("");
  const [tagArray, setTagArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  useTitle("Create pin");

  const addTag = () => {
    if (tag !== "") {
      setTagArray(tagArray, tagArray.push(tag));
      setTag("");
    }
  };

  const deleteTag = (index) => {
    const newTags = [...tagArray];
    newTags.splice(index, 1);
    setTagArray(newTags);
  };

  const populateTags = [...tagArray, selectTag];
  const filterTags = populateTags.filter((tag) => tag !== null);

  const onSubmitHandler = async ({ title, description, image }) => {
    setLoading(true);
    let pinImages = [];
    try {
      if (image) {
        const uploadImgs = Array.from(image).map(async (singleImage) => {
          const upload = await uploadToCloudinary(singleImage);
          return upload.data.secure_url;
        });
        const uploadedUrls = await Promise.all(uploadImgs);
        pinImages.push(...uploadedUrls);
      }
      const { status, data } = await pinService.createAPin(
        title,
        description,
        pinImages,
        filterTags
      );
      if (status === 201) {
        toast.success(data.msg);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <h1 className="fs-5 fw-bold">Create your pin</h1>
      {loading ? (
        <Spinner text="Creating Pin..." />
      ) : (
        <>
          <Form
            className="my-4 p-4 border"
            id="createPost"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Row className="g-3 align-items-center">
              <Col lg={6} className="my-4">
                <div
                  style={{ height: "350px", width: "85%" }}
                  className="mx-auto rounded-4 cursor position-relative"
                >
                  <div className="rounded-4 d-flex flex-column justify-content-center align-items-center h-100 border border-2">
                    <FaCloudUploadAlt size="40px" />
                    <p>Choose file(s)</p>
                    <p className="text-center px-4">
                      File with maximum size of 5MB is allowed
                    </p>
                  </div>
                  <ImageUpload
                    id="image"
                    name="image"
                    multiple
                    register={register}
                    errors={errors?.image}
                    registerOptions={registerOptions?.image}
                    className="position-absolute top-0 end-0 h-100 opacity-0"
                  />
                </div>
              </Col>
              <Col lg={6} className="mb-4 px-lg-4">
                <FormFields
                  register={register}
                  registerOptions={registerOptions?.title}
                  errors={errors?.title}
                  id="title"
                  name="title"
                  label="Title"
                  type="text"
                  placeholder="Title"
                  className="my-4"
                />
                <FormFields
                  register={register}
                  registerOptions={registerOptions?.description}
                  errors={errors?.description}
                  id="description"
                  name="description"
                  label="Description"
                  type="text"
                  placeholder="Description"
                  className="my-4"
                />
                {fetchTags?.length > 0 && (
                  <Form.Group>
                    <Form.Label>See trending tags</Form.Label>
                    <Form.Select
                      size="lg"
                      className="mb-4"
                      onChange={(e) => setSelectTag(e.target.value)}
                    >
                      {fetchTags.map((tag, i) => (
                        <option key={i} value={tag}>
                          {tag.toLowerCase()}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <p className="text-center">OR add your tags</p>
                <div className="w-100 d-flex gap-4 align-items-center">
                  <Form.Group controlId="tags" className="w-100">
                    <Form.Label>Tags</Form.Label>
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
                  {tagArray.map((tag, i) => (
                    <div
                      key={i}
                      className="d-flex flex-wrap align-items-center gap-2 p-2 rounded-4 text-white"
                      style={{ backgroundColor: "var(--orangeLight)" }}
                      onClick={() => deleteTag(i)}
                    >
                      <span className="small">{tag}</span>
                      <span className="text-white cursor fw-bold">x</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-center justify-content-lg-end px-4">
            <MyButton
              text={isSubmitting ? <ClipLoader color="#ed5b09" /> : "Create"}
              style={{ backgroundColor: "var(--orangeLight)" }}
              disabled={isSubmitting}
              type="submit"
              form="createPost"
            />
          </div>
        </>
      )}
    </PageLayout>
  );
}
