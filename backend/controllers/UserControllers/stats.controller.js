import { UserModel } from "../../models/UserModel.js";
import { ResumeModel } from "../../models/ResumeModel.js";

const githubCache = new Map();

export const getBasicStatsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role !== "STUDENT") {
            return res.status(403).json({ success: false, message: "The requested user is not a student" });
        }

        return res.status(200).json({ 
            success: true, 
            payload: {
                userName: user.name,
                githubUsername: user.githubUsername || null,
                leetcodeUsername: user.leetcodeUsername || null
            }
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch basic stats", error: err.message });
    }
}

export const getResumeStatsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

        const resumeRecord = await ResumeModel.findOne({ user: userId });
        
        return res.status(200).json({ 
            success: true, 
            payload: {
                resumeUrl: resumeRecord ? resumeRecord.resumeUrl : null,
                parsedResume: resumeRecord ? {
                    atsScore: resumeRecord.atsScore,
                    resumeData: resumeRecord.resumeData
                } : null
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch resume stats", error: err.message });
    }
}

export const getLeetcodeStatsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

        const user = await UserModel.findById(userId);
        if (!user || !user.leetcodeUsername) {
            return res.status(404).json({ success: false, message: "LeetCode username not found" });
        }

        const lcQuery = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
            }
        `;
        const lcRes = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com"
            },
            body: JSON.stringify({
                query: lcQuery,
                variables: { username: user.leetcodeUsername }
            })
        });

        if (!lcRes.ok) throw new Error("Failed to fetch LeetCode data");

        const lcData = await lcRes.json();
        if (lcData.data && lcData.data.matchedUser) {
            const submissions = lcData.data.matchedUser.submitStats.acSubmissionNum;
            const leetcode = {
                username: lcData.data.matchedUser.username,
                url: `https://leetcode.com/u/${lcData.data.matchedUser.username}/`,
                totalSolved: submissions.find(s => s.difficulty === "All")?.count || 0,
                easy: submissions.find(s => s.difficulty === "Easy")?.count || 0,
                medium: submissions.find(s => s.difficulty === "Medium")?.count || 0,
                hard: submissions.find(s => s.difficulty === "Hard")?.count || 0
            };
            return res.status(200).json({ success: true, payload: leetcode });
        } else {
            throw new Error("Invalid LeetCode data received");
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch LeetCode stats", error: err.message });
    }
}

export const getGithubStatsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

        const user = await UserModel.findById(userId);
        if (!user || !user.githubUsername) {
            return res.status(404).json({ success: false, message: "GitHub username not found" });
        }

        const now = Date.now();
        const cachedGH = githubCache.get(user.githubUsername);
        
        if (cachedGH && (now - cachedGH.lastFetched < 3600000)) {
            return res.status(200).json({ success: true, payload: cachedGH.data });
        }

        const ghRes = await fetch(`https://api.github.com/users/${user.githubUsername}`);
        if (!ghRes.ok) throw new Error("Failed to fetch GitHub data");

        const ghData = await ghRes.json();
        const githubStats = {
            username: ghData.login,
            avatar: ghData.avatar_url,
            url: ghData.html_url,
            followers: ghData.followers,
            following: ghData.following,
            publicRepos: ghData.public_repos
        };
        
        githubCache.set(user.githubUsername, { data: githubStats, lastFetched: now });
        
        return res.status(200).json({ success: true, payload: githubStats });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch GitHub stats", error: err.message });
    }
}
