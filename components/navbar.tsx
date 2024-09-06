import Link from 'next/link';

export const Navbar = () => {
  return (
    <header
      className="w-full fixed top-0 h-16"
      role="navigation"
      aria-label="main navigation"
    >
      <nav className="container flex flex-col gap-2 items-center">
        <Link href="/">Home</Link>
        <Link href="/people">People</Link>
      </nav>
    </header>
  );
};
