
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function POST(req: Request,
    { params }: { params: Promise<{ storeId: string}>}
) {

    try {
        const {storeId} = await params;
        const { userId } = await auth();
        const body = await req.json();

        const { label,imageUrl } = body;

        if (!userId) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }
        if (!label) {
            return NextResponse.json({ message: "Label is required" }, { status: 400 });
        }
        if (!imageUrl) {
            return NextResponse.json({ message: "Image URL is required" }, { status: 400 });
        }
        if(!storeId){
            return NextResponse.json({ message: "Store id is required" }, { status: 400 });
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: storeId
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error(["BILLBOARDS_POST"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}

export async function GET(req: Request,
    { params }: { params: Promise<{ storeId: string}>}
) {

    try {
        const {storeId} = await params;
        if(!storeId){
            return NextResponse.json({ message: "Store id is required" }, { status: 400 });
        }
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: storeId
            },
        });

        return NextResponse.json(billboards);
    } catch (error) {
        console.error(["BILLBOARDS_GET"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}