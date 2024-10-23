import React from "react";
import { toast } from "sonner";
import HeadSide from "./components/ReusableComponents/HeaderSidebar";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message || "An unexpected error occurred." };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    toast.error(`Error: ${error.message || "Something went wrong"}`);
  }

  render() {
    if (this.state.hasError) {
      // Customize the error screen
      return (
        <HeadSide 
            child={
                <div className="flex flex-col items-center justify-center h-screen text-center bg-red-200 text-red-900 p-4">
              <h1 className="text-3xl mb-2">Oops! Something went wrong.</h1>
              <p className="text-xl mb-2">{this.state.errorMessage}</p>
              <button
               className=" py-2.5 px-5 text-lg text-black bg-blue-400 cursor-pointer rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
            }
        /> 
      );
    }

    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary;
