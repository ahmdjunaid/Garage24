import React from 'react'
import { Wrench, Home, Settings, Calendar, FileText, MessageSquare, ChevronRight } from "lucide-react"
import whiteLogo from "../../assets/icons/logo-white.png"

const AdminSidebar = () => {
  return (
          <div className="w-60 bg-gradient-to-b from-gray-950 to-black flex flex-col border-r border-gray-800 shadow-2xl">
        {/* Logo */}
        <div className='mx-auto p-6'>
            <img className='w-58' src={whiteLogo} alt="" />
        </div>

        {/* Menu */}
        <div className="flex-1 px-4">
          <div className="text-xs text-gray-600 font-semibold mb-3 px-3 tracking-wider">MENU</div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 group">
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Overview</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 group">
              <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Services</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50 group">
              <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Mechanics</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 group">
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Appointments</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 group">
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Reports</span>
            </a>
          </nav>

          <div className="text-xs text-gray-600 font-semibold mb-3 px-3 mt-8 tracking-wider">OTHERS</div>
          
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 relative group">
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Messages</span>
            <span className="ml-auto bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-0.5 rounded-full shadow-lg animate-pulse">10</span>
          </a>
        </div>

        {/* Profile */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all duration-200 border border-gray-700 shadow-xl">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=KR" 
              alt="Profile" 
              className="w-10 h-10 rounded-full bg-gray-600 ring-2 ring-red-600"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">KR Garage</div>
              <div className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-red-400 transition-colors">
                View Profile <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AdminSidebar;