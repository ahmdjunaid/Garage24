type InputType = {
    placeholder: string,
    type?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: string
}

const Input = ({placeholder, type='text', value, onChange, icon}: InputType) => {
  return (
        <div className="relative">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 pl-12 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <img 
              src={icon}
              alt="Email" 
              className="w-5 h-5 text-gray-400"
            />
          </div>
        </div>
  )
}

export default Input
