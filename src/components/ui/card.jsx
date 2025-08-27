import React from "react";

export function Card({ className = "", ...props }) {
  return (
    <div className={`card bg-base-100 border border-neutral rounded-xl shadow-md ${className}`} {...props} />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div className={`card-header flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight text-base-content ${className}`} {...props} />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div className={`card-body p-6 pt-0 ${className}`} {...props} />
  );
} 