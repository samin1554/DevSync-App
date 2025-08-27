import React from "react";
import taskImg from "../images/task-management-workflow.png";

export default function Body() {
  return (
    <section id="hero" className="bg-base-100 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              Organize Your Life,
              <span className="inline-flex items-center px-3 py-1 rounded bg-accent text-base-100 ml-2">
                Achieve Your Goals
              </span>
            </h1>

            <p className="text-xl text-base-content mb-8 leading-relaxed">
              DevSync is crafted by me to empower anyone—no matter your field—to manage your life and schedules with ease and confidence. <br />
              Enjoy a beautifully simple, intuitive, and completely free tool designed to help you stay organized, stress less, and make every day more productive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#app-preview" aria-label="Watch Demo">
                <button className="btn btn-accent relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-base-content rounded-lg group group-hover:text-base-100 transition-transform transform hover:scale-105">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-base-100 rounded-md group-hover:bg-transparent">
                    ▶️ Watch Demo
                  </span>
                </button>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-neutral rounded-2xl shadow-md p-7 transform rotate-3 hover:rotate-0 transition-transform duration-200 max-w-md mx-auto">
              <div className="absolute inset-0 bg-base-300 rounded-2xl z-0"></div>
              <div className="relative z-10">
                <img
                  className="w-full h-auto rounded-lg shadow-md"
                  src={taskImg}
                  alt="App Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
