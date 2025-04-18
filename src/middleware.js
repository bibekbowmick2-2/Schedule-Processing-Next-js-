import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
  const token = await getToken({ req });

  const path = req.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/panel");
  const isEmployeeRoute = path.startsWith("/employeepanel");

  // If no token at all (unauthenticated), redirect to login
 
  const role =await token?.role;
  console.log(role);
  

  // Only redirect if user has token but wrong role
  if (isAdminRoute && role && role !== "admin") {
    const callbackUrl = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  if (isEmployeeRoute && role && role !== "employee") {
    const callbackUrl = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  return NextResponse.next();
};
