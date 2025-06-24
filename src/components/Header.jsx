import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div>
      <Link href={"/login"}>
        <button onClick={handleLogout}>Logout</button>
      </Link>
    </div>
  );
};

export default Header;
