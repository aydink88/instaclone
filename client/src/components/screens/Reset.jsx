import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isEmail from "../../utils/isEmail";
import { resetPassword } from "../../services/api";
import { useUIContext } from "../../contexts/UIContext";
import { Button, Form, Card } from "react-bootstrap";
const Reset = () => {
  const { setToast } = useUIContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const postData = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setToast("invalid email", "error");
      return;
    }

    try {
      const data = await resetPassword(email);
      setToast(data.message, "success");
      navigate("/signin");
    } catch (err) {
      setToast(err.message, "error");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="p-5 text-center my-3" style={{ maxWidth: "400px" }}>
        <Form onSubmit={postData}>
          <h2>Instagram</h2>
          <Form.Control
            className="my-4"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="btn">
            reset password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Reset;
