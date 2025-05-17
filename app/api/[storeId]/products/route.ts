
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function POST(req: Request,
    { params }: { params: { storeId: string}}
) {

    try {
        const { userId } = await auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
         } = body;

        if (!userId) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }
        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400});
        }
        if (!price) {
            return NextResponse.json({ message: "Price is required" }, { status: 400 });
        }
        if (!categoryId) {
            return NextResponse.json({ message: "Category id is required" }, { status: 400 });
        }
        if (!colorId) {
            return NextResponse.json({ message: "Color id is required" }, { status: 400 });
        }
        if (!sizeId) {
            return NextResponse.json({ message: "Size id is required" }, { status: 400 });
        }
        if(!params.storeId){
            return NextResponse.json({ message: "Store id is required" }, { status: 400 });
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if(!storeByUserId){
           return new NextResponse("Unauthorized",{status : 403});
        }
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error(["BILLBOARDS_POST"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}

export async function GET(req: Request,
    { params }: { params: { storeId: string}}
) {

    try {
        if(!params.storeId){
            return NextResponse.json({ message: "Store id is required" }, { status: 400 });
        }
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            },
        });

        return NextResponse.json(billboards);
    } catch (error) {
        console.error(["BILLBOARDS_GET"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}