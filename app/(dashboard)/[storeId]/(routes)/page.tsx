import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const {storeId} = await params
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
    },
  });

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <div>
      Active Store: {store?.name}
    </div>
  );
};

export default DashboardPage;

