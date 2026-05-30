/*import BlueLanding from "../components/landing/BlueLanding";

export default function Page() {
  return <BlueLanding />;
}*/

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/peeyewmag");
}
