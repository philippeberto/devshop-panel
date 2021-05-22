const Select = ({ name = '', placeholder = '', onChange = '', value = '', options = [] }) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full px-3">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={name}>
          {placeholder}
        </label>
        <select id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          {options.map(option => {
            return (<option key={option.id} value={option.id}>{option.label}</option>)
          })}
        </select>
      </div>
    </div>
  )
}

export default Select