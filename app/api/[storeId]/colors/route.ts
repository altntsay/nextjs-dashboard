
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

        const { name, value } = body;

        if (!userId) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }
        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }
        if (!value) {
            return NextResponse.json({ message: "Value is required" }, { status: 400 });
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
        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: storeId
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error(["COLORS_POST"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}

export async function GET(req: Request,
    { params }: { params: Promise<{ storeId: string}>}
) {

    try {
        const {storeId} = await params
        if(!storeId){
            return NextResponse.json({ message: "Store id is required" }, { status: 400 });
        }
        const colors = await prismadb.color.findMany({
            where: {
                storeId: storeId
            },
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.error(["COLORS_GET"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}