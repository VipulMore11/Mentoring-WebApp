import type { StudentData } from "@/app/page"

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

export const generatePDF = (data: StudentData) => {
  try {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      alert("Please allow popups to download PDF")
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Mentoring Record - ${safeString(data?.personalInfo?.name) || "Unknown Student"}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #333;
            margin: 0;
            font-size: 24px;
          }
          .header h2 {
            color: #f97316;
            margin: 5px 0;
            font-size: 18px;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            background-color: #f97316;
            color: white;
            padding: 10px;
            margin-bottom: 15px;
            font-weight: bold;
            font-size: 16px;
          }
          .field-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
          }
          .field {
            margin-bottom: 10px;
          }
          .field-label {
            font-weight: bold;
            color: #f97316;
            margin-bottom: 5px;
          }
          .field-value {
            border-bottom: 1px solid #ddd;
            padding: 5px 0;
            min-height: 20px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .table th {
            background-color: #f97316;
            color: white;
            font-weight: bold;
          }
          .table tr:nth-child(even) {
            background-color: #fef7f0;
          }
          .photo-section {
            text-align: center;
            margin: 20px 0;
          }
          .photo-placeholder {
            width: 120px;
            height: 150px;
            border: 2px solid #f97316;
            display: inline-block;
            background-color: #fef7f0;
            line-height: 150px;
            color: #f97316;
          }
          @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Department of Computer Engineering</h1>
          <h2>Student Mentoring Record</h2>
        </div>

        <div class="section">
          <div class="section-title">Personal Information</div>
          <div class="field-group">
            <div class="field">
              <div class="field-label">Name of the Student</div>
              <div class="field-value">${safeString(data?.personalInfo?.name)}</div>
            </div>
            <div class="field">
              <div class="field-label">Enrollment No</div>
              <div class="field-value">${safeString(data?.personalInfo?.enrollmentNo)}</div>
            </div>
            <div class="field">
              <div class="field-label">Date of Birth</div>
              <div class="field-value">${safeString(data?.personalInfo?.dateOfBirth)}</div>
            </div>
            <div class="field">
              <div class="field-label">Blood Group</div>
              <div class="field-value">${safeString(data?.personalInfo?.bloodGroup)}</div>
            </div>
            <div class="field">
              <div class="field-label">Aadhar Card No</div>
              <div class="field-value">${safeString(data?.personalInfo?.aadharNo)}</div>
            </div>
            <div class="field">
              <div class="field-label">Mobile No</div>
              <div class="field-value">${safeString(data?.personalInfo?.mobileNo)}</div>
            </div>
          </div>
          
          <div class="photo-section">
            <div class="field-label">Photo</div>
            ${
              safeString(data?.personalInfo?.photo)
                ? `<img src="${safeString(data.personalInfo.photo)}" style="width: 120px; height: 150px; border: 2px solid #f97316;" />`
                : '<div class="photo-placeholder">PHOTO</div>'
            }
          </div>
        </div>

        <div class="section">
          <div class="section-title">Contact & Family Information</div>
          <div class="field-group">
            <div class="field">
              <div class="field-label">Personal Email</div>
              <div class="field-value">${safeString(data?.personalInfo?.personalEmail)}</div>
            </div>
            <div class="field">
              <div class="field-label">Atharva Email</div>
              <div class="field-value">${safeString(data?.personalInfo?.atharvaEmail)}</div>
            </div>
            <div class="field">
              <div class="field-label">Father's Name</div>
              <div class="field-value">${safeString(data?.personalInfo?.fatherName)}</div>
            </div>
            <div class="field">
              <div class="field-label">Father's Occupation</div>
              <div class="field-value">${safeString(data?.personalInfo?.fatherOccupation)}</div>
            </div>
            <div class="field">
              <div class="field-label">Father's Mobile</div>
              <div class="field-value">${safeString(data?.personalInfo?.fatherMobile)}</div>
            </div>
            <div class="field">
              <div class="field-label">Mother's Name</div>
              <div class="field-value">${safeString(data?.personalInfo?.motherName)}</div>
            </div>
            <div class="field">
              <div class="field-label">Mother's Occupation</div>
              <div class="field-value">${safeString(data?.personalInfo?.motherOccupation)}</div>
            </div>
            <div class="field">
              <div class="field-label">Mother's Mobile</div>
              <div class="field-value">${safeString(data?.personalInfo?.motherMobile)}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Academic Background</div>
          <div class="field-group">
            <div class="field">
              <div class="field-label">SSC</div>
              <div class="field-value">${safeString(data?.personalInfo?.ssc)}</div>
            </div>
            <div class="field">
              <div class="field-label">HSC</div>
              <div class="field-value">${safeString(data?.personalInfo?.hsc)}</div>
            </div>
            <div class="field">
              <div class="field-label">Diploma</div>
              <div class="field-value">${safeString(data?.personalInfo?.diploma)}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Semester-wise Marks</div>
          <table class="table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Marks</th>
                <th>No of KT</th>
                <th>KT Subject</th>
              </tr>
            </thead>
            <tbody>
              ${
                data?.marks && Array.isArray(data.marks)
                  ? data.marks
                      .map(
                        (sem) => `
                <tr>
                  <td>${safeString(sem?.semester)}</td>
                  <td>${safeString(sem?.marks)}</td>
                  <td>${safeString(sem?.noOfKT)}</td>
                  <td>${safeString(sem?.ktSubject)}</td>
                </tr>
              `,
                      )
                      .join("")
                  : '<tr><td colspan="4">No marks data available</td></tr>'
              }
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Academic Achievements</div>
          <div class="field">
            <div class="field-label">First Year</div>
            <div class="field-value">${safeString(data?.achievements?.firstYear)}</div>
          </div>
          <div class="field">
            <div class="field-label">Second Year</div>
            <div class="field-value">${safeString(data?.achievements?.secondYear)}</div>
          </div>
          <div class="field">
            <div class="field-label">Third Year</div>
            <div class="field-value">${safeString(data?.achievements?.thirdYear)}</div>
          </div>
          <div class="field">
            <div class="field-label">Final Year</div>
            <div class="field-value">${safeString(data?.achievements?.finalYear)}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Mentors Information</div>
          <table class="table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Mentor Name</th>
              </tr>
            </thead>
            <tbody>
              ${
                data?.mentors && Array.isArray(data.mentors)
                  ? data.mentors
                      .map(
                        (mentor) => `
                <tr>
                  <td>${safeString(mentor?.semester)}</td>
                  <td>${safeString(mentor?.mentorName)}</td>
                </tr>
              `,
                      )
                      .join("")
                  : '<tr><td colspan="2">No mentors data available</td></tr>'
              }
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Student Counseling Report</div>
          <table class="table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Topic/Problem</th>
                <th>Date</th>
                <th>Action Taken</th>
                <th>Remark</th>
                <th>Sign</th>
              </tr>
            </thead>
            <tbody>
              ${
                data?.counseling && Array.isArray(data.counseling)
                  ? data.counseling
                      .filter(
                        (record) =>
                          safeString(record?.topic) || safeString(record?.date) || safeString(record?.actionTaken),
                      )
                      .map(
                        (record) => `
                <tr>
                  <td>${record?.srNo || 0}</td>
                  <td>${safeString(record?.topic)}</td>
                  <td>${safeString(record?.date)}</td>
                  <td>${safeString(record?.actionTaken)}</td>
                  <td>${safeString(record?.remark)}</td>
                  <td>${safeString(record?.sign)}</td>
                </tr>
              `,
                      )
                      .join("")
                  : '<tr><td colspan="6">No counseling records available</td></tr>'
              }
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Extracurricular Activities</div>
          <div class="field-group">
            <div class="field">
              <div class="field-label">NSS Member</div>
              <div class="field-value">${safeBoolean(data?.personalInfo?.nssMember) ? "Yes" : "No"}</div>
            </div>
            <div class="field">
              <div class="field-label">Ember Member</div>
              <div class="field-value">${safeBoolean(data?.personalInfo?.emberMember) ? "Yes" : "No"}</div>
            </div>
            <div class="field">
              <div class="field-label">Rhythm Member</div>
              <div class="field-value">${safeBoolean(data?.personalInfo?.rhythmMember) ? "Yes" : "No"}</div>
            </div>
            <div class="field">
              <div class="field-label">Sport</div>
              <div class="field-value">${safeString(data?.personalInfo?.sport)}</div>
            </div>
            <div class="field">
              <div class="field-label">Any Other</div>
              <div class="field-value">${safeString(data?.personalInfo?.other)}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Error generating PDF. Please try again.")
  }
}
