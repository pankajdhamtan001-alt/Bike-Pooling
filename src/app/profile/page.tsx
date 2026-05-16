"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <main className="container py-20">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container py-20">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 border-b pb-4">Profile</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-32 h-32 rounded-full border-4 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 text-4xl" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                  <span className="text-gray-500">Name</span>
                </div>
                <p className="text-xl font-medium">{session?.user?.name || "N/A"}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
                  <span className="text-gray-500">Email</span>
                </div>
                <p className="text-xl">{session?.user?.email || "N/A"}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                  <span className="text-gray-500">Account Type</span>
                </div>
                <p className="text-xl">
                  {session?.user?.email?.includes("gmail") ? "Google Account" : "Email & Password"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="btn btn-outline py-3">Edit Profile</button>
              <button className="btn btn-outline py-3">Change Password</button>
              <button className="btn btn-outline py-3">Privacy Settings</button>
              <button className="btn btn-outline py-3">Notification Settings</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 