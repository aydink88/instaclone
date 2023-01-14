import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/api";
import imageUpload from "../../utils/imageUpload";
import { Form, Button } from "react-bootstrap";
import { useUIContext } from "../../contexts/UIContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const { setToast } = useUIContext();

  const submitNewPost = async (e) => {
    e.preventDefault();
    const reqBody = { title, body, pic: "" };
    if (!image || !title || !body) {
      return setToast("Fill all fields", "error");
    }

    try {
      const imageUrl = await imageUpload(image);
      reqBody.pic = imageUrl;
      const data = await createPost(reqBody);
      console.log(data);
      setToast("Created post Successfully", "success");
      navigate("/");
    } catch (err) {
      setToast(err.message, "error");
    }
  };

  return (
    <div
      className="card"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Form onSubmit={submitNewPost}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Control
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="body">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
        </Form.Group>
        <Button type="submit">Submit post</Button>
      </Form>
    </div>
  );
};

export default CreatePost;
