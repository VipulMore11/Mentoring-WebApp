"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trophy } from "lucide-react"

interface AchievementsData {
  firstYear: string
  secondYear: string
  thirdYear: string
  finalYear: string
}

interface AchievementsTabProps {
  data: AchievementsData
  isEditing: boolean
  onChange: (data: AchievementsData) => void
}

// Helper function to safely get string values
const safeString = (value: any): string => {
  if (value === null || value === undefined) return ""
  return String(value)
}

// Helper function to safely process achievements data
const safeAchievementsData = (data: any): AchievementsData => {
  if (!data || typeof data !== "object") {
    return {
      firstYear: "",
      secondYear: "",
      thirdYear: "",
      finalYear: "",
    }
  }

  return {
    firstYear: safeString(data.firstYear),
    secondYear: safeString(data.secondYear),
    thirdYear: safeString(data.thirdYear),
    finalYear: safeString(data.finalYear),
  }
}

export default function AchievementsTab({ data, isEditing, onChange }: AchievementsTabProps) {
  const safeData = safeAchievementsData(data)

  const handleInputChange = (field: keyof AchievementsData, value: string) => {
    onChange({ ...safeData, [field]: safeString(value) })
  }

  const years = [
    { key: "firstYear" as keyof AchievementsData, label: "First Year", icon: "🥇" },
    { key: "secondYear" as keyof AchievementsData, label: "Second Year", icon: "🥈" },
    { key: "thirdYear" as keyof AchievementsData, label: "Third Year", icon: "🥉" },
    { key: "finalYear" as keyof AchievementsData, label: "Final Year", icon: "🏆" },
  ]

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Academic Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6">
          {years.map((year) => (
            <div key={year.key} className="space-y-2">
              <Label htmlFor={year.key} className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                <span className="text-2xl">{year.icon}</span>
                {year.label}
              </Label>
              <Textarea
                id={year.key}
                value={safeString(safeData[year.key])}
                onChange={(e) => handleInputChange(year.key, e.target.value)}
                disabled={!isEditing}
                placeholder={`Enter achievements for ${year.label.toLowerCase()}...`}
                className="min-h-[120px] border-orange-200 focus:border-orange-400"
                rows={5}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
