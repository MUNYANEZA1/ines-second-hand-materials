// src/components/forms/FeedbackForm.jsx
import React, { useState } from "react";
import reportService from "../../services/reportService";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const FeedbackForm = ({ onClose }) => {
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter your feedback");
      return;
    }

    try {
      setSubmitting(true);
      await reportService.submitFeedback({
        userId: user.id,
        type: feedbackType,
        message,
      });

      setSuccess(true);
      setError("");
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Feedback Submitted
        </h3>
        <p className="text-gray-600 mb-4">
          Thank you for your feedback! We appreciate your help in improving our
          platform.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Close
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Share Your Feedback
      </h2>

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["suggestion", "bug", "praise"].map((type) => (
              <motion.button
                key={type}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFeedbackType(type)}
                className={`py-2 px-3 rounded-md border ${
                  feedbackType === type
                    ? "bg-blue-100 border-blue-500 text-blue-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } capitalize transition-colors`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Feedback
          </label>
          <textarea
            id="feedback"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us how we can improve..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
