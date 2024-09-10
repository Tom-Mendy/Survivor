"use client";

import { MouseEventHandler, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  PopoverGroup,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import Navigation from "@/app/components/Navigation";
import { logout } from "@/app/auth/auth";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  language:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/320px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png",
};

const userNavigation: {
  name: string;
  href: string;
  click: MouseEventHandler<HTMLButtonElement> | undefined;
}[] = [
  { name: "Your Profile", href: "profil", click: undefined },
  { name: "Settings", href: "#", click: undefined },
  {
    name: "Sign out",
    href: "#",
    click: async () => {
      await logout();
    },
  },
];

export default function AdminNavBar({
  UserRole,
}: {
  readonly UserRole: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // <header className="bg-white sticky top-0">
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 text-2xl">
            <h1 className="font-bold">Soul Connection</h1>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <div className="ml-10 flex items-baseline gap-6">
            <Navigation mobileMenuOpen={mobileMenuOpen} UserRole={UserRole}/>
          </div>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3">
          {/* NOTIFICATIONS */}
          <a href="chat" className="h-8 w-8">
            <ChatBubbleLeftEllipsisIcon />
          </a>
          {/* LANGUAGE */}
          <img alt="" src={user.language} className="h-8 w-8 rounded-full" />
          {/* PROFILE */}
          <Menu as="div" className="relative">
            <div>
              <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src={user.imageUrl}
                  className="h-8 w-8 rounded-full"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  <a
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                  >
                    <button onClick={item.click}>{item.name}</button>
                  </a>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </nav>
      {/* MOBILE */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              Soul Connection
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Navigation mobileMenuOpen={mobileMenuOpen} UserRole={UserRole}/>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
                <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        alt=""
                        src={user.imageUrl}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium leading-none">
                        {user.email}
                      </div>
                    </div>
                    {/* LANGUAGE */}
                    <div className="ml-auto flex gap-3">
                      <img
                        alt=""
                        src={user.language}
                        className="h-8 w-8 rounded-full"
                      />
                      <a href="chat" className="h-8 w-8">
                        <ChatBubbleLeftEllipsisIcon />
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}