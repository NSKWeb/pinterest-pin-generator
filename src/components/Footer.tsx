"use client";

import React from "react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <a className="transition hover:text-white" href="#">
            About
          </a>
          <a className="transition hover:text-white" href="#">
            Privacy
          </a>
          <a className="transition hover:text-white" href="#">
            Terms
          </a>
        </div>
        <p>© {new Date().getFullYear()} PinSpark. All rights reserved.</p>
      </div>
    </footer>
  );
};
