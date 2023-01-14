import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import isEmail from "../../utils/isEmail";
import imageUpload from "../../utils/imageUpload";
import { signupRequest } from "../../services/api";
import { useUIContext } from "../../contexts/UIContext";
import { Button, Card, Form } from "react-bootstrap";

const SignIn = () => {
  const { setToast } = useUIContext();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const submitSignupForm = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      return setToast("invalid email", "error");
    }
    if (!name || !password) {
      return setToast("fill the fields", "warning");
    }

    const reqBody = { name, email, password, pic: "" };
    try {
      if (image) {
        const imageUrl = await imageUpload(image);
        reqBody.pic = imageUrl;
      }
      const data = await signupRequest(reqBody);
      setToast(data.message, "success");
      navigate("/signin");
    } catch (err) {
      setToast(err.message, "error");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="p-5 text-center my-3" style={{ maxWidth: "400px" }}>
        <Form onSubmit={submitSignupForm}>
          <Card.Header>
            <h2>Instagram</h2>
          </Card.Header>
          <Form.Control
            className="my-4"
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Control
            className="my-4"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="my-4"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPasword(e.target.value)}
          />
          <Form.Group className="my-4">
            <Form.Label>Upload pic</Form.Label>
            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
          </Form.Group>
          <Button type="submit" className="btn my-4">
            Sign Up
          </Button>
        </Form>
        <Card.Footer>
          <h5>
            <Link to="/signin">Already have an account ?</Link>
          </h5>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default SignIn;
