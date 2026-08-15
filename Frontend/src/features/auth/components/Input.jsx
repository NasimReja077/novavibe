import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      name,
      value,
      onChange,
      placeholder,
      autoComplete,
      error,
      variant = "blue",
      className = "",
      ...props
    },
    ref,
  ) => {
    const variants = {
      blue: {
        label: "text-[#5a7ab0]",
        input:
          "bg-[rgba(4,8,20,0.92)] border-[rgba(61,139,255,0.16)] text-[#dde8ff] placeholder:text-[#1e3356] hover:border-[rgba(61,139,255,0.32)] focus:border-[#3d8bff] focus:bg-[rgba(8,16,36,0.95)] focus:shadow-[0_0_0_3px_rgba(61,139,255,0.12),0_0_20px_rgba(61,139,255,0.08)]",
      },
      green: {
        label: "text-[#5f9070]",
        input:
          "bg-[rgba(4,11,6,0.92)] border-[rgba(29,185,84,0.16)] text-[#dff0e6] placeholder:text-[#274535] hover:border-[rgba(29,185,84,0.33)] focus:border-[#1db954] focus:bg-[rgba(9,24,13,0.95)] focus:shadow-[0_0_0_3px_rgba(29,185,84,0.12),0_0_18px_rgba(29,185,84,0.08)]",
      },
    };

    const selectedVariant = variants[variant] || variants.blue;

    const handleFileChange = (event) => {
      if (type !== "file") return onChange?.(event);

      const file = event.target.files?.[0];
      if (onChange) onChange(event);

      return file?.name;
    };

    const fileName = type === "file" && typeof value === "string" ? value : "";

    // Only pass `value` down when the caller explicitly controls it (e.g. file
    // name display). When it's left undefined — as with react-hook-form's
    // ref-based `register()` — the <input> stays uncontrolled, so typing works.
    const controlledValueProps =
      type !== "file" && value !== undefined ? { value } : {};

    return (
      <div className="flex flex-col gap-1.25">
        {label && (
          <label
            htmlFor={id}
            className={`text-[11px] font-medium tracking-[0.08em] uppercase ${selectedVariant.label}`}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          name={name}
          {...controlledValueProps}
          onChange={handleFileChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          {...props}
          className={`w-full px-3.75 py-2.75 border rounded-[10px] font-['Outfit'] text-[13.5px] outline-none transition-[border-color,box-shadow,background] duration-200 placeholder:text-[12.5px] ${selectedVariant.input} ${className}`}
        />

        {type === "file" && fileName && (
          <p className="text-[11px] text-[#b9c7de]">Selected file: {fileName}</p>
        )}

        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;