import { auth } from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
    req: Request,
    { params }: {params: Promise<{ categoryId:string}>}
) {
    try{
        const {categoryId} = await params

        if(!categoryId){
            return new NextResponse("Category id is required", {status:400});
        }
        const category = await prismadb.category.findUnique({
            where:{
                id:categoryId,
            },
            include:{
                billboard: true,
            }
        });

        return NextResponse.json(category);
    } catch(error){
        console.error(["CATEGORY_GET"], error);
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req: Request,
    { params }: {params: Promise<{storeId:string, categoryId:string}>}
) {
    try{
        const {storeId} = await params;
        const {categoryId} = await params;
        const { userId }= await auth();
        const body = await req.json();

        const { name,billboardId } = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{ status:401 });
        }

        if(!name){
            return new NextResponse("Name is required", { status:400 });
        }

        if(!billboardId){
            return new NextResponse("Billboard id is required", { status:400 });
        }

        if(!categoryId){
            return new NextResponse("Category id is required", {status:400});
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
        const category = await prismadb.category.updateMany({
            where:{
                id:categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);
    } catch(error){
        console.error(["CATEGORY_PATCH"], error);
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req: Request,
    { params }: {params: Promise<{storeId: string, categoryId:string}>}
) {
    try{
        const {storeId} = await params;
        const {categoryId} = await params;
        const { userId }= await auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{ status:401 });
        }

        if(!categoryId){
            return new NextResponse("Category id is required", {status:400});
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

        const category = await prismadb.category.deleteMany({
            where:{
                id:categoryId,
            }
        });

        return NextResponse.json(category);
    } catch(error){
        console.error(["CATEGORY_DELETE"], error);
        return new NextResponse("Internal error",{status:500})
    }
}