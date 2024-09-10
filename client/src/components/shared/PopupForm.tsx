import { IPopupFormProps } from '@/types';
import React, { useState, useEffect } from 'react';

const PopupForm: React.FC<IPopupFormProps> = ({ inputData, title, showPopupForm, setShowPopupForm }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (showPopupForm) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [showPopupForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (value.length < 2) {
      setErrors((prev) => ({ ...prev, [name]: `${name} must be at least 2 characters long.` }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`fixed max-h-screen overflow-scroll z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 w-[90%] max-w-md p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isVisible
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <svg
        onClick={() => setShowPopupForm(!showPopupForm)}
        stroke="currentColor"
        fill="none"
        strokeWidth="0"
        viewBox="0 0 15 15"
        className="absolute top-3 right-3 cursor-pointer"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
          fill="currentColor"
        ></path>
      </svg>
      <h1 className="text-2xl font-bold mb-4 mt-2">{title ? title :  "Add Your Address"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4">
        {inputData.map((data, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label htmlFor={data.label} className="text-sm text-gray-800 font-medium">
              {data.name}
            </label>
            <input
              type={data.type}
              name={data.label}
              id={data.label}
              min={data.type === 'number' ? 10 : 1}
              value={formValues[data.label] || ''}
              onChange={handleChange}
              className="border p-2 rounded-xl bg-gray-100 outline-none focus:border-primary-600"
            />
            {errors[data.label] && (
              <p className="text-red-500 text-sm">{errors[data.label]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-gray-700 text-white w-full p-3 mt-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default PopupForm;