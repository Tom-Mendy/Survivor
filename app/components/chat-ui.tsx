"use client";

import { useState } from "react";
import { Menu, X, Send, Phone, Video } from "lucide-react";

export function ChatUi() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-full max-w-xs flex-shrink-0 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="p-4 border-b" style={{ height: "73px" }}>
          <h2 className="text-xl font-semibold">Conversations</h2>
        </div>
        <nav className="p-2">
          {["Alice", "Bob", "Charlie", "David", "Eve"].map((name, index) => (
            <button
              key={index}
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                className="h-10 w-10 rounded-full"
                src={`https://i.pravatar.cc/40?img=${index + 1}`}
                alt={name[0]}
              />
              <div className="ml-3 text-left">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-gray-500">Last message...</p>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src="https://i.pravatar.cc/40?img=1"
              alt="Alice"
            />
            <h1 className="ml-3 text-xl font-semibold">Alice</h1>
          </div>
          {/* <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
              <span className="sr-only">Call</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
              <span className="sr-only">Video call</span>
            </Button>
          </div> */}
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-end">
            <img
              className="h-8 w-8 rounded-full"
              src="https://i.pravatar.cc/40?img=1"
              alt="Alice"
            />
            <div className="ml-2 bg-gray-200 rounded-lg p-3 max-w-xs">
              <p className="text-sm">Hey, how are you doing?</p>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="mr-2 bg-blue-500 text-white rounded-lg p-3 max-w-xs">
              <p className="text-sm">I'm good, thanks! How about you?</p>
            </div>
          </div>
          {/* Add more messages here */}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <form className="flex space-x-2">
            <input
              type="text"
              className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
              placeholder="Type a message ..."
            />
            <button type="submit" className="bg-blue-500 rounded-md">
              <Send className="h-5 w-10" />
              <span className="sr-only">Send message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
