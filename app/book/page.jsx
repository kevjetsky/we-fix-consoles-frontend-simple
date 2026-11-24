import BookingFlow from "@/components/booking/BookingFlow";

export const metadata = {
  title: "Book a Visit",
  description: "Book a mobile console repair visit in Houston. Pick a time and we come to your door.",
  // Beta: keep it out of search results until online booking goes live.
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return <BookingFlow />;
}
