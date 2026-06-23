import ShopPage from "../../components/shop/ShopPage";

export const metadata = {
  title: "shop — peeyew",
  description: "Preorder peeyewMAGAZINE Issue 01 'PILOT'. $20, US shipping included.",
};

type SearchParams = { status?: string };

function normalizeStatus(
  value: string | undefined,
): "success" | "cancelled" | undefined {
  if (value === "success" || value === "cancelled") return value;
  return undefined;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status } = await searchParams;
  return <ShopPage initialStatus={normalizeStatus(status)} />;
}
