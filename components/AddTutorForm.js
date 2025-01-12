import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { updateTutor, createTutor } from '../api/tutorData';

const initialState = {
  tutor_name: '',
  email: '',
  rate: 0,
  education: '',
  subject: [],
  bio: '',
};
export default function AddTutorForm({ obj }) {
  const [formInput, setFormInput] = useState([]);
  const [subject, setSubject] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj?.firebaseKey) setFormInput(obj);
  }, [obj]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = {
      ...formInput,
      subject,
    };
    if (obj?.firebaseKey) {
      updateTutor(result).then(() => router.push('/tutors/manageTutors'));
    } else {
      const payload = { ...result, uid: user.uid };
      createTutor(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateTutor(patchPayload).then(() => {
          router.push('/tutors/viewTutors');
        });
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRemove = (item) => {
    setSubject((previousData) => previousData.filter((el) => el !== item));
  };

  return (
    <Container className="form-container">
      <Form onSubmit={handleSubmit}>
        <h2 className="tutor-form">{obj?.firebaseKey ? 'Update' : 'Create'} Tutor</h2>

        {/* NAME INPUT  */}
        <FloatingLabel controlId="floatingInput1" label="Tutor Name" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Tutor Name"
            name="tutor_name"
            value={formInput.tutor_name}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* IMAGE INPUT  */}
        <FloatingLabel controlId="floatingSelect" label="Add Image" className="mb-3">
          <Form.Control
            type="url"
            placeholder="Add Image"
            name="image"
            value={formInput.image}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* SUBJECT SELECT  */}
        <FloatingLabel controlId="floatingSelect" label="Subject" className="mb-3">
          <Form.Select
            name="subject"
            onChange={(currentItem) => setSubject((previousItems) => [...previousItems, currentItem.target.value])}
          >
            <option>Select</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="Javascript">JAVASCRIPT</option>
            <option value="REACT">REACT.JS</option>
            <option value="VUE">VUE.JS</option>
            <option value="C#">C#</option>
            <option value="SQL">SQL</option>
            <option value="DJANGO">DJANGO</option>
            <option value="JAVA">JAVA</option>
            <option value="PYTHON">PYTHON</option>
            <option value="PHP">PHP</option>
            <option value="SWIFT">SWIFT</option>

          </Form.Select>
          <ul className="subject-list">
            {subject?.map((sub) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <li>{sub} <span onClick={() => handleRemove(sub)}>x</span></li>
            ))}
          </ul>
        </FloatingLabel>

        {/* RATE INPUT  */}
        <FloatingLabel controlId="floatingInput3" label="Rate per hour" className="mb-3">
          <Form.Control
            type="number"
            placeholder="rate"
            name="rate"
            value={formInput.rate}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="floatingInput3" label="Education" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Education"
            name="education"
            value={formInput.education}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* BIO TEXTAREA  */}
        <FloatingLabel controlId="floatingTextarea" label="Bio" className="mb-3">
          <Form.Control
            as="textarea"
            placeholder="Bio"
            style={{ height: '100px' }}
            name="bio"
            value={formInput.bio}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <Button style={{ background: '#e3740d', marginBottom: '5%' }} type="submit">{obj?.firebaseKey ? 'Update' : 'Create'} Tutor</Button>
      </Form>
    </Container>

  );
}

AddTutorForm.propTypes = {
  obj: PropTypes.shape({
    tutor_name: PropTypes.string,
    email: PropTypes.string,
    rate: PropTypes.number,
    education: PropTypes.string,
    subject: PropTypes.string,
    bio: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

AddTutorForm.defaultProps = {
  obj: initialState,
};
