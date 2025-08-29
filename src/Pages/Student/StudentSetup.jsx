import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../../utils/httpsMethod";
import logo from '../../assets/image.png'; 

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
});

export default function StudentSetup() {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // ✅ Call backend with our common method
        const res = await apiRequest("POST", "join", {
          name: values.name,
        });

        // Store student in localStorage
        localStorage.setItem("studentName", res.name || values.name);
        localStorage.setItem("Std_id",res._id)
        // Redirect to student pool
        window.location.href = "/student-pool";
      } catch (err) {
        console.error("Student join error:", err);
        setErrors({ name: "Failed to join. Try again." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
  <img
    src={logo}
    alt="Intervue Poll Logo"
    className="w-36 h-auto object-contain"
  />
</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Get Started</h1>
          <p className="text-gray-600">
            If you're a student, you'll be able to{" "}
            <span className="font-medium">submit your answers</span>, participate
            in live polls, and see how your responses compare with your classmates.
          </p>
        </div>

        {/* Name Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Rahul Bajaj"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 focus:outline-none ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || !formik.values.name}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
