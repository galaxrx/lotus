import { permanentRedirect } from "next/navigation";

// The artist page was renamed to "About us". Keep the old URL working (308).
export default function ArtistPage(): never {
  permanentRedirect("/about");
}
