import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Refs for GSAP animations
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const numberInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const signupLinkRef = useRef(null);

  const Submit = async (e) => {
    e.preventDefault();
    const userData = {
      number: number,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
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
      // Error animation
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.1,
        ease: "power1.inOut",
      });
    }

    setNumber("");
    setPassword("");
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
      <img
        ref={logoRef}
        src="data:image/png;base64,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"
        alt="Company Logo"
        className=" h-auto max-w-56 rounded-lg  mb-6"
      />

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
              onChange={(e) => setNumber(e.target.value)}
              type="text"
              id="number"
              className="w-full px-5 py-3 mt-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your number"
              required
            />
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-5 py-3 mt-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
