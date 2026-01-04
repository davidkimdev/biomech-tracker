export default function Navbar() {
  return (
    <nav className="w-full p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        {/* Simple Circle Logo */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
          <span className="font-bold text-white text-sm">B</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-wider">
          BIOMECH <span className="text-blue-500">OS</span>
        </h1>
      </div>
      
      <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition border border-gray-700">
        Demo Mode
      </button>
    </nav>
  )
}