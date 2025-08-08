import { RequestHandler } from "express";

interface UserRating {
  id: string;
  userId?: string;
  rating: number;
  feedback: string;
  userScore?: number;
  trigger: "score-display" | "dashboard-visit" | "manual";
  userName?: string;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}

// Mock database for ratings
const ratings: Map<string, UserRating> = new Map();

// Submit a new rating
export const submitRating: RequestHandler = (req, res) => {
  try {
    const { 
      rating, 
      feedback, 
      userScore, 
      trigger, 
      userName, 
      userId 
    } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: "Rating must be between 1 and 5" 
      });
    }

    const ratingId = Date.now().toString();
    const newRating: UserRating = {
      id: ratingId,
      userId: userId || `anonymous_${Date.now()}`,
      rating: parseInt(rating),
      feedback: feedback || "",
      userScore: userScore ? parseInt(userScore) : undefined,
      trigger,
      userName: userName || "Anonymous",
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress
    };

    ratings.set(ratingId, newRating);

    res.json({
      success: true,
      message: "Rating submitted successfully",
      ratingId: ratingId,
      data: {
        rating: newRating.rating,
        timestamp: newRating.timestamp
      }
    });

  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ 
      error: "Failed to submit rating" 
    });
  }
};

// Get rating statistics
export const getRatingStats: RequestHandler = (req, res) => {
  try {
    const allRatings = Array.from(ratings.values());
    
    if (allRatings.length === 0) {
      return res.json({
        totalRatings: 0,
        averageRating: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentRatings: []
      });
    }

    const totalRatings = allRatings.length;
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
    
    const distribution = allRatings.reduce((dist, r) => {
      dist[r.rating as keyof typeof dist]++;
      return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const recentRatings = allRatings
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(r => ({
        id: r.id,
        rating: r.rating,
        feedback: r.feedback,
        userName: r.userName,
        timestamp: r.timestamp,
        userScore: r.userScore,
        trigger: r.trigger
      }));

    res.json({
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      distribution,
      recentRatings,
      highRatingPercentage: Math.round(((distribution[4] + distribution[5]) / totalRatings) * 100),
      responseRate: totalRatings // In a real app, this would be calculated against total users
    });

  } catch (error) {
    console.error("Error getting rating stats:", error);
    res.status(500).json({ 
      error: "Failed to get rating statistics" 
    });
  }
};

// Get individual user's rating history
export const getUserRatings: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        error: "User ID is required" 
      });
    }

    const userRatings = Array.from(ratings.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      userId,
      ratings: userRatings.map(r => ({
        id: r.id,
        rating: r.rating,
        feedback: r.feedback,
        timestamp: r.timestamp,
        trigger: r.trigger,
        userScore: r.userScore
      })),
      totalSubmitted: userRatings.length,
      latestRating: userRatings[0] || null
    });

  } catch (error) {
    console.error("Error getting user ratings:", error);
    res.status(500).json({ 
      error: "Failed to get user ratings" 
    });
  }
};

// Update an existing rating
export const updateRating: RequestHandler = (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating, feedback } = req.body;

    const existingRating = ratings.get(ratingId);
    if (!existingRating) {
      return res.status(404).json({ 
        error: "Rating not found" 
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        error: "Rating must be between 1 and 5" 
      });
    }

    const updatedRating: UserRating = {
      ...existingRating,
      rating: rating || existingRating.rating,
      feedback: feedback !== undefined ? feedback : existingRating.feedback,
      timestamp: new Date().toISOString()
    };

    ratings.set(ratingId, updatedRating);

    res.json({
      success: true,
      message: "Rating updated successfully",
      data: {
        rating: updatedRating.rating,
        feedback: updatedRating.feedback,
        timestamp: updatedRating.timestamp
      }
    });

  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ 
      error: "Failed to update rating" 
    });
  }
};

// Get public testimonials (anonymized high ratings with feedback)
export const getTestimonials: RequestHandler = (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const testimonials = Array.from(ratings.values())
      .filter(r => r.rating >= 4 && r.feedback && r.feedback.trim().length > 10)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, parseInt(limit as string))
      .map(r => ({
        id: r.id,
        rating: r.rating,
        feedback: r.feedback,
        userName: r.userName?.split(' ')[0] || 'Anonymous', // Only first name for privacy
        timestamp: r.timestamp,
        scoreImprovement: r.userScore ? Math.max(0, r.userScore - 600) : undefined
      }));

    res.json({
      testimonials,
      total: testimonials.length
    });

  } catch (error) {
    console.error("Error getting testimonials:", error);
    res.status(500).json({ 
      error: "Failed to get testimonials" 
    });
  }
};
