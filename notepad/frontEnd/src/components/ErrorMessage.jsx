import React, { useState, useEffect } from "react";

const ErrorMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the error after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Clear timeout if the component unmounts
  }, [onClose]);

  return (
    <div className="error-message bg-red-500 text-white rounded-md p-4 flex items-center justify-between shadow-lg">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white font-bold ml-4 hover:text-gray-200 focus:outline-none"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorMessage;

// const App = () => {
//   const [error, setError] = useState("");

//   const showError = () => {
//     if (!error) {
//       setError("This is an error message!");
//     }
//   };

//   const handleClose = () => {
//     setError(""); // Dismiss the error
//   };

//   return (
//     <div className="app p-6">
//       <button
//         onClick={showError}
//         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
//       >
//         Trigger Error
//       </button>

//       {error && (
//         <ErrorMessage message={error} onClose={handleClose} />
//       )}
//     </div>
//   );
// };

// export default App;
