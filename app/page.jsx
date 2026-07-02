import config from "@/config/wedding.json";
import WeddingApp from "@/components/WeddingApp";
import Invitation from "@/components/Invitation";
import Ceremony from "@/components/Ceremony";
import Venue from "@/components/Venue";
import GiftRegistry from "@/components/GiftRegistry";
import RSVP from "@/components/RSVP";
import Closing from "@/components/Closing";

export default function Home() {
  return (
    <main>
      <WeddingApp config={config}>
        <Invitation />
        <Ceremony />
        <Venue />
        <GiftRegistry />
        <RSVP />
        <Closing />
      </WeddingApp>
    </main>
  );
}
