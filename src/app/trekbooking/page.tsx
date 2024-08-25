'use client'
import { useRouter, useSearchParams } from "next/navigation";
import Homepage from "../components/Homepage";
import { Suspense, useEffect } from "react";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner"; // Import spinner
 function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "notAuthorized") {
      toast.error("You are not authorized to access the supplier area.");
    }
  }, [searchParams]);
  return (
    <div>
      <Homepage></Homepage>
    </div>
  );
}

export default function WrappedHome() {
  return (
    <Suspense fallback={
    <div className="flex justify-center pt-10 pb-10">
  <Oval
          height={80}
          width={80}
          color="#305A61"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4f9a94"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
    </div>
  }>
      <Home />
      </Suspense>
  );
}