import ComingSoonPage from "../../components/landing/ComingSoonPage";

export const metadata = {
  title: "peeyew radio — peeyew",
  description: "peeyew radio. coming soon.",
};

export default function Page() {
  return (
    <ComingSoonPage
      label="peeyew radio"
      backgroundColor="var(--color-redBrand)"
      textColor="#ffffff"
    />
  );
}