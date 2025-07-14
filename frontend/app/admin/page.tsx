"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Download, Eye, LogOut, User, Settings, FileText, GraduationCap, Edit, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { StudentData } from "@/app/page"
import pb from "../../lib/pb"

// Helper function to safely get string values
const safeString = (value: any): string => {
  if (value === null || value === undefined) return ""
  return String(value)
}

// Helper function to safely get number values
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const calculateAverageMarks = (student: StudentData): string => {
  try {
    if (!student || !student.marks || !Array.isArray(student.marks)) return "N/A"

    const validMarks = student.marks.filter((m) => {
      const marks = safeString(m?.marks)
      return marks && !isNaN(Number(marks)) && Number(marks) > 0
    })

    if (validMarks.length === 0) return "N/A"

    const sum = validMarks.reduce((acc, m) => acc + Number(safeString(m.marks)), 0)
    return (sum / validMarks.length).toFixed(1)
  } catch (error) {
    console.error("Error calculating average marks:", error)
    return "N/A"
  }
}

// Helper function to safely get total KTs
const getTotalKTs = (student: StudentData): number => {
  try {
    if (!student || !student.marks || !Array.isArray(student.marks)) return 0

    return student.marks.reduce((acc, m) => {
      const ktCount = safeString(m?.noOfKT)
      return acc + (Number(ktCount) || 0)
    }, 0)
  } catch (error) {
    console.error("Error calculating total KTs:", error)
    return 0
  }
}

// Helper function to safely get counseling sessions count
const getCounselingSessionsCount = (student: StudentData): number => {
  try {
    if (!student || !student.counseling || !Array.isArray(student.counseling)) return 0

    return student.counseling.filter((c) => safeString(c?.topic)).length
  } catch (error) {
    console.error("Error calculating counseling sessions:", error)
    return 0
  }
}

export default function AdminPanel() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<(StudentData & { id: string; lastUpdated: string }) | null>(
    null,
  )
  const [editingCounseling, setEditingCounseling] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<any>({})
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function getData() {
      const records = await pb.collection('users').getFullList();
      console.log("Fetched records:", records)
      setStudents(records);
    }
    getData()
  }, [])

  console.log("Students data:", students)

  useEffect(() => {
    try {
      let filtered = students.map(record => record.mentorForm as StudentData)

      // Filter by search term with null safety
      if (searchTerm) {
        filtered = filtered.filter((student) => {
          const name = safeString(student?.personalInfo?.name).toLowerCase()
          const enrollment = safeString(student?.personalInfo?.enrollmentNo).toLowerCase()
          const email = safeString(student?.personalInfo?.personalEmail).toLowerCase()
          const searchLower = searchTerm.toLowerCase()

          return name.includes(searchLower) || enrollment.includes(searchLower) || email.includes(searchLower)
        })
      }

      // Filter by semester with null safety
      if (selectedSemester !== "all") {
        filtered = filtered.filter((student) => {
          if (!student?.mentors || !Array.isArray(student.mentors)) return false
          const currentSemester = student.mentors.find((m) => safeString(m?.semester) === selectedSemester)
          return currentSemester && safeString(currentSemester.mentorName)
        })
      }

      // Filter by mentor with null safety
      if (selectedMentor !== "all") {
        filtered = filtered.filter((student) => {
          if (!student?.mentors || !Array.isArray(student.mentors)) return false
          return student.mentors.some((mentor) => safeString(mentor?.mentorName) === selectedMentor)
        })
      }

      setFilteredStudents(filtered)
    } catch (error) {
      console.error("Error filtering students:", error)
      setFilteredStudents([])
    }
  }, [searchTerm, selectedSemester, selectedMentor, students])

  const handleLogout = () => {
    pb.authStore.clear()
    router.push("/login")
  }

  const handleViewStudent = (student: StudentData, recordId?: string) => {
    // Find the record ID from the students array
    const fullRecord = students.find(record =>
      record.mentorForm?.personalInfo?.atharvaEmail === student.personalInfo?.atharvaEmail
    )

    setSelectedStudent({
      ...student,
      id: fullRecord?.id || recordId || '',
      lastUpdated: fullRecord?.updated || ''
    })
  }

  const handleEditCounseling = (index: number, record: any) => {
    setEditingCounseling(index)
    setEditingData({
      topic: safeString(record?.topic),
      date: safeString(record?.date),
      actionTaken: safeString(record?.actionTaken),
      remark: safeString(record?.remark)
    })
  }

  const handleCancelEdit = () => {
    setEditingCounseling(null)
    setEditingData({})
  }

  const handleUpdateCounseling = async (index: number) => {
    if (!selectedStudent?.id) {
      console.error("No student ID found")
      return
    }

    setIsUpdating(true)
    try {
      // Get the current student data
      const currentRecord = students.find(record => record.id === selectedStudent.id)
      if (!currentRecord) {
        throw new Error("Student record not found")
      }

      // Create a copy of the mentorForm data
      const updatedMentorForm = { ...currentRecord.mentorForm }

      // Update the specific counseling record
      updatedMentorForm.counseling[index] = {
        ...updatedMentorForm.counseling[index],
        topic: editingData.topic,
        date: editingData.date,
        actionTaken: editingData.actionTaken,
        remark: editingData.remark
      }

      // Update the record in PocketBase
      const updateData = {
        mentorForm: updatedMentorForm
      }

      const updatedRecord = await pb.collection('users').update(selectedStudent.id, updateData)

      // Update local state
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === selectedStudent.id
            ? { ...student, mentorForm: updatedMentorForm, updated: updatedRecord.updated }
            : student
        )
      )

      // Update selected student data
      setSelectedStudent(prev => ({
        ...updatedMentorForm,
        id: selectedStudent.id,
        lastUpdated: updatedRecord.updated
      }))

      setEditingCounseling(null)
      setEditingData({})

      console.log("Counseling record updated successfully")
    } catch (error) {
      console.error("Error updating counseling record:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(students.map(record => record.mentorForm), null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = "students_data.json"
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const getUniqueValues = () => {
    try {
      const values = new Set<string>()
      students.forEach((record) => {
        const student = record.mentorForm
        if (student?.mentors && Array.isArray(student.mentors)) {
          student.mentors.forEach((mentor: any) => {
            const mentorName = safeString(mentor?.mentorName)
            if (mentorName) values.add(mentorName)
          })
        }
      })
      return Array.from(values)
    } catch (error) {
      console.error("Error getting unique values:", error)
      return []
    }
  }

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        {/* Header */}
        <div className="bg-white shadow-sm border-b-4 border-orange-500">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button onClick={() => setSelectedStudent(null)} variant="outline" className="border-orange-300">
                  ← Back to Admin Panel
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
                  <p className="text-orange-600">{safeString(selectedStudent?.personalInfo?.name)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Student Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-orange-200">
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-orange-200">
                  <AvatarImage src={safeString(selectedStudent?.personalInfo?.photo) || "/placeholder.svg"} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-xl">
                    {safeString(selectedStudent?.personalInfo?.name).charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">
                  {safeString(selectedStudent?.personalInfo?.name) || "Unknown"}
                </h3>
                <p className="text-sm text-gray-600">
                  {safeString(selectedStudent?.personalInfo?.enrollmentNo) || "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{calculateAverageMarks(selectedStudent)} CGPA</div>
                  <p className="text-sm text-gray-600">Average Marks</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{getTotalKTs(selectedStudent)}</div>
                  <p className="text-sm text-gray-600">Total KTs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{getCounselingSessionsCount(selectedStudent)}</div>
                  <p className="text-sm text-gray-600">Counseling Sessions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="grid gap-6">
            {/* Personal Information */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                    <p className="text-gray-800">{safeString(selectedStudent?.personalInfo?.dateOfBirth) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Blood Group</p>
                    <p className="text-gray-800">{safeString(selectedStudent?.personalInfo?.bloodGroup) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mobile</p>
                    <p className="text-gray-800">{safeString(selectedStudent?.personalInfo?.mobileNo) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Personal Email</p>
                    <p className="text-gray-800">{safeString(selectedStudent?.personalInfo?.personalEmail) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">College Email</p>
                    <p className="text-gray-800">{safeString(selectedStudent?.personalInfo?.atharvaEmail) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Father's Name</p>
                    <p className="text-gray-800">{safeString(selectedStudent?.personalInfo?.fatherName) || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Performance */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">Academic Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Semester</th>
                        <th className="text-left p-2">Marks</th>
                        <th className="text-left p-2">KTs</th>
                        <th className="text-left p-2">KT Subject</th>
                        <th className="text-left p-2">Mentor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent?.marks && Array.isArray(selectedStudent.marks) ? (
                        selectedStudent.marks.map((mark, index) => {
                          const mentor =
                            selectedStudent?.mentors && Array.isArray(selectedStudent.mentors)
                              ? selectedStudent.mentors[index]
                              : null
                          return (
                            <tr key={index} className="border-b">
                              <td className="p-2 font-medium">{safeString(mark?.semester) || `SEM ${index + 1}`}</td>
                              <td className="p-2">{safeString(mark?.marks) || "N/A"}</td>
                              <td className="p-2">
                                {safeString(mark?.noOfKT) ? (
                                  <Badge variant="destructive">{safeString(mark.noOfKT)}</Badge>
                                ) : (
                                  <Badge variant="secondary">0</Badge>
                                )}
                              </td>
                              <td className="p-2">{safeString(mark?.ktSubject) || "N/A"}</td>
                              <td className="p-2">{safeString(mentor?.mentorName) || "N/A"}</td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-500">
                            No marks data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStudent?.achievements && typeof selectedStudent.achievements === "object" ? (
                    Object.entries(selectedStudent.achievements).map(([year, achievement]) => (
                      <div key={year}>
                        <p className="text-sm font-medium text-gray-600 capitalize">
                          {year.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-gray-800">{safeString(achievement) || "No achievements recorded"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No achievements data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Counseling Records */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">Counseling Records</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {selectedStudent?.counseling && Array.isArray(selectedStudent.counseling)
                    ? selectedStudent.counseling
                      .filter((record) => safeString(record?.topic))
                      .map((record, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          {editingCounseling === index ? (
                            // Edit Mode
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Topic</label>
                                  <Input
                                    value={editingData.topic}
                                    onChange={(e) => setEditingData({ ...editingData, topic: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Date</label>
                                  <Input
                                    type="date"
                                    value={editingData.date}
                                    onChange={(e) => setEditingData({ ...editingData, date: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Action Taken</label>
                                <Textarea
                                  value={editingData.actionTaken}
                                  onChange={(e) => setEditingData({ ...editingData, actionTaken: e.target.value })}
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Remark/Status</label>
                                <Select
                                  value={editingData.remark}
                                  onValueChange={(value) => setEditingData({ ...editingData, remark: value })}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Good">Good</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleUpdateCounseling(index)}
                                  disabled={isUpdating}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  {isUpdating ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  onClick={handleCancelEdit}
                                  variant="outline"
                                  disabled={isUpdating}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Topic</p>
                                  <p className="text-gray-800">{safeString(record?.topic)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Date</p>
                                  <p className="text-gray-800">{safeString(record?.date) || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Action Taken</p>
                                  <p className="text-gray-800">{safeString(record?.actionTaken) || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Status</p>
                                  <Badge variant={safeString(record?.remark) === "Resolved" ? "default" : "secondary"}>
                                    {safeString(record?.remark) || "N/A"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  onClick={() => handleEditCounseling(index, record)}
                                  size="sm"
                                  variant="outline"
                                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    : null}
                  {(!selectedStudent?.counseling ||
                    !Array.isArray(selectedStudent.counseling) ||
                    selectedStudent.counseling.filter((record) => safeString(record?.topic)).length === 0) && (
                      <p className="text-gray-500 text-center py-8">No counseling records found</p>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-2 rounded-full">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-orange-600">Student Mentoring System</p>
              </div>
            </div>

            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-orange-200">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:px-40 mb-8">
          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-orange-600">{students.length}</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredStudents.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-orange-200 mb-6 ">
          <CardHeader className="bg-orange-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-orange-800">Student Records</CardTitle>
              <Button onClick={handleExportData} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, enrollment number, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-full md:w-48 border-orange-200">
                  <SelectValue placeholder="Filter by Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {Array.from({ length: 8 }, (_, i) => (
                    <SelectItem key={i} value={`SEM-${i + 1}`}>
                      SEM-{i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger className="w-full md:w-48 border-orange-200">
                  <SelectValue placeholder="Filter by Mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mentors</SelectItem>
                  {getUniqueValues().map((mentor) => (
                    <SelectItem key={mentor} value={mentor}>
                      {mentor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-orange-200">
                    <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Student</th>
                    <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Enrollment</th>
                    <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Email</th>
                    <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Avg Marks</th>
                    <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">KTs</th>
                    <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                    const fullRecord = students.find(record =>
                      record.mentorForm?.personalInfo?.atharvaEmail === student.personalInfo?.atharvaEmail
                    )
                    return (
                      <tr key={student.personalInfo?.atharvaEmail || index} className="border-b border-orange-100 hover:bg-orange-25">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border-2 border-orange-200">
                              <AvatarImage src={safeString(student?.personalInfo?.photo) || "/placeholder.svg"} />
                              <AvatarFallback className="bg-orange-100 text-orange-600">
                                {safeString(student?.personalInfo?.name).charAt(0) || "S"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800">
                                {safeString(student?.personalInfo.name) || "Unknown"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {safeString(student?.personalInfo?.mobileNo) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-orange-700">
                          {safeString(student?.personalInfo?.enrollmentNo) || "N/A"}
                        </td>
                        <td className="p-3 text-gray-600">{safeString(student?.personalInfo.atharvaEmail) || "N/A"}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{calculateAverageMarks(student)} CGPA</Badge>
                        </td>
                        <td className="p-3">
                          {getTotalKTs(student) > 0 ? (
                            <Badge variant="destructive">{getTotalKTs(student)}</Badge>
                          ) : (
                            <Badge variant="default">0</Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <Button
                            onClick={() => handleViewStudent(student, fullRecord?.id)}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
