import { InputHTMLAttributes, useState } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  type?: "phone";
}

export default function CustomInput({
  inputValue,
  setInputValue,
  label,
  type,
  ...rest
}: IInput) {
  return (
    <>
      <label className="block font-semibold leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        {type === "phone" ? (
          <PhoneInput
            enableSearch
            inputStyle={{ width: "100%" }}
            //dropdownStyle={{ width: 200 }}
            buttonStyle={{ borderRadius: "6px 0 0 6px" }}
            country={"it"}
            value={inputValue}
            onChange={(value, data: CountryData) => {
              setInputValue(value);
            }}
          />
        ) : (
          <input
            {...rest}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            type="text"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
        )}
      </div>
    </>
  );
}
