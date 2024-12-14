export const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
}) => {
  return (
    <input
      className={`px-4 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600 w-full ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export const TextArea = ({
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
}) => {
  return (
    <textarea
      className={`px-4 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600 ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
