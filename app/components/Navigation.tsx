import { usePathname, redirect } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation({
  mobileMenuOpen,
  UserRole,
}: {
  readonly mobileMenuOpen: boolean;
  readonly UserRole: string;
}) {
  const pathname = usePathname();
  let navigation = [];

  if (UserRole === "admin") {
    navigation = [
      {
        name: "Dashboard",
        href: "/dashboard",
        current: "/dashboard" === pathname,
      },
      { name: "Coaches", href: "/coaches", current: "/coaches" === pathname },
      {
        name: "Customers",
        href: "/customers",
        current: "/customers" === pathname,
      },
      { name: "Tips", href: "/tips", current: "/tips" === pathname },
      { name: "Events", href: "/events", current: "/events" === pathname },
      { name: "Clothes", href: "/clothes", current: "/clothes" === pathname },
      {
        name: "Compatibility",
        href: "/compatibility",
        current: "/compatibility" === pathname,
      },
    ];
  } else if (UserRole === "customer") {
    navigation = [
      {
        name: "Dashboard",
        href: "/dashboard",
        current: "/dashboard" === pathname,
      },

      { name: "Tips", href: "/tips", current: "/tips" === pathname },
      { name: "Events", href: "/events", current: "/events" === pathname },
      {
        name: "Compatibility",
        href: "/compatibility",
        current: "/compatibility" === pathname,
      },
    ];
  } else if (UserRole === "coach") {
    navigation = [
      {
        name: "Dashboard",
        href: "/dashboard",
        current: "/dashboard" === pathname,
      },
      {
        name: "Customers",
        href: "/customers",
        current: "/customers" === pathname,
      },
      { name: "Tips", href: "/tips", current: "/tips" === pathname },
      { name: "Events", href: "/events", current: "/events" === pathname },
      { name: "Clothes", href: "/clothes", current: "/clothes" === pathname },
      {
        name: "Compatibility",
        href: "/compatibility",
        current: "/compatibility" === pathname,
      },
    ];
  } else {
    redirect("/login");
  }

  if (mobileMenuOpen) {
    // mobile
    return (
      <>
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
          >
            {item.name}
          </a>
        ))}
      </>
    );
  } else {
    // computer
    return (
      <>
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={classNames(
              item.current && "text-[#1267c5]",
              "text-sm font-bold"
            )}
          >
            {item.name}
          </a>
        ))}
      </>
    );
  }
}
