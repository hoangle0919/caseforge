import { caseStudyGenerationSchema } from "./case-study";
import type {
  LLMProvider,
  StructuredRequest,
  StructuredResult,
} from "./types";

/**
 * Deterministic provider for local development without an API key
 * (LLM_PROVIDER=mock). Returns a fixed case study so the full
 * input → generate → edit → export → share flow can be exercised for free.
 */
export class MockProvider implements LLMProvider {
  readonly name = "mock";

  async generateStructured<T>(
    request: StructuredRequest<T>,
  ): Promise<StructuredResult<T>> {
    await new Promise((r) => setTimeout(r, 800));
    const data = request.schema.parse(
      caseStudyGenerationSchema.parse(MOCK_CASE_STUDY),
    );
    return { data, model: "mock", inputTokens: 0, outputTokens: 0 };
  }
}

const MOCK_CASE_STUDY = {
  title: "Equity Price Pipeline for a 40-Member Finance Club",
  positioning:
    "Replaced hand-copied spreadsheet data with an automated pipeline the whole club relies on weekly.",
  problem:
    "Weekly stock pitches depended on price data copied by hand into spreadsheets — slow, error-prone, and different for every member.",
  context:
    "A university finance club where 40 members prepare stock pitches every week using public market data.",
  role: "Sole developer. Scoped the problem, chose the stack, built and deployed the pipeline, and onboarded the club.",
  built:
    "An automated scrape-clean-visualize pipeline: Selenium collects prices, pandas cleans and normalizes them, and a Streamlit dashboard serves the results to the whole club.",
  process:
    "Started with a manual prototype for one ticker, then generalized the scraper, added data validation after the first silent failure, and moved the dashboard from local to hosted once three members asked for access.",
  technicalDetails:
    "Python 3.11, Selenium with headless Chrome on a nightly cron, pandas for cleaning (outlier and split detection), Streamlit for the dashboard, SQLite for storage.",
  results:
    "Cut pitch prep from roughly 3 hours to 20 minutes per member per week, across 40 members. Zero data-copy errors since launch.",
  skills: ["Python", "Selenium", "pandas", "Streamlit", "Data pipelines"],
  learned:
    "Silent failures are worse than crashes — the week the scraper returned stale data taught me to validate outputs, not just exit codes.",
  resumeBullets: [
    "Built an automated equity price pipeline (Python, Selenium, pandas) that cut weekly pitch prep from ~3 hours to 20 minutes for 40 finance club members",
    "Designed data validation that detected stale and malformed scrapes, eliminating data-copy errors across 40+ weekly reports",
    "Deployed a Streamlit dashboard adopted as the club's standard research tool",
  ],
  interviewStory:
    "Situation: our finance club's 40 members each spent hours hand-copying price data for weekly pitches. Task: I wanted to eliminate that manual work entirely. Action: I built a nightly pipeline — Selenium scraper, pandas cleaning with validation, Streamlit dashboard — starting with one ticker and generalizing after the prototype held up. Result: prep time dropped from about 3 hours to 20 minutes per member, and the club adopted the dashboard as its standard tool.",
  linkedinPost:
    "Our finance club had a hidden tax: every one of our 40 members spent ~3 hours a week hand-copying stock data before they could even start their pitch. I built a pipeline that made that number 20 minutes. Selenium scrapes nightly, pandas validates and cleans, Streamlit serves a dashboard everyone shares. The best part wasn't the tech — it was deleting a spreadsheet ritual nobody questioned. If your team has a 'that's just how we do it' task, that's probably your highest-leverage project.",
  technicalSummary:
    "Nightly ETL pipeline: headless Selenium scraper → pandas cleaning layer with stale-data and outlier validation → SQLite → Streamlit dashboard. Cron-scheduled, with failure alerts. Chose scraping over paid APIs for zero budget; validation layer added after observing silent stale-data failures.",
  plainSummary:
    "I built a tool that automatically collects and checks stock market data every night, so 40 club members no longer copy numbers by hand. What took each person 3 hours a week now takes 20 minutes.",
  improvementChecklist: [
    "Add unit tests around the data validation layer",
    "Replace scraping with a free-tier market data API for reliability",
    "Add per-member watchlists to the dashboard",
    "Write a README with architecture diagram and setup steps",
    "Track dashboard usage to quantify adoption in the case study",
  ],
};
