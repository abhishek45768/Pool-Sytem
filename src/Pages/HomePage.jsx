
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from '../assets/image.png'; 
function Button({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={`px-8 py-3 rounded-lg font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

// Simple replacement for shadcn Card
function Card({ children, className, ...props }) {
  return (
    <div
      {...props}
      className={`rounded-xl border bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

function CardContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()

  const handleContinue = () => {
    if (selectedRole === "student") {
      navigate("/student-setup")
    } else if (selectedRole === "teacher") {
      navigate("/teacher-dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
       <div className="flex justify-center mb-6">
  <img
    src={logo}
    alt="Intervue Poll Logo"
    className="w-36 h-auto object-contain"
  />
</div>


          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to the <span className="text-purple-600">Live Polling System</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Student Card */}
          <Card
            onClick={() => setSelectedRole("student")}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === "student" ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"
            }`}
          >
            <CardContent>
              <div className="flex items-start gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === "student" ? "border-purple-500 bg-purple-500" : "border-gray-300"
                  }`}
                >
                  {selectedRole === "student" && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">I'm a Student</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Lorem ipsum is simply dummy text of the printing and typesetting industry
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Card */}
          <Card
            onClick={() => setSelectedRole("teacher")}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === "teacher" ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"
            }`}
          >
            <CardContent>
              <div className="flex items-start gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === "teacher" ? "border-purple-500 bg-purple-500" : "border-gray-300"
                  }`}
                >
                  {selectedRole === "teacher" && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">I'm a Teacher</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Submit answers and view live poll results in real-time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
