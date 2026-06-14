import cloudinary from "../../config/cloudinary.js";
import { groq } from "../../config/groq.js";
import { ResumeModel } from "../../models/ResumeModel.js";
import { SKILLS } from "../../utils/skills.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const uploadResumeController = async (req, res) => {
    try {
        const user = req.user;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "No resume file uploaded" });
        }

        // Check if user already has a resume
        const existingResume = await ResumeModel.findOne({ user: user.id });
        if (existingResume) {
            return res.status(400).json({ success: false, message: "You already have a resume. Please delete it before uploading a new one." });
        }

        // 1. Upload to Cloudinary using upload_stream
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "raw", folder: "resumes" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
        };

        const cloudinaryResult = await uploadToCloudinary();
        const resumeUrl = cloudinaryResult.secure_url;

        // 2. Parse PDF
        const pdfData = await pdf(file.buffer);
        const resumeText = pdfData.text;

        // 3. Extract data using Groq LLM (llama3-8b-8192)
        const prompt = `
You are an expert ATS (Applicant Tracking System) parser. I will provide you with the raw text extracted from a resume.
Your job is to extract the data into a strict JSON format matching the schema below.

Allowed Skills List:
${JSON.stringify(SKILLS)}

Instructions:
1. Extract skills, experience, projects, and education.
2. For any "technologies" or "skills" array, ONLY include exact matches from the 'Allowed Skills List' provided above.
3. Calculate an 'atsScore' out of 100 based on the presence of technical skills, clarity, and measurable achievements in the text.
4. Output ONLY valid JSON. No markdown, no explanations, no wrapping code blocks. JUST the JSON object.

Expected JSON Schema:
{
    "resumeData": {
        "skills": ["Skill1", "Skill2"],
        "experience": [
            {
                "jobTitle": "String",
                "company": "String",
                "description": "String",
                "duration": "String",
                "technologies": ["Skill1", "Skill2"]
            }
        ],
        "projects": [
            {
                "title": "String",
                "description": "String",
                "github": "String (url if exists)",
                "link": "String (url if exists)",
                "technologies": ["Skill1", "Skill2"]
            }
        ],
        "education": [
            {
                "degree": "String",
                "institution": "String",
                "score": "String"
            }
        ]
    },
    "atsScore": Number
}

Resume Text to Parse:
${resumeText}
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.1,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "{}";
        
        let extractedData;
        try {
            // Clean up potentially markdown-wrapped JSON response
            const cleanedResponse = aiResponse.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '').trim();
            extractedData = JSON.parse(cleanedResponse);
        } catch (e) {
            console.error("Failed to parse AI JSON response:", aiResponse);
            return res.status(500).json({ success: false, message: "Failed to parse resume data structure" });
        }

        // Return extracted data and url to client for verification
        return res.status(200).json({
            success: true,
            message: "Resume parsed successfully",
            payload: {
                resumeUrl,
                resumeData: extractedData.resumeData,
                atsScore: extractedData.atsScore
            }
        });

    }
    catch (err) {
        console.error("Resume Upload Error:", err);
        return res.status(500).json({ success: false, message: "Failed to upload resume", error: err.message });
    }
};