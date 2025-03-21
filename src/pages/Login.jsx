import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [numberError, setNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // Refs for GSAP animations
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const numberInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const signupLinkRef = useRef(null);
  const errorMessageRef = useRef(null);

  const validateNumber = (num) => {
    // Basic validation - you can customize this based on your requirements
    return /^\d{10}$/.test(num); // Checks if it's exactly 10 digits
  };

  const Submit = async (e) => {
    e.preventDefault();
    
    // Reset error states
    setNumberError("");
    setPasswordError("");
    
    // Validate number
    if (!validateNumber(number)) {
      setNumberError("Invalid number - please try again");
      shakeElement(numberInputRef.current);
      return;
    }
    
    const userData = {
      number: number,
      password: password,
    };

    try {
      const response = await axios.post(
        `http://54.162.19.212:4000/admin/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data);

        // Animate logout before navigation
        gsap.to(formRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "back.in(1.7)",
          onComplete: () => navigate("/sorcenewspaper"),
        });
      }
    } catch (error) {
      // Handle different error cases
      if (error.response) {
        if (error.response.status === 401) {
          setPasswordError("Wrong password - please try again");
          shakeElement(passwordInputRef.current);
        } else {
          // If we're not sure what the error is, assume it's password related
          setPasswordError("Wrong password - please try again");
          shakeElement(passwordInputRef.current);
        }
      } else {
        // Network or other error
        setPasswordError("Login failed - please try again");
        shakeElement(formRef.current);
      }
    }
  };

  // Function to shake element for error feedback
  const shakeElement = (element) => {
    gsap.to(element, {
      x: [-10, 10, -8, 8, -5, 5, 0],
      duration: 0.6,
      ease: "power1.inOut",
    });
  };

  useEffect(() => {
    // Logo Animation
    gsap.fromTo(
      logoRef.current,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -180,
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );

    // Form Container Animation
    gsap.fromTo(
      formRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      }
    );

    // Input Fields Animation
    const inputAnimations = [numberInputRef.current, passwordInputRef.current];

    gsap.fromTo(
      inputAnimations,
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out",
      }
    );

    // Submit Button Animation
    gsap.fromTo(
      submitButtonRef.current,
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.6,
        ease: "back.out(1.7)",
      }
    );

    // Signup Link Animation
    gsap.fromTo(
      signupLinkRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.7,
        ease: "power2.out",
      }
    );

    // Hover and Interactive Animations
    const hoverElements = [
      numberInputRef.current,
      passwordInputRef.current,
      submitButtonRef.current,
    ];

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          scale: 1.02,
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          duration: 0.3,
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          scale: 1,
          boxShadow: "none",
          duration: 0.3,
        });
      });
    });
  }, []);

  return (
    <div className="bg-purple-200 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo Positioned at the Top */}
      <div ref={logoRef} className="h-10 w-10 flex gap-4 items-center mb-2 mr-12">
        <img src="https://cdn-icons-png.flaticon.com/512/9111/9111412.png" alt="" />
        <h1 className="flex font-bold whitespace-nowrap">GFY AI</h1>
      </div>

      {/* Login Card */}
      <div
        ref={formRef}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={(e) => Submit(e)}>
          {/* Number Field */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="number"
            >
              Number
            </label>
            <input
              ref={numberInputRef}
              onChange={(e) => {
                setNumber(e.target.value);
                setNumberError(""); // Clear error when user types
              }}
              value={number}
              type="text"
              id="number"
              className={`w-full px-5 py-3 mt-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                numberError ? "border-red-500" : ""
              }`}
              placeholder="Enter your number"
              required
            />
            {numberError && (
              <p className="text-red-500 text-sm mt-1 animate-fadeIn" ref={errorMessageRef}>
                {numberError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              ref={passwordInputRef}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(""); // Clear error when user types
              }}
              value={password}
              type={showPassword ? "text" : "password"}
              id="password"
              className={`w-full px-5 py-3 mt-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                passwordError ? "border-red-500" : ""
              }`}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-12 text-gray-600 hover:text-gray-800 transition duration-200"
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 animate-fadeIn" ref={errorMessageRef}>
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            ref={submitButtonRef}
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700 transition duration-200 focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;