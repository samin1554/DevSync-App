import React from "react";

export function Button({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  ...props 
}) {
  const baseClasses = "btn inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "btn-primary",
    outline: "btn-outline",
    ghost: "btn-ghost",
    secondary: "btn-secondary",
  };
  
  const sizes = {
    default: "",
    sm: "btn-sm",
    lg: "btn-lg",
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
} 