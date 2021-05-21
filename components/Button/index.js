import Link from 'next/link'

const Button = ({ children, type = 'submit' }) => {
  return (
    <button type={type} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {children}
    </button>
  )
}

const ButtonLink = ({ href, children }) => {
  return (
    <Link href={href} >
      <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{children}</a>
    </Link>
  )
}

const ButtonLinkOutline = ({ href, children }) => {
  return (
    <Link href={href} >
      <a className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">{children}</a>
    </Link>
  )
}

Button.Link = ButtonLink
Button.LinkOut = ButtonLinkOutline

export default Button