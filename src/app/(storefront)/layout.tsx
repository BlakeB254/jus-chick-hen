import { StorefrontNavbar } from "@/components/storefront/StorefrontNavbar";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StorefrontNavbar />
      <main>{children}</main>
      <StorefrontFooter />
    </>
  );
}
