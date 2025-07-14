"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Edit, Save, X, Camera, LogOut, User } from "lucide-react"
import PersonalInfoTab from "@/components/personal-info-tab"
import MarksTab from "@/components/marks-tab"
import AchievementsTab from "@/components/achievements-tab"
import MentorsTab from "@/components/mentors-tab"
import CounselingTab from "@/components/counseling-tab"
import { generatePDF } from "@/lib/pdf-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"

export interface StudentData {
  personalInfo: {
    name: string
    enrollmentNo: string
    dateOfBirth: string
    bloodGroup: string
    aadharNo: string
    personalEmail: string
    atharvaEmail: string
    mobileNo: string
    fatherName: string
    fatherOccupation: string
    fatherMobile: string
    motherName: string
    motherOccupation: string
    motherMobile: string
    localAddress: string
    permanentAddress: string
    ssc: string
    hsc: string
    diploma: string
    nssMember: boolean
    emberMember: boolean
    rhythmMember: boolean
    sport: string
    other: string
    photo: string
  }
  marks: Array<{
    semester: string
    marks: string
    noOfKT: string
    ktSubject: string
  }>
  achievements: {
    firstYear: string
    secondYear: string
    thirdYear: string
    finalYear: string
  }
  mentors: Array<{
    semester: string
    mentorName: string
  }>
  counseling: Array<{
    srNo: number
    topic: string
    date: string
    actionTaken: string
    remark: string
    sign: string
  }>
}

const initialData: StudentData = {
  personalInfo: {
    name: "",
    enrollmentNo: "",
    dateOfBirth: "",
    bloodGroup: "",
    aadharNo: "",
    personalEmail: "",
    atharvaEmail: "",
    mobileNo: "",
    fatherName: "",
    fatherOccupation: "",
    fatherMobile: "",
    motherName: "",
    motherOccupation: "",
    motherMobile: "",
    localAddress: "",
    permanentAddress: "",
    ssc: "",
    hsc: "",
    diploma: "",
    nssMember: false,
    emberMember: false,
    rhythmMember: false,
    sport: "",
    other: "",
    photo: "",
  },
  marks: Array.from({ length: 8 }, (_, i) => ({
    semester: `sem${i + 1}`,
    marks: "",
    noOfKT: "",
    ktSubject: "",
  })),
  achievements: {
    firstYear: "",
    secondYear: "",
    thirdYear: "",
    finalYear: "",
  },
  mentors: Array.from({ length: 8 }, (_, i) => ({
    semester: `sem${i + 1}`,
    mentorName: "",
  })),
  counseling: Array.from({ length: 20 }, (_, i) => ({
    srNo: i + 1,
    topic: "",
    date: "",
    actionTaken: "",
    remark: "",
    sign: "",
  })),
}

// Helper function to safely get string values
const safeString = (value: any): string => {
  if (value === null || value === undefined) return ""
  return String(value)
}

// Helper function to safely get boolean values
const safeBoolean = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === "boolean") return value
  if (typeof value === "string") return value.toLowerCase() === "true"
  return Boolean(value)
}

// Helper function to safely get number values
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

// Helper function to safely process student data from backend
const processStudentData = (backendData: any): StudentData => {
  if (!backendData || typeof backendData !== "object") {
    return initialData
  }

  const personalInfo = backendData.personal_info || {}
  const marks = Array.isArray(backendData.marks) ? backendData.marks : []
  const achievements = backendData.achievements || {}
  const mentors = Array.isArray(backendData.mentors) ? backendData.mentors : []
  const counseling = Array.isArray(backendData.counseling) ? backendData.counseling : []

  return {
    personalInfo: {
      name: safeString(personalInfo.name),
      enrollmentNo: safeString(personalInfo.enrollment_no),
      dateOfBirth: safeString(personalInfo.date_of_birth),
      bloodGroup: safeString(personalInfo.blood_group),
      aadharNo: safeString(personalInfo.aadhar_no),
      personalEmail: safeString(personalInfo.personal_email),
      atharvaEmail: safeString(personalInfo.atharva_email),
      mobileNo: safeString(personalInfo.mobile_no),
      fatherName: safeString(personalInfo.father_name),
      fatherOccupation: safeString(personalInfo.father_occupation),
      fatherMobile: safeString(personalInfo.father_mobile),
      motherName: safeString(personalInfo.mother_name),
      motherOccupation: safeString(personalInfo.mother_occupation),
      motherMobile: safeString(personalInfo.mother_mobile),
      localAddress: safeString(personalInfo.local_address),
      permanentAddress: safeString(personalInfo.permanent_address),
      ssc: safeString(personalInfo.ssc),
      hsc: safeString(personalInfo.hsc),
      diploma: safeString(personalInfo.diploma),
      nssMember: safeBoolean(personalInfo.nss_member),
      emberMember: safeBoolean(personalInfo.ember_member),
      rhythmMember: safeBoolean(personalInfo.rhythm_member),
      sport: safeString(personalInfo.sport),
      other: safeString(personalInfo.other),
      photo: safeString(personalInfo.photo),
    },
    marks: Array.from({ length: 8 }, (_, i) => {
      const mark = marks[i] || {}
      return {
        semester: safeString(mark.semester) || `SEM ${i + 1}`,
        marks: safeString(mark.marks),
        noOfKT: safeString(mark.no_of_kt),
        ktSubject: safeString(mark.kt_subject),
      }
    }),
    achievements: {
      firstYear: safeString(achievements.first_year),
      secondYear: safeString(achievements.second_year),
      thirdYear: safeString(achievements.third_year),
      finalYear: safeString(achievements.final_year),
    },
    mentors: Array.from({ length: 8 }, (_, i) => {
      const mentor = mentors[i] || {}
      return {
        semester: safeString(mentor.semester) || `SEM-${i + 1}`,
        mentorName: safeString(mentor.mentor_name),
      }
    }),
    counseling: Array.from({ length: 20 }, (_, i) => {
      const record = counseling[i] || {}
      return {
        srNo: safeNumber(record.sr_no) || i + 1,
        topic: safeString(record.topic),
        date: safeString(record.date),
        actionTaken: safeString(record.action_taken),
        remark: safeString(record.remark),
        sign: safeString(record.sign),
      }
    }),
  }
}

export default function StudentMentoringSystem() {
  const [studentData, setStudentData] = useState<StudentData>(initialData)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/student/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        })
        console.log("Fetched student data from backend:", res.data)
        setStudentData(processStudentData(res.data))
      } catch (error) {
        console.log("Error fetching student data from backend:", error)
      }
    }
    getData()
  }, [])

  const handleSaveData = async () => {
    try {
      // Transform frontend data to backend format
      const backendData = {
        personal_info: {
          name: studentData.personalInfo.name,
          enrollment_no: studentData.personalInfo.enrollmentNo,
          date_of_birth: studentData.personalInfo.dateOfBirth,
          blood_group: studentData.personalInfo.bloodGroup,
          aadhar_no: studentData.personalInfo.aadharNo,
          personal_email: studentData.personalInfo.personalEmail,
          atharva_email: studentData.personalInfo.atharvaEmail,
          mobile_no: studentData.personalInfo.mobileNo,
          father_name: studentData.personalInfo.fatherName,
          father_occupation: studentData.personalInfo.fatherOccupation,
          father_mobile: studentData.personalInfo.fatherMobile,
          mother_name: studentData.personalInfo.motherName,
          mother_occupation: studentData.personalInfo.motherOccupation,
          mother_mobile: studentData.personalInfo.motherMobile,
          local_address: studentData.personalInfo.localAddress,
          permanent_address: studentData.personalInfo.permanentAddress,
          ssc: studentData.personalInfo.ssc,
          hsc: studentData.personalInfo.hsc,
          diploma: studentData.personalInfo.diploma,
          nss_member: studentData.personalInfo.nssMember,
          ember_member: studentData.personalInfo.emberMember,
          rhythm_member: studentData.personalInfo.rhythmMember,
          sport: studentData.personalInfo.sport,
          other: studentData.personalInfo.other,
          photo: studentData.personalInfo.photo,
        },
        marks: studentData.marks.map((mark, index) => ({
          semester: `sem${index + 1}`,
          marks: mark.marks,
          no_of_kt: mark.noOfKT,
          kt_subject: mark.ktSubject,
        })),
        achievements: {
          first_year: studentData.achievements.firstYear,
          second_year: studentData.achievements.secondYear,
          third_year: studentData.achievements.thirdYear,
          final_year: studentData.achievements.finalYear,
        },
        mentors: studentData.mentors.map((mentor) => ({
          semester: mentor.semester,
          mentor_name: mentor.mentorName,
        })),
        counseling: studentData.counseling.map((record) => ({
          sr_no: record.srNo,
          topic: record.topic,
          date: record.date,
          action_taken: record.actionTaken,
          remark: record.remark,
          sign: record.sign,
        })),
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/student/personal_info`,
        backendData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'application/json',
          }
        }
      )
      
      console.log("Data saved successfully:", res.data)
      setIsEditing(false)
      
    } catch (error) {
      console.error("Error saving student data:", error)
    }
  }

  const handleDownloadPDF = () => {
    try {
      generatePDF(studentData)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  const handleImage = async (result: string | ArrayBuffer, file?: File) => {
    try {
      // Update the photo in state immediately for preview
      handleBasicInfoChange("photo", safeString(result))
      
      // If you want to upload to backend, you can add API call here
      if (file) {
        const formData = new FormData()
        formData.append("photo", file)
        
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/student/upload_photo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        )
      }
      
    } catch (error) {
      console.log("Error handling photo:", error)
    }
  }

  const handleBasicInfoChange = (field: keyof typeof studentData.personalInfo, value: string) => {
    setStudentData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: safeString(value) },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Department of Computer Engineering</h1>
              <h2 className="text-xl text-orange-600 font-semibold">Student Mentoring Record</h2>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-orange-200">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Record
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                onClick={handleSaveData}
                className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="border-gray-300">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Basic Information - Always Visible */}
        <Card className="border-orange-200 mb-6">
          <CardHeader className="bg-orange-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-orange-800">Basic Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name of the Student</Label>
                  <Input
                    id="name"
                    value={safeString(studentData.personalInfo.name)}
                    onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                    disabled={true}
                    className="mt-1"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <Label htmlFor="enrollment">Enrollment No</Label>
                  <Input
                    id="enrollment"
                    value={safeString(studentData.personalInfo.enrollmentNo)}
                    onChange={(e) => handleBasicInfoChange("enrollmentNo", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Enter enrollment number"
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={safeString(studentData.personalInfo.dateOfBirth)}
                    onChange={(e) => handleBasicInfoChange("dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Input
                    id="bloodGroup"
                    value={safeString(studentData.personalInfo.bloodGroup)}
                    onChange={(e) => handleBasicInfoChange("bloodGroup", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Enter blood group"
                  />
                </div>
              </div>

              {/* Photo Section */}
              <div className="flex flex-col items-center">
                <Label className="mb-2">Photo</Label>
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-orange-200">
                    <AvatarImage
                      src={safeString(studentData.personalInfo.photo) || "/placeholder.svg"}
                      alt="Student Photo"
                    />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl">
                      {safeString(studentData.personalInfo.name) ? (
                        safeString(studentData.personalInfo.name).charAt(0).toUpperCase()
                      ) : (
                        <Camera className="w-8 h-8" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-2 text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            const result = e.target?.result
                            if (result) {
                              handleImage(result, file) // Pass both result and file
                            }
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-orange-200 rounded-lg p-1">
            <TabsTrigger value="personal" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="marks" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Marks
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger value="mentors" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Mentors
            </TabsTrigger>
            <TabsTrigger
              value="counseling"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Counseling
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <PersonalInfoTab
              data={studentData.personalInfo}
              isEditing={isEditing}
              onChange={(data) => setStudentData((prev) => ({ ...prev, personalInfo: data }))}
            />
          </TabsContent>

          <TabsContent value="marks" className="mt-6">
            <MarksTab
              data={studentData.marks}
              isEditing={isEditing}
              onChange={(data) => setStudentData((prev) => ({ ...prev, marks: data }))}
            />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <AchievementsTab
              data={studentData.achievements}
              isEditing={isEditing}
              onChange={(data) => setStudentData((prev) => ({ ...prev, achievements: data }))}
            />
          </TabsContent>

          <TabsContent value="mentors" className="mt-6">
            <MentorsTab
              data={studentData.mentors}
              isEditing={isEditing}
              onChange={(data) => setStudentData((prev) => ({ ...prev, mentors: data }))}
            />
          </TabsContent>

          <TabsContent value="counseling" className="mt-6">
            <CounselingTab
              data={studentData.counseling}
              isEditing={isEditing}
              onChange={(data) => setStudentData((prev) => ({ ...prev, counseling: data }))}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Download Button */}
      <Button
        onClick={handleDownloadPDF}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <Download className="w-6 h-6" />
      </Button>
    </div>
  )
}
