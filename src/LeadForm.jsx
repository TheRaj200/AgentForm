import React, { useEffect, useState } from "react";
import axios from "axios";

const LeadForm = () => {
  const WEBHOOK_URL = "https://raj0005.app.n8n.cloud/webhook-test/website-leads" || "";

  const [formData, setFormData] = useState({
    ID: "",
    Name: "",
    Phone: "",
    Service: "",
    City: "",
    Source: "",
    Status: "",
    "Preferred Date": "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Helper to generate a unique ID (hidden from user)
  const generateId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback: time-based + random
    return (
      "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
    );
  };

  // Initialize hidden fields: ID, Source, Status
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ID: generateId(),
      Source: "website",
      Status: "new",
    }));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!WEBHOOK_URL) {
      alert(
        "Webhook URL is not configured. Please set VITE_WEBHOOK_URL in your environment (e.g., .env file)."
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post(WEBHOOK_URL, formData);
      setSuccess(true);
      // Reset visible fields, and re-seed hidden values
      setFormData({
        ID: generateId(),
        Name: "",
        Phone: "",
        Service: "",
        City: "",
        Source: "website",
        Status: "new",
        "Preferred Date": "",
        email: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error: Unable to submit data!");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 border border-indigo-50"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-indigo-700">
            Lead Capture
          </h2>
          <p className="text-gray-500 mt-1">Fill in your details and we'll get back to you shortly.</p>
        </div>

        {/* Visible fields only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="Name"
              placeholder="John Doe"
              value={formData.Name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="Phone"
              inputMode="tel"
              pattern="^[0-9+()\- ]{7,15}$"
              placeholder="+91 98765 43210"
              value={formData.Phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Service</label>
            <select
              name="Service"
              value={formData.Service}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              <option value="Consultation">Consultation</option>
              <option value="Installation">Installation</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">City</label>
            <input
              type="text"
              name="City"
              placeholder="Mumbai"
              value={formData.City}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Preferred Date</label>
            <input
              type="date"
              name="Preferred Date"
              value={formData["Preferred Date"]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
              required
            />
          </div>
        </div>

        {/* Hidden (not shown) fields: ID, Source, Status are kept in state */}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {success && (
          <p className="text-green-600 text-center mt-4" aria-live="polite">
            ✅ Data submitted successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default LeadForm;
