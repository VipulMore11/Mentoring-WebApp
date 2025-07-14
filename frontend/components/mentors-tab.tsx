"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"

interface MentorData {
  semester: string
  mentorName: string
}

interface MentorsTabProps {
  data: MentorData[]
  isEditing: boolean
  onChange: (data: MentorData[]) => void
}

// Helper function to safely get string values
const safeString = (value: any): string => {
  if (value === null || value === undefined) return ""
  return String(value)
}

// Helper function to safely process mentors array
const safeMentorsArray = (data: any[]): MentorData[] => {
  if (!Array.isArray(data)) return []

  return Array.from({ length: 8 }, (_, i) => {
    const mentor = data[i] || {}
    return {
      semester: safeString(mentor.semester) || `SEM-${i + 1}`,
      mentorName: safeString(mentor.mentorName),
    }
  })
}

export default function MentorsTab({ data, isEditing, onChange }: MentorsTabProps) {
  const safeData = safeMentorsArray(data)

  const handleInputChange = (index: number, value: string) => {
    const newData = [...safeData]
    if (newData[index]) {
      newData[index] = { ...newData[index], mentorName: safeString(value) }
      onChange(newData)
    }
  }

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Mentors Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeData.map((mentor, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`mentor-${index}`} className="font-semibold text-orange-700">
                {safeString(mentor.semester)}
              </Label>
              <Input
                id={`mentor-${index}`}
                value={safeString(mentor.mentorName)}
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={!isEditing}
                placeholder="Enter mentor name"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
