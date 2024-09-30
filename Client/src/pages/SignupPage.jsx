import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify';

const SignupPage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [isFormValid, setIsFormValid] = useState(false)

    const validateName = (value) => {
        if (value.trim().length < 2) {
            return 'Name must be at least 2 characters long'
        }
        return ''
    }

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address'
        }
        return ''
    }

    const validatePassword = (value) => {
        if (value.length < 8) {
            return 'Password must be at least 8 characters long'
        }
        return ''
    }

    const validateConfirmPassword = (value) => {
        if (value !== password) {
            return 'Passwords do not match'
        }
        return ''
    }

    useEffect(() => {
        const nameError = validateName(name)
        const emailError = validateEmail(email)
        const passwordError = validatePassword(password)
        const confirmPasswordError = validateConfirmPassword(confirmPassword)

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        })

        setIsFormValid(
            !nameError && !emailError && !passwordError && !confirmPasswordError &&
            name.trim() !== '' && email.trim() !== '' && password !== '' && confirmPassword !== ''
        )
    }, [name, email, password, confirmPassword])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isFormValid) {
            // Handle signup logic here
            const user = {
                username: name,
                password: password,
                email: email
            }

            try {
                const url = `${import.meta.env.VITE_REACT_API_URL}/auth/signup`;

                // console.log(url)

                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });

                const json = await res.json();

                if (res.ok) {
                    navigate("/login");
                    toast.success(json.message, { position: 'top-right' })
                } else if (res.status == 409) {
                    toast.error(json.message, { position: 'top-right' })
                } else {
                    toast.error("Signup failed", { position: 'top-right' })
                }
            } catch (error) {
                console.log("Df")
                toast.error(error.message, { position: 'top-right' })
            }

        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <main className='flex w-full h-full overflow-y-scroll'>
            <div className="md:w-[50%] w-full p-10">
                <div className="w-full h-full flex flex-col p-10 justify-center items-center">
                    <div className="md:text-[60px] text-[30px] font-semibold justify-start text-center">
                        Create Account
                    </div>
                    <div className="text-[24px] font-semibold text-[#fe965e] mt-2">
                        Sign up for a new account
                    </div>
                    <form onSubmit={handleSubmit} className='w-full max-w-[400px] mt-10'>
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-white px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#fe965e]"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#fe965e]"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-white px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#fe965e] pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-white px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#fe965e] pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                        <div className='flex justify-center mt-[50px] w-full'>
                            <Button
                                type="submit"
                                className="w-[200px] bg-[#fe965e] rounded-full p-3 text-lg text-white text-center"
                                disabled={!isFormValid}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                    <div className='mt-5'>
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-[#fe965e] hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
            <div className='md:flex hidden w-[50%] justify-center h-[95vh]'>
                <div className='w-[60%] h-[90%] rounded-b-full bg-[#f9d9c6] flex items-center justify-center'>
                    <svg className="w-1/2 h-1/2 text-[#fe965e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
            </div>
        </main>
    )
}

export default SignupPage