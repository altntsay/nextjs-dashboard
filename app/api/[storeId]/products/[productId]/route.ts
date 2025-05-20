import { auth } from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";
export async function GET(
    req: Request,
    { params }: {params: Promise<{ productId:string}>}
) {
    try{
        const {productId} = await params;
        if(!productId){
            return new NextResponse("Product id is required", {status:400});
        }
        const product = await prismadb.product.findUnique({
            where:{
                id:productId,
            },
            include: {
                images: true,
                category: true,
                size:true,
                color:true
            }
        });
        console.log(product)
        return NextResponse.json(product);
    } catch(error){
        console.error(["PRODUCT_GET"], error);
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req: Request,
    { params }: {params: Promise<{storeId:string, productId:string}>}
) {
    try{
        const {storeId} = await params;
        const {productId} = await params;
        const { userId }= await auth();
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

        if(!userId){
            return new NextResponse("Unauthenticated",{ status:401 });
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

        if(!productId){
            return new NextResponse("Product id is required", {status:400});
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
        await prismadb.product.update({
            where:{
                id:productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived,
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: productId
            },
            data:{
                images: {
                    createMany:{
                        data:[
                            ...images.map((image: {url: string }) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
    } catch(error){
        console.error(["PRODUCT_PATCH"], error);
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req: Request,
    { params }: {params: Promise<{storeId: string, productId:string}>}
) {
    try{
        const {storeId} = await params;
        const {productId} = await params;
        const { userId }= await auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{ status:401 });
        }

        if(!productId){
            return new NextResponse("Product id is required", {status:400});
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

        const product = await prismadb.product.deleteMany({
            where:{
                id:productId,
            }
        });

        return NextResponse.json(product);
    } catch(error){
        console.error(["PRODUCT_DELETE"], error);
        return new NextResponse("Internal error",{status:500})
    }
}