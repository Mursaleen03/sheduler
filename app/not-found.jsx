'use client';
import { ArrowLeft, Home, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-blue-50 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 md:w-24 md:h-24 text-blue-500 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mt-8 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for seems to have wandered off. 
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-20">
          <div className="h-2 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="h-2 bg-blue-300 rounded-full animate-pulse delay-75"></div>
          <div className="h-2 bg-blue-200 rounded-full animate-pulse delay-150"></div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-blue-100">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
              Home
            </Link>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 hover:underline">
              Dashboard
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
              Contact
            </Link>
            <Link href="/help" className="text-blue-600 hover:text-blue-700 hover:underline">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
