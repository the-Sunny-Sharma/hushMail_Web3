/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  addUsername,
  checkUsername,
  isUsernameUnique,
} from "@/actions/usernameActions";
import { debounce } from "lodash";

export default function UsernameSelectionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [usernameError, setUsernameError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserEmail(email as string);

    const checkIfUserHasUsername = async () => {
      if (email) {
        const response = await checkUsername(email);
        if (response.hasUsername) {
          router.push("/h");
        }
      }
    };

    checkIfUserHasUsername();
  }, [email, router]);

  const generateSuggestions = (baseUsername: string) => {
    const suggestions = [];
    for (let i = 1; i <= 3; i++) {
      suggestions.push(`${baseUsername}${i}`);
    }
    suggestions.push(`${baseUsername}_123`, `${baseUsername}_xyz`);
    return suggestions;
  };

  const debouncedCheckUsername = debounce(async (username: string) => {
    if (username.length >= 3) {
      const response = await isUsernameUnique(username);
      if (response.success) {
        if (!response.isUnique) {
          setUsernameError("Username is taken");
          setSuggestedUsernames(generateSuggestions(username));
        } else {
          setUsernameError("");
          setSuggestedUsernames([]);
        }
      }
    } else {
      setUsernameError("");
    }
  }, 500);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters long")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores are allowed"
      )
      .notOneOf(["admin", "root"], "This username is reserved")
      .test(
        "is-not-numeric",
        "Username cannot be only numbers",
        (value) => !/^\d+$/.test(value || "")
      )
      .required("Username is required"),
  });

  const handleSubmit = async (values: { username: string }) => {
    setIsSubmitting(true);

    try {
      const response = await addUsername(values.username, userEmail);

      if (response.error) {
        toast.error(response.message || "Failed to update username");
      } else {
        toast.success("Username updated successfully");
        setSuggestedUsernames([]); // Clear suggestions on success
        router.push("/h");
      }
    } catch (error) {
      console.error(`An error occurred while updating username: ${error}`);
      toast.error("An error occurred while updating username");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          HushMail
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Choose your username
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{ username: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1">
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Choose a unique username"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const { value } = e.target;
                        setFieldValue("username", value);
                        setUsernameError(""); // Reset username error
                        debouncedCheckUsername(value);
                      }}
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    {usernameError && (
                      <div className="text-red-500 text-sm mt-1">
                        {usernameError}
                      </div>
                    )}
                  </div>
                </div>

                {suggestedUsernames.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      The username is taken. Try one of these suggestions:
                    </p>
                    <ul className="list-disc list-inside text-gray-700">
                      {suggestedUsernames.map((suggestion, index) => (
                        <li
                          key={index}
                          className="cursor-pointer"
                          onClick={() => {
                            setFieldValue("username", suggestion);
                            setUsernameError(""); // Reset error on suggestion click
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? "Validating..." : "Set Username"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
