import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("tokenSupplier");
  const roleName = request.cookies.get("roleName");
  const { pathname } = request.nextUrl;

  if (!token || !roleName) {
    return NextResponse.redirect(new URL("/login_supplier?message=missingCredentials", request.url));
  }

  if (roleName.value === "supplier") {
    return NextResponse.next();
  }

  if (roleName.value === "supplierStaff") {
    const allowedPaths = [
      "/supplier",
      "/supplier/tour",
      "/supplier/roombooking",
      "/supplier/tourbooking",
      "/supplier/hotel",
    ];
    const dynamicPaths = [
      /^\/supplier\/hotel\/(comment|voucher|rate|room)\/\d+$/,
      /^\/supplier\/hotel\/room\/\d+\/(room3DImage|roomImage)\/\d+$/
    ];

    if (allowedPaths.includes(pathname) || dynamicPaths.some((regex) => regex.test(pathname))) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login_supplier?message=notAuthorized", request.url));
    }
  }

  return NextResponse.redirect(new URL("/login_supplier?message=notAuthorized", request.url));
  // return NextResponse.next();
}

export const config = {
  matcher: "/supplier/:path*",
};
