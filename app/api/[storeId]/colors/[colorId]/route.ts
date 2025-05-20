import { auth } from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
    req: Request,
    { params }: {params: Promise<{ colorId:string}>}
) {
    try{
        const {colorId} = await params;

        if(!colorId){
            return new NextResponse("Size id is required", {status:400});
        }
        const color = await prismadb.size.findUnique({
            where:{
                id:colorId,
            }
        });

        return NextResponse.json(color);
    } catch(error){
        console.error(["COLOR_GET"], error);
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req: Request,
    { params }: {params: Promise<{storeId:string, colorId:string}>}
) {
    try{
        const {storeId} = await params;
        const {colorId} = await params;

        const { userId }= await auth();
        const body = await req.json();

        const { name,value } = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{ status:401 });
        }

        if(!name){
            return new NextResponse("Name is required", { status:400 });
        }

        if(!value){
            return new NextResponse("Value is required", { status:400 });
        }

        if(!colorId){
            return new NextResponse("Color id is required", {status:400});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })
        if(!storeByUserId){
           return new NextResponse("Unauthorized",{status : 403});
        }
        const color = await prismadb.color.updateMany({
            where:{
                id:colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
    } catch(error){
        console.error(["COLOR_PATCH"], error);
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req: Request,
    { params }: {params: Promise<{storeId: string, colorId:string}>}
) {
    try{
        const {storeId} = await params;
        const {colorId} = await params;
        const { userId }= await auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{ status:401 });
        }

        if(!colorId){
            return new NextResponse("Color id is required", {status:400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })
        if(!storeByUserId){
           return new NextResponse("Unauthorized",{status : 403});
        }

        const color = await prismadb.color.deleteMany({
            where:{
                id:colorId,
            }
        });

        return NextResponse.json(color);
    } catch(error){
        console.error(["COLOR_DELETE"], error);
        return new NextResponse("Internal error",{status:500})
    }
}