import { StorefrontNavbar } from "@/components/storefront/StorefrontNavbar";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { Toast } from "@/components/ui/Toast";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <StorefrontNavbar />
      <main className="pt-[72px]">{children}</main>
      <StorefrontFooter />
      <Toast />
    </>
  );
}
