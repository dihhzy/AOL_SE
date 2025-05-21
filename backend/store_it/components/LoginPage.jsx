import React from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/loginbg.css"; 
import { motion } from "framer-motion";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-green-500 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="bg-animation"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 bg-white p-10 rounded-xl shadow-xl w-full max-w-lg backdrop-blur-md"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Login
        </h2>
        <Form>
          <Form.Group className="mb-6" controlId="formBasicEmail">
            <Form.Label className="text-gray-700">Email Address</Form.Label>
            <Form.Control
              className="focus:ring-2 focus:ring-green-400"
              type="email"
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-6" controlId="formBasicPassword">
            <Form.Label className="text-gray-700">Password</Form.Label>
            <Form.Control
              className="focus:ring-2 focus:ring-green-400"
              type="password"
              placeholder="Enter password"
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-full py-3 rounded-full text-white font-semibold transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            Login
          </Button>
        </Form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
