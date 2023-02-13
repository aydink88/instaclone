import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import isEmail from '../../utils/isEmail';
import { signinRequest } from '../../services/api';
import { useUser } from '../../contexts/User';
import { useUIContext } from '../../contexts/UIContext';
import { Button, Card, Form } from 'react-bootstrap';

const SignIn = () => {
  const { setToast } = useUIContext();
  const { dispatch } = useUser();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const submitSigninForm = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setToast('invalid email', 'error');
      return;
    }
    if (!password) {
      setToast('fill the fields', 'error');
      return;
    }

    try {
      const data = await signinRequest(email, password);

      localStorage.setItem('jwt', data.token);
      dispatch({ type: 'USER', payload: data.user });
      localStorage.setItem('user', JSON.stringify(data.user));
      setToast('signedin success', 'success');
      navigate('/');
    } catch (err) {
      setToast(err.message, 'error');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="p-5 text-center my-3" style={{ maxWidth: '400px' }}>
        <Form onSubmit={submitSigninForm}>
          <Card.Header>
            <h2>Instagram</h2>
          </Card.Header>
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="btn">
            Login
          </Button>
          <Form.Check
            className="my-4 text-start"
            type="checkbox"
            label="Login as demo user"
            onChange={(e) => {
              if (e.target.checked) {
                setEmail('demo@demo.com');
                setPassword('demo1234');
              }
            }}
          />
        </Form>
        <Card.Footer className="my-4">
          <h5>
            <Link to="/signup">Dont have an account ?</Link>
          </h5>
          <h6>
            <Link to="/reset">Forgot password ?</Link>
          </h6>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default SignIn;
