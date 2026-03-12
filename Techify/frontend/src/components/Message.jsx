const Message = ({ variant = "default", children }) => {
  const variantClasses = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <div className={`p-4 rounded ${variantClasses[variant] || variantClasses.default}`}>
      {children}
    </div>
  );
};

export default Message;