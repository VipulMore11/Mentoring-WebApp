"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface MarksData {
  semester: string
  marks: string
  noOfKT: string
  ktSubject: string
}

interface MarksTabProps {
  data: MarksData[]
  isEditing: boolean
  onChange: (data: MarksData[]) => void
}

// Helper function to safely get string values
const safeString = (value: any): string => {
  if (value === null || value === undefined) return ""
  return String(value)
}

// Helper function to safely process marks array
const safeMarksArray = (data: any[]): MarksData[] => {
  if (!Array.isArray(data)) return []

  return Array.from({ length: 8 }, (_, i) => {
    const mark = data[i] || {}
    return {
      semester: safeString(mark.semester) || `SEM ${i + 1}`,
      marks: safeString(mark.marks),
      noOfKT: safeString(mark.noOfKT),
      ktSubject: safeString(mark.ktSubject),
    }
  })
}

export default function MarksTab({ data, isEditing, onChange }: MarksTabProps) {
  const safeData = safeMarksArray(data)

  const handleInputChange = (index: number, field: keyof MarksData, value: string) => {
    const newData = [...safeData]
    if (newData[index]) {
      newData[index] = { ...newData[index], [field]: safeString(value) }
      onChange(newData)
    }
  }

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="text-orange-800">Semester-wise Marks & KT Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-orange-200">
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Semester</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Marks</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">No of KT</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">KT Subject</th>
              </tr>
            </thead>
            <tbody>
              {safeData.map((semester, index) => (
                <tr key={index} className="border-b border-orange-100 hover:bg-orange-25">
                  <td className="p-3 font-medium text-orange-700">{safeString(semester.semester)}</td>
                  <td className="p-3">
                    <Input
                      value={safeString(semester.marks)}
                      onChange={(e) => handleInputChange(index, "marks", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter marks"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={safeString(semester.noOfKT)}
                      onChange={(e) => handleInputChange(index, "noOfKT", e.target.value)}
                      disabled={!isEditing}
                      placeholder="0"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={safeString(semester.ktSubject)}
                      onChange={(e) => handleInputChange(index, "ktSubject", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Subject name (if any)"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
