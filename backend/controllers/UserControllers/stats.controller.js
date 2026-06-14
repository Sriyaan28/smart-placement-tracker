import { UserModel } from "../../models/UserModel.js";

export const getCodingStatsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // check if the user id is a STUDENT
        if (user.role !== "STUDENT") {
            return res.status(403).json({ success: false, message: "The requested user is not a student" });
        }

        const stats = {
            github: null,
            leetcode: null
        };

        // Fetch GitHub Stats
        if (user.githubUsername) {
            try {
                const ghRes = await fetch(`https://api.github.com/users/${user.githubUsername}`);
                if (ghRes.ok) {
                    const ghData = await ghRes.json();
                    stats.github = {
                        username: ghData.login,
                        avatar: ghData.avatar_url,
                        url: ghData.html_url,
                        followers: ghData.followers,
                        following: ghData.following,
                        publicRepos: ghData.public_repos
                    };
                }
            } catch (error) {
                console.error("Failed to fetch GitHub stats:", error);
            }
        }

        // Fetch LeetCode Stats
        if (user.leetcodeUsername) {
            try {
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

                if (lcRes.ok) {
                    const lcData = await lcRes.json();
                    if (lcData.data && lcData.data.matchedUser) {
                        const submissions = lcData.data.matchedUser.submitStats.acSubmissionNum;
                        stats.leetcode = {
                            username: lcData.data.matchedUser.username,
                            url: `https://leetcode.com/u/${lcData.data.matchedUser.username}/`,
                            totalSolved: submissions.find(s => s.difficulty === "All")?.count || 0,
                            easy: submissions.find(s => s.difficulty === "Easy")?.count || 0,
                            medium: submissions.find(s => s.difficulty === "Medium")?.count || 0,
                            hard: submissions.find(s => s.difficulty === "Hard")?.count || 0
                        };
                    }
                }
            } catch (error) {
                console.error("Failed to fetch LeetCode stats:", error);
            }
        }

        return res.status(200).json({ success: true, payload: stats });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch stats", error: err.message });
    }
}
