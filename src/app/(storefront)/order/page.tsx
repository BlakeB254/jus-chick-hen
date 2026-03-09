import { redirect } from "next/navigation";

export const metadata = {
  title: "Order Online | Jus Chick-Hen Chicago",
  description: "Order the best fried chicken in Chicago online. Hot honey chicken, wings, catfish, eggrolls, and more. Pickup or delivery.",
};

export default function OrderPage() {
  redirect("/menu");
}
