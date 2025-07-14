"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface PersonalInfoData {
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

interface PersonalInfoTabProps {
  data: PersonalInfoData
  isEditing: boolean
  onChange: (data: PersonalInfoData) => void
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

export default function PersonalInfoTab({ data, isEditing, onChange }: PersonalInfoTabProps) {
  const handleInputChange = (field: keyof PersonalInfoData, value: string | boolean) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="grid gap-6">
      {/* Contact Information */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="personalEmail">Mail Id (Personal)</Label>
              <Input
                id="personalEmail"
                type="email"
                value={safeString(data.personalEmail)}
                onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter personal email"
              />
            </div>
            <div>
              <Label htmlFor="atharvaEmail">Mail Id (Atharva)</Label>
              <Input
                id="atharvaEmail"
                type="email"
                value={safeString(data.atharvaEmail)}
                onChange={(e) => handleInputChange("atharvaEmail", e.target.value)}
                disabled={true}
                className="mt-1"
                placeholder="Enter college email"
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile No</Label>
              <Input
                id="mobile"
                value={safeString(data.mobileNo)}
                onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <Label htmlFor="aadhar">Aadhar Card No</Label>
              <Input
                id="aadhar"
                value={safeString(data.aadharNo)}
                onChange={(e) => handleInputChange("aadharNo", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter Aadhar number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Information */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">Family Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                value={safeString(data.fatherName)}
                onChange={(e) => handleInputChange("fatherName", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter father's name"
              />
            </div>
            <div>
              <Label htmlFor="fatherOccupation">Father's Occupation</Label>
              <Input
                id="fatherOccupation"
                value={safeString(data.fatherOccupation)}
                onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter father's occupation"
              />
            </div>
            <div>
              <Label htmlFor="fatherMobile">Father's Mobile No</Label>
              <Input
                id="fatherMobile"
                value={safeString(data.fatherMobile)}
                onChange={(e) => handleInputChange("fatherMobile", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter father's mobile"
              />
            </div>
            <div>
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                value={safeString(data.motherName)}
                onChange={(e) => handleInputChange("motherName", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter mother's name"
              />
            </div>
            <div>
              <Label htmlFor="motherOccupation">Mother's Occupation</Label>
              <Input
                id="motherOccupation"
                value={safeString(data.motherOccupation)}
                onChange={(e) => handleInputChange("motherOccupation", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter mother's occupation"
              />
            </div>
            <div>
              <Label htmlFor="motherMobile">Mother's Mobile No</Label>
              <Input
                id="motherMobile"
                value={safeString(data.motherMobile)}
                onChange={(e) => handleInputChange("motherMobile", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter mother's mobile"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">Address Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="localAddress">Local Address</Label>
              <Textarea
                id="localAddress"
                value={safeString(data.localAddress)}
                onChange={(e) => handleInputChange("localAddress", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                rows={3}
                placeholder="Enter local address"
              />
            </div>
            <div>
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <Textarea
                id="permanentAddress"
                value={safeString(data.permanentAddress)}
                onChange={(e) => handleInputChange("permanentAddress", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                rows={3}
                placeholder="Enter permanent address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Background */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">Academic Background</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ssc">SSC</Label>
              <Input
                id="ssc"
                value={safeString(data.ssc)}
                onChange={(e) => handleInputChange("ssc", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter SSC percentage"
              />
            </div>
            <div>
              <Label htmlFor="hsc">HSC</Label>
              <Input
                id="hsc"
                value={safeString(data.hsc)}
                onChange={(e) => handleInputChange("hsc", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter HSC percentage"
              />
            </div>
            <div>
              <Label htmlFor="diploma">Diploma</Label>
              <Input
                id="diploma"
                value={safeString(data.diploma)}
                onChange={(e) => handleInputChange("diploma", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter diploma percentage or N/A"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracurricular Activities */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">Extracurricular Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="nss"
                checked={safeBoolean(data.nssMember)}
                onCheckedChange={(checked) => handleInputChange("nssMember", checked as boolean)}
                disabled={!isEditing}
              />
              <Label htmlFor="nss">NSS Member</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ember"
                checked={safeBoolean(data.emberMember)}
                onCheckedChange={(checked) => handleInputChange("emberMember", checked as boolean)}
                disabled={!isEditing}
              />
              <Label htmlFor="ember">Ember Member</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rhythm"
                checked={safeBoolean(data.rhythmMember)}
                onCheckedChange={(checked) => handleInputChange("rhythmMember", checked as boolean)}
                disabled={!isEditing}
              />
              <Label htmlFor="rhythm">Rhythm Member</Label>
            </div>
            <div>
              <Label htmlFor="sport">Sport</Label>
              <Input
                id="sport"
                value={safeString(data.sport)}
                onChange={(e) => handleInputChange("sport", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter sport activities"
              />
            </div>
            <div>
              <Label htmlFor="other">Any Other</Label>
              <Textarea
                id="other"
                value={safeString(data.other)}
                onChange={(e) => handleInputChange("other", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
                rows={3}
                placeholder="Enter other activities"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
