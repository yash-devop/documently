import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  Container,
} from "@repo/ui";
import { Reveal } from "./reveal";

const FAQS = [
  {
    q: "What can I upload?",
    a: "PDF files, through the paperclip in the composer or from documents you've uploaded before. Once a document finishes processing it stays in your library, so you can pull it into a fresh chat without uploading it again.",
  },
  {
    q: "Does it use anything besides my documents?",
    a: "No. Documently is prompted to answer only from the passages it retrieves out of your own files. It has no web search, and it's told not to draw on general knowledge, so if the answer isn't in your documents the honest response is that it isn't there.",
  },
  {
    q: "What happens if a document fails to process?",
    a: "It shows up marked Failed with the reason attached. You can detach it from that chat, or delete it entirely, and carry on with the documents that did index.",
  },
  {
    q: "Can I ask across several documents at once?",
    a: "Yes. A chat can hold multiple documents, and each question is matched against all of them at once, so one answer can draw on whichever files held the relevant text.",
  },
  {
    q: "Who can see my documents?",
    a: "Only your account. Documents, chats, and messages are tied to the account that created them, and you can delete a chat and its documents from the app yourself at any time.",
  },
  {
    q: "Do I need a credit card?",
    a: "No. There's no plan to pick and nothing to pay for. Create an account and start uploading.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-border-lighter py-20 sm:py-28"
    >
      <Container size="md">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Questions
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <Accordion className="w-full">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionHeader>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
