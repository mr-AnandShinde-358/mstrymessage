import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

// Query Schema
// console.log(verifySchema)

// not use this when you can export direct this function
// const verifyQuerySchema = z.object({
//   code: code,
// });

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    console.log(username, code);

    const decodedUsername = decodeURIComponent(username);
    const decodeVerifycode = decodeURIComponent(code);

    const verifyCode = {
      code: decodeVerifycode,
    };

    const result = verifySchema.safeParse(verifyCode);

    if (!result.success) {
      const codeErrors = result.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          messages:
            codeErrors?.length > 0 ? codeErrors.join(", ") : "Invalid code",
        },
        { status: 400 }
      );
    }
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account Verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please signup again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("Error verifying user");
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
