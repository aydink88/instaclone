import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newPassword } from "../../services/api";
import { useUIContext } from "../../contexts/UIContext";
import { Button, Card, Form } from "react-bootstrap";

const SignIn = () => {
  const { setToast } = useUIContext();
  const navigate = useNavigate();
  const [password, setPasword] = useState("");
  const { token } = useParams();

  const postData = async (e) => {
    e.preventDefault();
    try {
      const data = await newPassword(password, token);
      console.log(data);
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
            type="password"
            placeholder="enter a new password"
            value={password}
            onChange={(e) => setPasword(e.target.value)}
          />
          <Button type="submit" className="btn">
            Update password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
