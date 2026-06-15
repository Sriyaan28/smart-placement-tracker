import { groq } from "../../config/groq.js";
import { SKILLS } from "../../utils/skills.js";

export const analyzeResumeController = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText) {
            return res.status(400).json({ success: false, message: "No resume text provided for analysis." });
        }

        // Extract data using Groq LLM (llama3-8b-8192)
        const prompt = `
You are an expert ATS (Applicant Tracking System) parser. I will provide you with the raw text extracted from a resume.
Your job is to extract the data into a strict JSON format matching the schema below.

Allowed Skills List:
${JSON.stringify(SKILLS)}

Instructions:
1. Extract skills, experience, projects, and education.
2. For any "technologies" or "skills" array, ONLY include exact matches from the 'Allowed Skills List' provided above.
3. Calculate an 'atsScore' out of 100 based on the presence of technical skills, clarity, and measurable achievements in the text.
4. For any URLs (like github or link), ONLY extract EXACT URLs explicitly written in the text. Do NOT guess, infer, or hallucinate URLs based on tools or company names. If no valid, explicit URL is found, the value MUST be an empty string "". Do NOT provide explanations, comments, or placeholder text.
5. Output ONLY valid JSON. No markdown, no explanations, no wrapping code blocks. JUST the JSON object.

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
                "github": "String",
                "link": "String",
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

        // Return extracted data back to client
        return res.status(200).json({
            success: true,
            message: "Resume analyzed successfully",
            payload: {
                resumeData: extractedData.resumeData,
                atsScore: extractedData.atsScore
            }
        });

    }
    catch (err) {
        console.error("Resume Analysis Error:", err);
        return res.status(500).json({ success: false, message: "Failed to analyze resume", error: err.message });
    }
};
