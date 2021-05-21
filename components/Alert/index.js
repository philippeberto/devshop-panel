const Alert = ({ title = '', children }) => {
  return (
    <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-700 p-4 w-auto" role="alert">
      <p className="font-bold">{title}</p>
      <p>{children}</p>
    </div>

  )
}

export default Alert