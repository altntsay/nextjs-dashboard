
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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: storeId,
                images:{
                    createMany:{
                        data: [
                            ...images.map((image:{url: string}) => image)
                        ]
                    }

                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error(["PRODUCTS_POST"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string}>}
) {
    
    try {
        const {storeId} = await params;
        const {searchParams} = new URL(req.url);
        const  categoryId = searchParams.get("categoryId") || undefined;
        const  colorId = searchParams.get("colorId") || undefined;
        const  sizeId = searchParams.get("sizeId") || undefined;
        const  isFeatured = searchParams.get("isFeatured");

        if(!storeId){
            return NextResponse.json({ message: "Store id is required" }, { status: 400 });
        }
        const products = await prismadb.product.findMany({
            where: {
                storeId: storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include:{
                images: true,
                category:true,
                color: true,
                size: true
            },
            orderBy:{
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error(["PRODUCTS_GET"], error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}