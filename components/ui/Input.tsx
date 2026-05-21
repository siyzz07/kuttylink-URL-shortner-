import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  rightElement?: React.ReactNode; // New prop for things like the eye icon
}

export const Input = ({ label, error, touched, rightElement, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-bold text-slate-700 tracking-tight ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          {...props}
          className={`w-full px-5 py-3.5 bg-white border-2 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-8 transition-all font-medium ${
            touched && error
              ? "border-red-100 focus:border-red-500 focus:ring-red-500/10"
              : "border-slate-100 group-hover:border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/10"
          } ${rightElement ? "pr-14" : ""}`} // Add padding if there is a right element
        />
        
        {/* The Right Element Container (Perfectly Centered) */}
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}

        {/* Error Icon (Only if no right element, to avoid overlapping) */}
        {!rightElement && touched && error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in duration-300 pointer-events-none">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {touched && error && (
        <p className="text-xs font-bold text-red-500 mt-1 ml-2 animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};
