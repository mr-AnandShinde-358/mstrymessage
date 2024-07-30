import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request:Request) {
    await dbConnect();

    const {username,content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"user Not found"
                },{
                    status:401
                }
            )
        }
        // is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User not accepting the message"
            },{status:403})
        }

        const newMessage = {content, createAt:new Date()}
        
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success:true,
            message:"message send successfully"
        },{
            status:200
        })
    } catch (error) {
        console.log("An unexpected error occured:",error)
        return Response.json({
            success:true,
            message:"An unexpected error"
        },{
            status:500
        })
    }
    
}