import Link from 'next/link';


function Logo() {
  return (
    <Link href="/" className="hover:text-indigo-400 font-bold text-lg text-indigo-600 flex items-center gap-2">
        {/* Logo Design: Abstract Quill  */}
        <span className='font-pacifico text-3xl font-normal'>Carta</span>
        <div className="h-10 w-10 bg-indigo-600 rounded-tr-lg rounded-bl-lg flex items-center justify-center">
            <span className="text-white text-lg">AI</span>
        </div>
    </Link>
  )
}

export default Logo