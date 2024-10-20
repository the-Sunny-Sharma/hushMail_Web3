"use client";

import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { debounce } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface ProfileSettingsProps {
  userData: {
    name: string;
    username: string;
    email: string;
    profilePicture: string;
  };
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  updateSession: () => Promise<void>;
}

export function ProfileSettings({
  userData,
  setUserData,
  updateSession,
}: ProfileSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
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
      try {
        const response = await axios.post("/api/check-username", { username });
        if (!response.data.isUnique) {
          setUsernameError("Username is taken");
          setSuggestedUsernames(generateSuggestions(username));
        } else {
          setUsernameError("");
          setSuggestedUsernames([]);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameError("Error checking username availability");
      }
    } else {
      setUsernameError("");
    }
  }, 500);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPicture = async () => {
    if (!previewImage) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", dataURItoBlob(previewImage));

    try {
      const uploadResponse = await axios.post(
        "/api/upload-profile-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (uploadResponse.status === 200 && uploadResponse.data.imageUrl) {
        const imageUrl = uploadResponse.data.imageUrl;

        const updateResponse = await axios.post("/api/update-avatar", {
          email: userData.email,
          avatarUrl: imageUrl,
        });

        if (updateResponse.status === 200 && updateResponse.data.success) {
          setUserData((prev: any) => ({
            ...prev,
            profilePicture: imageUrl,
          }));
          await updateSession();
          setPreviewImage(null);
          toast.success("Profile picture updated successfully");
        } else {
          toast.error("Failed to update profile picture in the database");
        }
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("An error occurred while updating profile picture");
    }
    setIsUploading(false);
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleSubmit = async (values: { name: string; username: string }) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/update-profile", {
        name: values.name,
        username: values.username,
        profilePicture: userData.profilePicture,
        email: userData.email,
      });

      if (response.status === 200) {
        await updateSession();
        toast.success("Profile updated successfully");
        setSuggestedUsernames([]);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-[#1e2837]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar
            className="w-24 h-24 cursor-pointer"
            onClick={handleProfilePictureClick}
          >
            <AvatarImage
              src={userData.profilePicture || "/placeholder-user.jpg"}
              alt={userData.name}
            />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleProfilePictureChange}
            accept="image/*"
          />
          {previewImage && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="cursor-pointer dark:bg-[#2c3e50] text-gray-900 dark:text-white"
                onClick={() => setPreviewImage(null)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer dark:bg-[#2c3e50] text-gray-900 dark:text-white"
                onClick={handleUploadPicture}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </>
                )}
              </Button>
            </div>
          )}
          {!previewImage && (
            <Button
              variant="outline"
              className="cursor-pointer dark:bg-[#2c3e50] text-gray-900 dark:text-white"
              onClick={handleProfilePictureClick}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change Picture
            </Button>
          )}
        </div>
        <Formik
          initialValues={{
            name: userData.name,
            username: userData.username,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Username
                </Label>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  placeholder="Your username"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    setFieldValue("username", value);
                    setUsernameError("");
                    debouncedCheckUsername(value);
                  }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
                {usernameError && (
                  <div className="text-red-500 text-sm">{usernameError}</div>
                )}
              </div>
              {suggestedUsernames.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    The username is taken. Try one of these suggestions:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2">
                    {suggestedUsernames.map((suggestion, index) => (
                      <li
                        key={index}
                        className="cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => {
                          setFieldValue("username", suggestion);
                          setUsernameError("");
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e] opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
