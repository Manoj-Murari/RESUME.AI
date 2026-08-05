import React from "react";
import { PersonalDetails } from "../../types/resume";

interface Props {
  personal: PersonalDetails;
  layout?: "centered" | "left" | "split";
  editable?: boolean;
  onUpdate?: (field: keyof PersonalDetails, value: string) => void;
}

export const Route = null; // helper placeholder

export const ResumeHeader: React.FC<Props> = ({
  personal,
  layout = "centered",
  editable = true,
  onUpdate,
}) => {
  const handleChange = (field: keyof PersonalDetails, val: string) => {
    if (onUpdate) onUpdate(field, val);
  };

  const contactLinks = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.website,
  ].filter(Boolean);

  if (!editable) {
    if (layout === "left") {
      return (
        <header className="mb-6 pb-4 border-b border-neutral-300">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 px-1">
            {personal.fullName}
          </h1>
          {personal.jobTitle && (
            <div className="text-sm font-semibold text-neutral-600 tracking-wide uppercase px-1 mt-0.5">
              {personal.jobTitle}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600">
            {contactLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-neutral-400">|</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        </header>
      );
    }

    return (
      <header className="text-center mb-6 border-b border-transparent">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 text-center px-1">
          {personal.fullName}
        </h1>
        {personal.jobTitle && (
          <div className="text-xs font-semibold text-neutral-500 tracking-widest uppercase text-center px-1 mt-1 block">
            {personal.jobTitle}
          </div>
        )}
        <div className="mt-2 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[11px] text-neutral-700">
          {contactLinks.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-neutral-400 font-normal">|</span>}
              <span className="hover:text-neutral-900 transition-colors">{item}</span>
            </React.Fragment>
          ))}
        </div>
      </header>
    );
  }

  if (layout === "left") {
    return (
      <header className="mb-6 pb-4 border-b border-neutral-300">
        <input
          type="text"
          value={personal.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          readOnly={!editable}
          className="text-3xl font-bold tracking-tight text-neutral-900 bg-transparent w-full focus:outline-none focus:bg-neutral-50 px-1"
        />
        {personal.jobTitle && (
          <input
            type="text"
            value={personal.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            readOnly={!editable}
            className="text-sm font-semibold text-neutral-600 tracking-wide uppercase bg-transparent w-full focus:outline-none focus:bg-neutral-50 px-1 mt-0.5"
          />
        )}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600 font-mono">
          {contactLinks.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-neutral-400">|</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      </header>
    );
  }

  return (
    <header className="text-center mb-6 border-b border-transparent">
      <input
        type="text"
        value={personal.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        readOnly={!editable}
        className="text-3xl font-extrabold tracking-tight text-neutral-900 bg-transparent text-center w-full focus:outline-none focus:bg-neutral-50 px-1"
      />
      {personal.jobTitle && (
        <input
          type="text"
          value={personal.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          readOnly={!editable}
          className="text-xs font-semibold text-neutral-500 tracking-widest uppercase bg-transparent text-center w-full focus:outline-none focus:bg-neutral-50 px-1 mt-1 block"
        />
      )}
      <div className="mt-2 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[11px] text-neutral-700 font-mono">
        {contactLinks.map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-neutral-400 font-normal">|</span>}
            <span className="hover:text-neutral-900 transition-colors">{item}</span>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};
