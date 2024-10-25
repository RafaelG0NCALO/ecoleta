export default function InputField({ label, id, error, ...props }) {
    return (
        <div className='flex flex-col-reverse mb-5 relative'>
           {error && 
          <p className="text-red-500 text-sm absolute right-0 top-0">
            {error}
          </p>}
          <input
            id={id}
            className={`h-14 border ${error ? 'border-red-400' : '' } text-[#322153] bg-[#F0F0F5] w-full px-4 rounded-lg mt-1 outline-[#25db77] peer `}
            {...props}
          />
          <label htmlFor={id} className={`${error ? 'text-red-600' : 'text-[#6C6C80]' } peer-focus:text-[#2f8556]`}>
            {label}
          </label>
        </div>
      );
}
