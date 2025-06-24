import { IVideo } from "@/models/Video";
import Video from "@/models/Video";
import { dbConnect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();
        const videos = await Video.find({ createdAt: -1 }).lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 });
        }
        return NextResponse.json({
            videos,
            message: "Videos fetched successfully"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            error: "Error in fetching videos."
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized request." }, 
                { status: 401 }
            )
        }

        await dbConnect();
        const body:IVideo = await req.json();
        if(!body.title || !body.description || !body.videourl || !body.thumbnailurl) {
            return NextResponse.json(
                {error: "Missing required fields."},
                {status: 400}
            )
        }

        const videoData = {
            ...body,
            controls:body.controls ?? true,
            transformation: {height: 1020, width: 1080 , quality: body.transformation?.quality ?? 100}
        }

        const newVideo = await Video.create({videoData});

        return NextResponse.json({newVideo}, {status:201})


    } catch (error) {
        return NextResponse.json({error: "Error in uploading video file"}, {status: 500})
    }
}