
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

        const { name,billboardId } = body;

        if (!userId) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }
        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }
        if (!billboardId) {
            return NextResponse.json({ message: "Billboard id is required" }, { status: 400 });
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
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: storeId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error(["CATEGORIES_POST"], error);
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
        const categories = await prismadb.category.findMany({
            where: {
                storeId: storeId
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error(["CATEGORIES_GET"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}