"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Chrome, GraduationCap, Mail, Lock } from "lucide-react"
import axios from "axios"

export default function AdminLogin() {
    // useEffect(() => {
    //     if (pb.authStore.isValid) {
    //         router.push("/");
    //     }
    // });

    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const response = await axios.post("/api/v1/mentor/login", {
                email,
                password,
            })

            console.log("Login successful:", response.data)

            localStorage.setItem("access_token", response.data.access_token)
            localStorage.setItem("token_type", response.data.token_type)
            
            router.push("/admin")
        } catch (error) {
            console.error("Login failed:", error)
            if (axios.isAxiosError(error) && error.response) {
                setError(`Login failed: ${error.response.data?.message || "Invalid email or password"}`)
            } else {
                setError("Invalid email or password. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-orange-500 p-3 rounded-full">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
                </div>

                {/* Login Card */}
                <Card className="border-orange-200 shadow-lg">
                    <CardHeader className="bg-orange-50 text-center">
                        <CardTitle className="text-orange-800">Welcome Back</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">Sign in to access your mentoring record</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
                            )}

                            {/* Email/Password Form */}
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
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
