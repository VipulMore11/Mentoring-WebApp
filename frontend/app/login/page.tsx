"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Chrome, GraduationCap, Settings } from "lucide-react"
import pb from "../../lib/pb"
import { useEffect } from "react"
import initData from '../../Initdata'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export default function LoginPage() {

  const handleAdmin = () => {
    router.push("/adminLogin")
  }

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // const handleGoogleLogin = async () => {
  //   try {
  //     const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
  //     console.log(pb.authStore.isValid);
  //     console.log(pb.authStore.token);
  //     console.log(authData)
  //     if (pb.authStore.isValid) {
  //       const id: string = pb.authStore.record?.id ? pb.authStore.record?.id : ""
  //       localStorage.setItem("pb_auth_id", id);
  //       if (pb.authStore?.record?.mentorForm == null) {
  //         initData.personalInfo.atharvaEmail = authData.record.email
  //         initData.personalInfo.name = authData.record.name
  //         await pb.collection("users").update(id, { mentorForm: initData })
  //       }
  //       setIsLoading(true)
  //       router.push("/")
  //     }
  //   } catch (error: any) {
  //     console.error("Login failed:", error)
  //     if (error.status === 400) {
  //       toast.error("Please use Atharva E-mail Id to login.")
  //     }
  //   }
  // }

  const handleGoogleLogin = async () => {
    try {
      const popup = window.open(
        'http://127.0.0.1:8000/api/auth/login',
        'googleLogin',
        'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
      )
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== 'http://127.0.0.1:8000') {
          return
        }

        if (event.data.type === 'AUTH_SUCCESS') {
          console.log("Authentication successful!")
          console.log("Auth success data:", event.data)
          localStorage.setItem("access_token", event.data.access_token)
          if (popup) {
            alert("Login Successful")
            popup.close()
          }
          window.removeEventListener('message', messageListener)
          setIsLoading(true)
          router.push("/")
        } else if (event.data.type === 'AUTH_ERROR') {
          console.log("Authentication failed:", event.data.error)
          console.log("Auth error data:", event.data)
          if (popup) {
            popup.close()
          }
          window.removeEventListener('message', messageListener)
          toast.error("Authentication failed. Please try again.")
        }
      }
      window.addEventListener('message', messageListener)
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          console.log("Popup was closed")
        }
      }, 1000)

    } catch (error) {
      console.log("Login failed:", error)
      toast.error("Failed to open login window. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Mentoring System</h1>
          <p className="text-gray-600">Department of Computer Engineering</p>
        </div>

        {/* Login Card */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-orange-50 text-center">
            <CardTitle className="text-orange-800">Welcome Back</CardTitle>
            <p className="text-sm text-gray-600 mt-2">Sign in to access your mentoring record</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Chrome className="w-5 h-5 text-blue-500" />
                    Continue with Google
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
              <Button
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm" size="lg">
                <div onClick={handleAdmin} className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Admin Login
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Need help? Contact your mentor or system administrator</p>
        </div>
      </div>
    </div>
  )
}
