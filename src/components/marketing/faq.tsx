import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Isn't this just a ChatGPT wrapper?",
    a: "A chat window gives you a blank page and generic prose. CaseForge runs your raw material through a fixed case-study structure — problem, role, process, evidence, results — then produces every derivative you actually need: resume bullets, a LinkedIn post, an interview story, summaries at two technical levels, and a shareable page. The value is the structure, the outputs, and the workflow, not the model call.",
  },
  {
    q: "My project feels too small to be worth a case study.",
    a: "Small projects usually read as small because they're described badly, not because they are small. A class project with a clear problem, a real decision you made, and a measured result reads better than a vague 'built a full-stack app'. CaseForge is designed to surface exactly those parts.",
  },
  {
    q: "Can I paste the output straight into my resume or LinkedIn?",
    a: "Yes — resume bullets follow the action-verb + what-you-did + quantified-result format recruiters expect, and the LinkedIn post is written to be posted as-is. Everything is editable before you export, and you should edit: you know details the draft doesn't.",
  },
  {
    q: "Do you need access to my code or accounts?",
    a: "No. You paste what you choose to paste — notes, README text, links, bullet fragments. CaseForge never connects to your repos or accounts, and your input is only used to generate your outputs.",
  },
  {
    q: "What exactly does the free tier include?",
    a: "One complete case study with all core outputs and Markdown export, no card required. That's deliberate: run your best project through it and judge the result before paying anything.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. It's a $5/month subscription through Stripe — cancel in one click from the billing page, keep access until the end of the period, and your exported files are yours forever.",
  },
];

export function Faq() {
  return (
    <Accordion multiple={false} className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q}>
          <AccordionTrigger className="text-left text-base">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
