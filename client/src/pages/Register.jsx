import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


const Register = () => {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (formData) => {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/register', formData);
          console.log('Registration successful:', response.data);
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        } catch (error) {
          console.error('Registration failed:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            stack: error.stack,
          });
          alert('Registration failed. Please check your input and try again.');
        }
      };


  return (
    <>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">name</label>
          <input type="text" id="name" {...register('name', { required: true })} />
          {errors.name && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register('email', { required: true })} />
          {errors.email && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register('password', { required: true })} />
          {errors.password && <span>This field is required</span>}
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  )
}

export default Register
