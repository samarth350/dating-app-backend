const db = require("../config/db"); // tera db connection

exports.likeUser = async (req, res) => {
    const { liker_id, liked_id } = req.body;

    if (liker_id === liked_id) {
        return res.status(400).json({ message: "Cannot like yourself" });
    }

    try {
        // 1. Insert like
        await db.query(
            "INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [liker_id, liked_id]
        );

        // 2. Check reverse like
        const result = await db.query(
            "SELECT * FROM likes WHERE liker_id=$1 AND liked_id=$2",
            [liked_id, liker_id]
        );

        if (result.rows.length > 0) {
            // MATCH
            await db.query(
                "INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2)",
                [liker_id, liked_id]
            );

            // notifications for both
            await db.query(
                "INSERT INTO notifications (sender_id, receiver_id, type, message) VALUES ($1,$2,'match','It’s a match!')",
                [liker_id, liked_id]
            );

            await db.query(
                "INSERT INTO notifications (sender_id, receiver_id, type, message) VALUES ($1,$2,'match','It’s a match!')",
                [liked_id, liker_id]
            );

            return res.json({ message: "Match!" });
        }

        // Normal like notification
        await db.query(
            "INSERT INTO notifications (sender_id, receiver_id, type, message) VALUES ($1,$2,'like','Someone liked your profile')",
            [liker_id, liked_id]
        );

        res.json({ message: "Liked" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error liking user" });
    }
};