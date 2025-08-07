// app/api/recruiter/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/schemas/User";
import Company from "@/schemas/Company";
import { getToken } from "next-auth/jwt";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find user and exclude sensitive fields
    const user = await User.findById(token.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get company information if associated
    let company = null;
    if (user.companyId) {
      company = await Company.findById(user.companyId);
    }

    return NextResponse.json({
      user,
      company,
    });
  } catch (error: any) {
    console.error("Error fetching recruiter profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch recruiter profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const bio = data.get("bio") as string;
    const profileImage = data.get("profileImage") as File;

    // Company information
    const companyName = data.get("companyName") as string;
    const companyDescription = data.get("companyDescription") as string;
    const companyWebsite = data.get("companyWebsite") as string;
    const companyLogo = data.get("companyLogo") as File;

    await dbConnect();

    // Find user
    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare user update data
    const userUpdateData: any = {};
    if (name) userUpdateData.name = name;
    if (email) userUpdateData.email = email;
    if (phone) userUpdateData.phone = phone;
    if (bio) userUpdateData.bio = bio;

    // Handle profile image upload if provided
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const fileName = `recruiter-${token.id}-${Date.now()}-${
        profileImage.name
      }`;
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "profiles",
        fileName
      );

      // Write file to disk
      await writeFile(filePath, buffer);

      // Update user with profile image path
      userUpdateData.profileImage = `/uploads/profiles/${fileName}`;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(token.id, userUpdateData, {
      new: true,
    }).select("-password");

    // Handle company information
    let company = null;
    if (companyName) {
      // Check if user already has a company
      if (user.companyId) {
        // Update existing company
        const companyUpdateData: any = { name: companyName };
        if (companyDescription)
          companyUpdateData.description = companyDescription;
        if (companyWebsite) companyUpdateData.website = companyWebsite;

        // Handle company logo upload if provided
        if (companyLogo) {
          const bytes = await companyLogo.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename
          const fileName = `company-${user.companyId}-${Date.now()}-${
            companyLogo.name
          }`;
          const filePath = path.join(
            process.cwd(),
            "public",
            "uploads",
            "companies",
            fileName
          );

          // Write file to disk
          await writeFile(filePath, buffer);

          // Update company with logo path
          companyUpdateData.logo = `/uploads/companies/${fileName}`;
        }

        company = await Company.findByIdAndUpdate(
          user.companyId,
          companyUpdateData,
          { new: true }
        );
      } else {
        // Create new company
        const companyData: any = { name: companyName };
        if (companyDescription) companyData.description = companyDescription;
        if (companyWebsite) companyData.website = companyWebsite;

        // Handle company logo upload if provided
        if (companyLogo) {
          const bytes = await companyLogo.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename
          const fileName = `company-new-${Date.now()}-${companyLogo.name}`;
          const filePath = path.join(
            process.cwd(),
            "public",
            "uploads",
            "companies",
            fileName
          );

          // Write file to disk
          await writeFile(filePath, buffer);

          // Add logo path to company data
          companyData.logo = `/uploads/companies/${fileName}`;
        }

        company = await Company.create(companyData);

        // Update user with company ID
        await User.findByIdAndUpdate(token.id, { companyId: company._id });
      }
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
      company,
    });
  } catch (error: any) {
    console.error("Error updating recruiter profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update recruiter profile" },
      { status: 500 }
    );
  }
}
