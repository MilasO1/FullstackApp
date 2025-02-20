import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
      const onSubmit = async (formData) => {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', formData);
          console.log('Login successful:', response.data);
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } catch (error) {
          console.error('Login failed:', {
            message: error.message,
            status: error.response?.status,
            })
        }
    };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default Login
