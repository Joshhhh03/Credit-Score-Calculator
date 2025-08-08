import { RequestHandler } from "express";
import { FileStorage, UserProfile } from "../utils/fileStorage";
import crypto from "crypto";

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate unique user ID
function generateUserId(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Sign up new user
export const signUp: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: "Email, password, first name, and last name are required",
      });
    }

    // Check if user already exists
    const existingUser = await FileStorage.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    // Create new user profile
    const userId = generateUserId();
    const hashedPassword = hashPassword(password);

    const newUser: UserProfile = {
      userId,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      personalInfo: {
        firstName,
        lastName,
        phone: "",
        dateOfBirth: "",
        ssn: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      },
      traditionalCredit: {
        hasCredit: "unsure",
      },
      financialData: {
        employment: {
          employerName: "",
          jobTitle: "",
          annualSalary: 0,
          startDate: "",
          employmentType: "",
          workAddress: "",
        },
        housing: {
          housingType: "",
          rentPaymentHistory: [],
        },
        banking: {
          bankName: "",
          accountType: "",
          routingNumber: "",
          monthlyIncome: 0,
          monthlyExpenses: 0,
          averageBalance: 0,
        },
        utilities: [],
      },
      creditHistory: [],
      analytics: {
        strengths: [],
        weaknesses: [],
        recommendations: [],
        riskProfile: "medium",
        loanEligibility: {
          creditCards: false,
          personalLoans: false,
          autoLoans: false,
          mortgages: false,
        },
      },
    };

    await FileStorage.saveUserProfile(newUser);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        userId,
        email,
        firstName,
        lastName,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({
      error: "Failed to create user account",
    });
  }
};

// Sign in existing user
export const signIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await FileStorage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    await FileStorage.saveUserProfile(user);

    res.json({
      success: true,
      message: "Signed in successfully",
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.personalInfo.firstName,
        lastName: user.personalInfo.lastName,
        lastLogin: user.lastLogin,
        hasCompletedProfile: !!(
          user.personalInfo.dateOfBirth &&
          user.financialData.employment.employerName &&
          user.financialData.housing.housingType
        ),
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({
      error: "Failed to sign in",
    });
  }
};

// Get user profile
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await FileStorage.loadUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Remove password from response
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Failed to get user profile",
    });
  }
};

// Update user profile
export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await FileStorage.loadUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Deep merge update data
    const updatedUser: UserProfile = {
      ...user,
      ...updateData,
      personalInfo: {
        ...user.personalInfo,
        ...updateData.personalInfo,
      },
      traditionalCredit: {
        ...user.traditionalCredit,
        ...updateData.traditionalCredit,
      },
      financialData: {
        ...user.financialData,
        ...updateData.financialData,
        employment: {
          ...user.financialData.employment,
          ...updateData.financialData?.employment,
        },
        housing: {
          ...user.financialData.housing,
          ...updateData.financialData?.housing,
        },
        banking: {
          ...user.financialData.banking,
          ...updateData.financialData?.banking,
        },
      },
    };

    await FileStorage.saveUserProfile(updatedUser);

    // Remove password from response
    const { password, ...userProfile } = updatedUser;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Failed to update profile",
    });
  }
};

// Change password
export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    const user = await FileStorage.loadUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Verify current password
    if (!verifyPassword(currentPassword, user.password)) {
      return res.status(401).json({
        error: "Current password is incorrect",
      });
    }

    // Update password
    user.password = hashPassword(newPassword);
    await FileStorage.saveUserProfile(user);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      error: "Failed to change password",
    });
  }
};

// Validate session
export const validateSession: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        valid: false,
        error: "User ID is required",
      });
    }

    const user = await FileStorage.loadUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        valid: false,
        error: "User not found",
      });
    }

    // Check if account is active (not deleted)
    if (user.email.startsWith("deleted_")) {
      return res.status(401).json({
        valid: false,
        error: "Account has been deleted",
      });
    }

    res.json({
      valid: true,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.personalInfo.firstName,
        lastName: user.personalInfo.lastName,
        lastLogin: user.lastLogin,
        hasCompletedProfile: !!(
          user.personalInfo.dateOfBirth &&
          user.financialData.employment.employerName &&
          user.financialData.housing.housingType
        ),
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    res.status(500).json({
      valid: false,
      error: "Failed to validate session",
    });
  }
};

// Delete user account
export const deleteAccount: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const user = await FileStorage.loadUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Verify password before deletion
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({
        error: "Password is incorrect",
      });
    }

    // In a real implementation, you would delete the user files
    // For now, we'll just mark the account as deleted
    user.email = `deleted_${Date.now()}@deleted.com`;
    await FileStorage.saveUserProfile(user);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      error: "Failed to delete account",
    });
  }
};
