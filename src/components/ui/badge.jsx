import React from "react";

export function Badge({ 
  variant = "default", 
  className = "", 
  ...props 
}) {
  const baseClasses = "badge inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "badge-primary",
    secondary: "badge-secondary",
    outline: "badge-outline",
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`;
  
  return (
    <div className={classes} {...props} />
  );
} 