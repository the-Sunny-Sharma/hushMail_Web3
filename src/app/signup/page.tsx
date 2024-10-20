import { auth } from "@/auth";
import { SignUpForm } from "@/components/client/SignupForm";
import { redirect } from "next/navigation";
import React from "react";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          HushMail
        </h1>
        <h2 className="mt-6 text-center text-xl sm:text-2xl font-bold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"> */}
        <SignUpForm />
        {/* </div> */}
      </div>
    </div>
  );
}
