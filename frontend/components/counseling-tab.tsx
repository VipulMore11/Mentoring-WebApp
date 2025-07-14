"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"

interface CounselingData {
  srNo: number
  topic: string
  date: string
  actionTaken: string
  remark: string
  sign: string
}

interface CounselingTabProps {
  data: CounselingData[]
  isEditing: boolean
  onChange: (data: CounselingData[]) => void
}

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

// Helper function to safely process counseling array
const safeCounselingArray = (data: any[]): CounselingData[] => {
  if (!Array.isArray(data)) return []

  return Array.from({ length: 20 }, (_, i) => {
    const record = data[i] || {}
    return {
      srNo: safeNumber(record.srNo) || i + 1,
      topic: safeString(record.topic),
      date: safeString(record.date),
      actionTaken: safeString(record.actionTaken),
      remark: safeString(record.remark),
      sign: safeString(record.sign),
    }
  })
}

export default function CounselingTab({ data, isEditing, onChange }: CounselingTabProps) {
  const safeData = safeCounselingArray(data)

  const handleInputChange = (index: number, field: keyof CounselingData, value: string) => {
    const newData = [...safeData]
    if (newData[index]) {
      if (field === "srNo") {
        newData[index] = { ...newData[index], [field]: safeNumber(value) }
      } else {
        newData[index] = { ...newData[index], [field]: safeString(value) }
      }
      onChange(newData)
    }
  }

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Student Counseling Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-orange-200">
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800 w-16">Sr. No</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Topic/Problem</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800 w-32">Date</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Action Taken</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800">Remark</th>
                <th className="text-left p-3 bg-orange-50 font-semibold text-orange-800 w-24">Sign</th>
              </tr>
            </thead>
            <tbody>
              {safeData.map((record, index) => (
                <tr key={index} className="border-b border-orange-100 hover:bg-orange-25">
                  <td className="p-3 font-medium text-orange-700 text-center">{safeNumber(record.srNo)}</td>
                  <td className="p-3">
                    <Textarea
                      value={safeString(record.topic)}
                      onChange={(e) => handleInputChange(index, "topic", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter topic/problem"
                      className="min-h-[60px] border-orange-200 focus:border-orange-400"
                      rows={2}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="date"
                      value={safeString(record.date)}
                      onChange={(e) => handleInputChange(index, "date", e.target.value)}
                      disabled={!isEditing}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </td>
                  <td className="p-3">
                    <Textarea
                      value={safeString(record.actionTaken)}
                      onChange={(e) => handleInputChange(index, "actionTaken", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter action taken"
                      className="min-h-[60px] border-orange-200 focus:border-orange-400"
                      rows={2}
                    />
                  </td>
                  <td className="p-3">
                    <Textarea
                      value={safeString(record.remark)}
                      onChange={(e) => handleInputChange(index, "remark", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter remark"
                      className="min-h-[60px] border-orange-200 focus:border-orange-400"
                      rows={2}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={safeString(record.sign)}
                      onChange={(e) => handleInputChange(index, "sign", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Sign"
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
